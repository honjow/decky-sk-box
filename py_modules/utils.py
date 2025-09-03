#!/usr/bin/python
# coding=utf-8

import configparser
import glob
import json
import os
import pwd
import queue
import random
import subprocess
import threading

from config import (
    ASUS_ALLY_HID_MOD_NAME,
    HIBERNATE_DELAY_FILE,
    SK_TOOL_SCRIPTS_PATH,
    USER,
    USER_HOME,
    logger,
)
from py_enum import SleepMode


def get_env():
    env = os.environ.copy()
    env["LD_LIBRARY_PATH"] = ""
    return env


# 执行命令
def run_command(command, name=""):
    success = True
    ret_msg = ""
    stderr_queue = queue.Queue()  # 创建一个队列来存储stderr的内容
    logger.debug(f"执行{name}操作")
    try:
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            env=get_env(),
        )

        def reader_thread(process, stream_name):
            stream = getattr(process, stream_name)
            for line in iter(stream.readline, ""):
                logger.info(line.strip())
                if stream_name == "stderr":  # 如果是读取stderr，那么将内容添加到队列中
                    while not stderr_queue.empty():  # 清空队列
                        stderr_queue.get()
                    stderr_queue.put(line.strip())

        for stream_name in ("stdout", "stderr"):
            threading.Thread(target=reader_thread, args=(process, stream_name)).start()

        process.wait()

        if process.returncode != 0:
            success = False
            if not stderr_queue.empty():  # 从队列中获取stderr的内容
                ret_msg = stderr_queue.get()
            logger.error(f"{name}操作失败: {ret_msg}")

    except Exception as e:
        success = False
        ret_msg = str(e)
        logger.error(f"{name}操作失败: {ret_msg}")

    return success, ret_msg


def get_package_version(package_name):
    try:
        # 运行pacman命令并捕获输出
        result = subprocess.run(
            f"sudo pacman -Q {package_name}",
            shell=True,
            text=True,
            check=True,
            stderr=subprocess.PIPE,
            stdout=subprocess.PIPE,
            env=get_env(),
        )

        # 获取输出中的版本号部分
        version = result.stdout.strip().split(" ")[1]

        return version
    except subprocess.CalledProcessError as e:
        # return f"Error: Package '{package_name}' not found"
        logger.error(
            f"获取包版本失败: {e}, cmd: {e.cmd}, out: {e.stdout}, err: {e.stderr}"
        )
        return ""


# 检查服务是否已启用
def service_is_enabled(service_name):
    status = get_service_enable_satus(service_name)
    return status == "enabled"


def service_is_masked(service_name):
    status = get_service_enable_satus(service_name)
    return status == "masked"


def get_service_enable_satus(service_name) -> str:
    try:
        result = subprocess.run(
            f"sudo systemctl is-enabled {service_name}",
            shell=True,
            text=True,
            check=False,
            stderr=subprocess.PIPE,
            stdout=subprocess.PIPE,
            env=get_env(),
        )
        stdout = result.stdout.strip()
        logger.info(f"检查服务 {service_name} 启用状态: {stdout}")
        return stdout
    except subprocess.CalledProcessError as e:
        logger.error(
            f"检查服务 {service_name} 是否已启用失败, cmd: {e.cmd}, out: {e.stdout}, err: {e.stderr}"
        )
        # 如果命令执行出错，则服务可能不存在或无法访问
        return ""
    except Exception as e:
        logger.error(f"检查服务 {service_name} 是否已启用失败: {e}", exc_info=True)
        return ""


def check_service_active(service_name):
    try:
        output = (
            subprocess.check_output(
                ["sudo", "systemctl", "is-active", service_name], env=get_env()
            )
            .decode()
            .strip()
        )
        return output == "active"
    except subprocess.CalledProcessError as e:
        logger.error(
            f"服务 {service_name} 不存在或无法访问: {e}, cmd: {e.cmd}, out: {e.stdout}, err: {e.stderr}"
        )
        return False


def check_service_exists(service_name):
    try:
        output = subprocess.run(
            ["sudo", "systemctl", "status", service_name],
            capture_output=True,
            text=True,
            check=False,
            env=get_env(),
        )
        stderr = output.stderr.strip()
        stdout = output.stdout.strip()

        logger.info(f"check {service_name}\nstderr = {stderr}\nstdout = {stdout}")

        return "Could not find unit" not in stderr and "Loaded: not-found" not in stdout
    except subprocess.CalledProcessError as e:
        logger.error(
            f"服务 {service_name} 不存在或无法访问: {e}, cmd: {e.cmd}, out: {e.stdout}, err: {e.stderr}"
        )
        return False


def toggle_service(service_name, enable):
    action = "enable" if enable else "disable"
    try:
        sudo_cmd = ["sudo", "systemctl", action, "--now", service_name]
        subprocess.run(sudo_cmd, check=True, env=get_env())
        logger.info(f"服务 {service_name} {action}成功")
    except subprocess.CalledProcessError as e:
        logger.error(
            f"服务 {service_name} {action}失败: {e}, cmd: {e.cmd}, out: {e.stdout}, err: {e.stderr}"
        )
    except Exception as e:
        logger.error(f"服务 {service_name} {action}失败: {e}")


def toggle_service_mask(service_name, isMask):
    current_status = get_service_enable_satus(service_name)
    if isMask and current_status != "masked":
        sudo_cmd = ["sudo", "systemctl", "mask", service_name]
    elif not isMask and current_status == "masked":
        sudo_cmd = ["sudo", "systemctl", "unmask", service_name]
    else:
        logger.info(f"服务 {service_name} 已经是 {current_status}")
        return
    try:
        subprocess.run(sudo_cmd, check=True, env=get_env())
        logger.info(f"服务 {service_name} {sudo_cmd[2]}成功")
    except subprocess.CalledProcessError as e:
        logger.error(
            f"服务 {service_name} {sudo_cmd[2]}失败: {e}, cmd: {e.cmd}, out: {e.stdout}, err: {e.stderr}"
        )
    except Exception as e:
        logger.error(f"服务 {service_name} {sudo_cmd[2]}失败: {e}", exc_info=True)


def check_decky_plugin_exists(plugin_name):
    exists = os.path.isfile(
        os.path.expanduser(f"~/homebrew/plugins/{plugin_name}/plugin.json")
    )
    logger.debug(f"检查插件 {plugin_name} 是否存在: {exists}")
    return exists


def chk_hibernate():
    file_path = "/etc/systemd/system/systemd-suspend.service"
    check_content = "systemd-sleep hibernate"

    try:
        with open(file_path, "r") as file:
            lines = file.readlines()
            for line in lines:
                if check_content in line:
                    return True
    except FileNotFoundError:
        return False
    return False


def set_hibernate(enabled):
    old_file = "/etc/systemd/sleep.conf.d/sleep.conf"
    # 判断文件是否存在
    old_file_exists = os.path.isfile(old_file)
    if old_file_exists:
        run_command("sudo rm -f /etc/systemd/sleep.conf.d/sleep.conf")
        run_command("sudo systemctl kill -s HUP systemd-logind")

    if enabled:
        run_command(
            "sudo cp /lib/systemd/system/systemd-hibernate.service /etc/systemd/system/systemd-suspend.service"
        )
    else:
        run_command("sudo rm -f /etc/systemd/system/systemd-suspend.service")
    # 生效
    run_command("sudo systemctl daemon-reload")


def get_sleep_mode() -> SleepMode:
    file_path = "/etc/systemd/system/systemd-suspend.service"
    hibernate_content = "systemd-sleep hibernate"
    suspend_then_hibernate_content = "systemd-sleep suspend-then-hibernate"
    if not os.path.isfile(file_path):
        return SleepMode.SUSPEND
    try:
        with open(file_path, "r") as file:
            lines = file.readlines()
            for line in lines:
                if hibernate_content in line:
                    return SleepMode.HIBERNATE
                if suspend_then_hibernate_content in line:
                    return SleepMode.SUSPEND_THEN_HIBERNATE
    except Exception:
        logger.error("获取休眠类型失败", exc_info=True)
        return SleepMode.SUSPEND
    return SleepMode.SUSPEND


def set_sleep_mode(sleep_mode: SleepMode):
    logger.info(f"设置睡眠类型: {sleep_mode}")
    if sleep_mode == SleepMode.HIBERNATE:
        run_command(
            "sudo cp /lib/systemd/system/systemd-hibernate.service /etc/systemd/system/systemd-suspend.service"
        )
    elif sleep_mode == SleepMode.SUSPEND_THEN_HIBERNATE:
        run_command(
            "sudo cp /lib/systemd/system/systemd-suspend-then-hibernate.service /etc/systemd/system/systemd-suspend.service"
        )
    else:
        run_command("sudo rm -f /etc/systemd/system/systemd-suspend.service")
    # 生效
    run_command("sudo systemctl daemon-reload")


def set_hibernate_delay(timeout: str):
    logger.info(f"设置 hibernate_delay: {timeout}")
    file_path = HIBERNATE_DELAY_FILE
    if not os.path.isfile(file_path):
        run_command("sudo mkdir -p /etc/systemd/sleep.conf.d")
        run_command(f"sudo touch {file_path}")
    run_command(f"sudo echo -e '[Sleep]\nHibernateDelaySec={timeout}' > {file_path}")
    run_command("sudo systemctl kill -s HUP systemd-logind")


def get_hibernate_delay() -> str:
    file_path = HIBERNATE_DELAY_FILE
    if not os.path.isfile(file_path):
        return ""
    try:
        with open(file_path, "r") as file:
            lines = file.readlines()
            for line in lines:
                if "HibernateDelaySec" in line:
                    return line.split("=")[1].strip()
    except FileNotFoundError:
        return ""
    return ""


def chk_grub_quiet_boot():
    file_path = "/etc/default/grub_quiet"
    if not os.path.isfile(file_path):
        return False
    try:
        with open(file_path, "r") as file:
            content = file.readline().strip()
            if "quiet" == content:
                return True
    except FileNotFoundError:
        return False


def chk_override_bitrate():
    file_path = "/usr/share/wireplumber/main.lua.d/50-alsa-config.lua"
    try:
        with open(file_path, "r") as file:
            content = file.read()
            return '--["audio.format"]' not in content
    except FileNotFoundError:
        return False


def clear_cache():
    command = "sudo rm -f /var/lib/pacman/db.lck ; rm -rf ~/.cache/sk-holoiso-config/* ; rm -rf ~/.local/share/pnpm/store/* ; yay -Scc --noconfirm"
    return run_command(command, "清除缓存")


def boot_repair():
    command = "sudo /usr/bin/sk-chos-boot-fix"
    return run_command(command, "修复启动项")


def etc_repair():
    command = f"sudo {SK_TOOL_SCRIPTS_PATH}/etc_repair.sh"
    success, ret_msg = run_command(command, "修复 /etc")
    if success:
        ret_msg = "重置完成, 重启生效"
    return success, ret_msg


def re_first_run():
    # command = "sk-first-run"
    command = f"sudo -u {USER} bash -c '/usr/bin/sk-first-run'"
    success, ret_msg = run_command(command, "重新运行首次配置脚本")
    return success, ret_msg


def make_swapfile():
    command = f"sudo {SK_TOOL_SCRIPTS_PATH}/make_swapfile.sh"
    success, ret_msg = run_command(command, "重新创建swapfile")
    if success:
        ret_msg = "重新创建swapfile完成, 重启生效"
    return success, ret_msg


def etc_repair_full():
    command = f"sudo {SK_TOOL_SCRIPTS_PATH}/etc_repair.sh full && sk-first-run"
    success, ret_msg = run_command(command, "修复 /etc (完全)")
    if success:
        ret_msg = "重置完成, 重启生效"
    return success, ret_msg


def reset_gnome():
    command = "sudo dconf update && dconf reset -f /"
    success, ret_msg = run_command(command, "重置 GNOME 桌面")
    return success, ret_msg


def chk_firmware_override():
    file_path = "/etc/device-quirks/device-quirks.conf"
    if not os.path.isfile(file_path):
        return False
    try:
        with open(file_path, "r") as file:
            content = file.readlines()
            for line in content:
                if "USE_FIRMWARE_OVERRIDES=1" in line:
                    return True
    except FileNotFoundError:
        return False


def set_firmware_override(enable):
    if enable:
        run_command("sudo sk-firmware-override enable")
    else:
        run_command("sudo sk-firmware-override disable")


def chk_usb_wakeup():
    file_path = "/etc/device-quirks/device-quirks.conf"
    if not os.path.isfile(file_path):
        return False
    try:
        with open(file_path, "r") as file:
            content = file.readlines()
            for line in content:
                if "USB_WAKE_ENABLED=1" in line:
                    return True
    except FileNotFoundError:
        return False


def set_usb_wakeup(enable):
    conf_path = "/etc/device-quirks/device-quirks.conf"
    enable_str = "USB_WAKE_ENABLED=1"
    disable_str = "USB_WAKE_ENABLED=0"
    if enable:
        logger.info("开启USB唤醒")
        run_command(f"sudo sed -i 's/{disable_str}/{enable_str}/g' {conf_path}")
    else:
        logger.info("关闭USB唤醒")
        run_command(f"sudo sed -i 's/{enable_str}/{disable_str}/g' {conf_path}")
    run_command("sudo frzr-tweaks")
    logger.info("USB唤醒设置完成")


def get_github_clone_cdn():
    config_file = "/etc/sk-chos-tool/github_cdn.conf"
    cdn = get_config_value(config_file, "clone", "server") or ""
    cdn_list = cdn.split(":::")
    # random select one
    cdn = cdn_list[random.randint(0, len(cdn_list) - 1)]
    logger.info(f"github clone cdn: {cdn}")
    if cdn is not None:
        clear_cache()
    return cdn


def get_github_release_cdn():
    config_file = "/etc/sk-chos-tool/github_cdn.conf"
    cdn = get_config_value(config_file, "release", "server") or ""
    cdn_list = cdn.split(":::")
    # random select one
    cdn = cdn_list[random.randint(0, len(cdn_list) - 1)]
    logger.info(f"github release cdn: {cdn}")
    if cdn is not None:
        clear_cache()
    return cdn


def get_github_raw_cdn():
    config_file = "/etc/sk-chos-tool/github_cdn.conf"
    cdn = get_config_value(config_file, "raw", "server") or ""
    cdn_list = cdn.split(":::")
    # random select one
    cdn = cdn_list[random.randint(0, len(cdn_list) - 1)]
    logger.info(f"github raw cdn: {cdn}")
    if cdn is not None:
        clear_cache()
    return cdn


def check_emudeck_exists():
    appimage_path = "~/Applications/EmuDeck.AppImage"
    # check if appimage exists
    return os.path.isfile(os.path.expanduser(appimage_path))


def user_noto_fonts_cjk_exists():
    return os.path.isdir(os.path.expanduser("~/.fonts/noto-cjk"))


def check_nix_exists():
    nix_file = "/nix/store/*-nix-*/bin/nix"
    matching_files = glob.glob(nix_file)
    return len(matching_files) > 0


def update_ini_file(file_path, section, key, new_value):
    config = configparser.ConfigParser()

    # 不保留section前缀
    config.optionxform = lambda option: option.split(".")[-1]

    # 读取配置文件，如果文件不存在，会创建一个新的空文件
    config.read(file_path)

    # 检查类别是否存在，如果不存在则创建
    if not config.has_section(section):
        config.add_section(section)

    # 添加或更新键值对
    config.set(section, key, new_value)

    # 保存配置文件
    with open(file_path, "w") as configfile:
        config.write(configfile)


def get_config_value(file_path, section, key):
    config = configparser.ConfigParser()
    # 不保留section前缀
    config.optionxform = lambda option: option.split(".")[-1]

    config.read(file_path)

    if config.has_section(section) and config.has_option(section, key):
        value = config.get(section, key)
        return value
    else:
        return None


def get_autoupdate_config(key):
    conf_dir = f"{USER_HOME}/.config/sk-chos-tool"
    os.makedirs(conf_dir, exist_ok=True)
    config_file = f"{conf_dir}/autoupdate.conf"
    section = "autoupdate"
    value = get_config_value(config_file, section, key)
    logger.debug(f">>>>> get_autoupdate_config: {key} = {value}")
    if value is None:
        value = "true"
        set_autoupdate_config(key, value)
    recursive_chown_conf()
    return value


def set_autoupdate_config(key, value):
    conf_dir = f"{USER_HOME}/.config/sk-chos-tool"
    os.makedirs(conf_dir, exist_ok=True)
    config_file = f"{conf_dir}/autoupdate.conf"
    section = "autoupdate"
    update_ini_file(config_file, section, key, value)
    recursive_chown_conf()


def set_autoupdate(pkg_name, enable):
    key = f"autoupdate.{pkg_name}"
    logger.info(f"set_autoupdate: {pkg_name} = {enable}")
    set_autoupdate_config(key, str(enable).lower())


def get_autoupdate(pkg_name):
    key = f"autoupdate.{pkg_name}"
    value = get_autoupdate_config(key)
    logger.info(f"get_autoupdate: {pkg_name} = {value}")
    return value == "true"


def recursive_chmod(path, perms):
    for dirpath, dirnames, filenames in os.walk(path):
        current_perms = os.stat(dirpath).st_mode
        os.chmod(dirpath, current_perms | perms)
        for filename in filenames:
            os.chmod(os.path.join(dirpath, filename), current_perms | perms)


def recursive_chown(path, uid, gid):
    for dirpath, dirnames, filenames in os.walk(path):
        os.chown(dirpath, uid, gid)
        for filename in filenames:
            os.chown(os.path.join(dirpath, filename), uid, gid)


def recursive_chown_conf():
    conf_dir = f"{USER_HOME}/.config/sk-chos-tool"
    os.makedirs(conf_dir, exist_ok=True)
    uid = pwd.getpwnam(USER).pw_uid
    gid = pwd.getpwnam(USER).pw_gid
    recursive_chown(conf_dir, uid, gid)


def support_umaf():
    return os.path.isfile("/usr/libexec/boot-umaf")


def boot_umaf():
    command = "sudo /usr/libexec/boot-umaf"
    return run_command(command, "启动UMAF")


def boot_bios():
    command = "sudo systemctl reboot --firmware-setup"
    return run_command(command, "启动BIOS")


def toggle_handheld_service(service_name, enable: bool):
    all_services = ["handycon.service", "inputplumber.service", f"hhd@{USER}.service"]
    for service in all_services:
        if enable:
            _mask = service != service_name
            _enable = service == service_name
        else:
            _mask = True
            _enable = False
        logger.info(f"service: {service}, mask: {_mask}, enable: {_enable}")
        toggle_service_mask(service, _mask)
        toggle_service(service, _enable)
        
        # # steam-powerbuttond 服务跟随 inputplumber.service 开启或关闭
        # if service == "inputplumber.service":
        #     toggle_service("steam-powerbuttond.service", _enable)

        # ROG Ally X RC72L 在启用 inputplumber.service 时需要开启 asus_ally_hid 模块.否则需要关闭
        if service == "inputplumber.service" and "ROG Ally X RC72L" in get_product_name():
            toggle_mod_enable(ASUS_ALLY_HID_MOD_NAME, _enable)

def toggle_mod_enable(mod_name, enable: bool):
    run_command("depmod -a")
    if enable:
        run_command(f"modprobe {mod_name}")
    else:
        run_command(f"modprobe -r {mod_name}")


def get_product_name():
    try:
        with open("/sys/class/dmi/id/product_name") as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""


def get_vendor_name():
    try:
        with open("/sys/class/dmi/id/sys_vendor") as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""


def set_frzr_config(section: str, key: str, value: str):
    """设置 /etc/frzr-sk.conf 配置文件，保持注释"""
    config_file = "/etc/frzr-sk.conf"
    try:
        # 用 configparser 读取，确保 section 和 key 存在
        config = configparser.ConfigParser()
        config.read(config_file)
        
        if not config.has_section(section):
            logger.error(f"Section {section} not found")
            return False
            
        if not config.has_option(section, key):
            logger.error(f"Key {key} not found in section {section}")
            return False
        
        # 验证通过后，用简单的文件操作更新
        with open(config_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        current_section = None
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            
            # 跟踪当前 section
            if line_stripped.startswith('[') and line_stripped.endswith(']'):
                current_section = line_stripped[1:-1]
                logger.debug(f"Found section: {current_section}")
                continue
            
            # 只在目标 section 中查找
            if current_section == section and '=' in line_stripped and not line_stripped.startswith('#'):
                # 分割 key 和 value
                parts = line_stripped.split('=', 1)
                if len(parts) == 2:
                    config_key = parts[0].strip()
                    logger.debug(f"Checking key: '{config_key}' against '{key}' in section '{current_section}'")
                    
                    if config_key == key:
                        indent = len(line) - len(line.lstrip())
                        lines[i] = " " * indent + f"{key} = {value}\n"
                        
                        with open(config_file, 'w', encoding='utf-8') as f:
                            f.writelines(lines)
                        logger.info(f"Updated frzr config: {section}.{key} = {value}")
                        return True
        
        logger.error(f"Config key {key} not found in section {section}")
        return False
            
    except Exception as e:
        logger.error(f"Error updating frzr config: {e}")
        return False


def load_frzr_metadata():
    """加载 frzr 元数据文件（只读）"""
    metadata_file = "/etc/frzr-sk.meta.json"
    try:
        if os.path.exists(metadata_file):
            with open(metadata_file, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Error loading frzr metadata: {e}")
    return {}

def get_frzr_config_structure():
    """读取 /etc/frzr-sk.conf 的完整结构，包括元数据"""
    config_file = "/etc/frzr-sk.conf"
    config_structure = {}
    
    try:
        if os.path.exists(config_file):
            # 1. 解析主配置文件
            config_structure = parse_config_file_with_comments(config_file)
            
            # 2. 加载元数据文件（只读）
            metadata = load_frzr_metadata()
            
            # 3. 合并元数据（优先级：元数据文件 > 注释 > 默认值）
            for section, section_config in config_structure.items():
                for key, config_value in section_config.items():
                    # 检查元数据文件
                    if section in metadata and key in metadata[section]:
                        meta = metadata[section][key]
                        if 'label' in meta:
                            config_value['label'] = meta['label']
                        if 'description' in meta:
                            config_value['description'] = meta['description']
                            
    except Exception as e:
        logger.error(f"Error reading frzr config structure: {e}")
    
    return config_structure

def parse_config_file_with_comments(config_file):
    """解析配置文件，包括注释中的元数据"""
    config_structure = {}
    
    with open(config_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    current_section = None
    current_key = None
    pending_metadata = {}
    
    for line in lines:
        line = line.strip()
        
        # 解析 section
        if line.startswith('[') and line.endswith(']'):
            current_section = line[1:-1]
            config_structure[current_section] = {}
            current_key = None
            pending_metadata = {}
            continue
        
        # 解析注释中的元数据
        if line.startswith('# @'):
            if current_section:
                parts = line[3:].split(':', 1)
                if len(parts) == 2:
                    meta_key = parts[0].strip()
                    meta_value = parts[1].strip()
                    
                    if meta_key == 'label':
                        pending_metadata['label'] = meta_value
                    elif meta_key == 'description':
                        pending_metadata['description'] = meta_value
            continue
        
        # 解析配置项
        if '=' in line and current_section:
            key, value = line.split('=', 1)
            key = key.strip()
            value = value.strip()
            current_key = key
            
            # 尝试转换为布尔值
            try:
                bool_value = value.lower() == "true"
                config_structure[current_section][key] = {
                    "value": bool_value,
                    "type": "boolean"
                }
            except:
                config_structure[current_section][key] = {
                    "value": value,
                    "type": "string"
                }
            
            # 关联待处理的元数据
            if pending_metadata:
                config_structure[current_section][key].update(pending_metadata)
                pending_metadata = {}
    
    return config_structure
