import os
import subprocess
import urllib.parse

from config import logger
from utils import get_env


def urlencode(arg):
    return urllib.parse.quote(arg, safe="")


def send_to_steamcmd(steam_command: str, arg: str):
    # user_home = decky.DECKY_USER_HOME
    try:

        encoded = urlencode(arg)
        steam_running = (
            subprocess.run(
                ["pgrep", "-x", "steam"],
                stdout=subprocess.DEVNULL,
                env=get_env(),
            ).returncode
            == 0
        )
        if steam_running:
            shell_command = f"systemd-run -M 1000@ --user --collect --wait sh -c './.steam/root/ubuntu12_32/steam steam://{steam_command}/{encoded}'"
            subprocess.run(
                shell_command,
                check=True,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=True,
                executable="/bin/bash",
                env=get_env(),
            )
            logger.info(
                f"Sent URL to steam: steam://{steam_command}/{encoded} (arg: {arg})"
            )
        else:
            logger.error("Steam is not running")
            return False
        return True
    except subprocess.CalledProcessError as e:
        logger.error(
            f"Error sending to steamcmd: {e}, stdout: {e.stdout}, stderr: {e.stderr}, cmd: {e.cmd}"
        )
        return False
    except Exception as e:
        logger.error(f"> Error sending to steamcmd: {e}")
        import traceback

        logger.error(traceback.format_exc())
        return False


def get_mountpoint():
    mountpoint_list = []
    command = """
# 使用 lsblk 获取信息，排除指定条件的行，并输出结果
lsblk -rno PATH,MOUNTPOINT,FSTYPE,FSSIZE,FSAVAIL,PARTTYPENAME | while read -r path mountpoint fstype fssize fsvail parttype_name; do
    # 检查是否有足够的字段
    if [ -n "$path" ] && [ -n "$mountpoint" ] && [ -n "$fstype" ] && [ -n "$fssize" ]; then
        # 检查挂载点路径是否不以 /frzr_root 开头
        if [[ "$mountpoint" != "/frzr_root"* ]]; then
            # 检查 fstype 是否为指定的几种之一
            case "$fstype" in
                ntfs|ext4|btrfs|exfat)
                    echo "$path $mountpoint $fstype $fssize $fsvail $parttype_name"
                    ;;
            esac
        fi
    fi
done
"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            executable="/bin/bash",
            env=get_env(),
        )

        stdout = result.stdout.strip()
        logger.info(f"get_mountpoint: {stdout}")
        # split to [path mountpoint fstype fssize]
        lines = stdout.split("\n")
        for line in lines:
            path, mountpoint, fstype, fssize, fsvail, parttype_name = line.split(" ")
            if path and mountpoint and fstype and fssize and fsvail and parttype_name:
                parttype_name = bytes(parttype_name, "utf-8").decode("unicode_escape")
                logger.info(
                    f"get_mountpoint: {path}, {mountpoint}, {fstype}, {fssize}, {fsvail}, {parttype_name}"
                )
                if fstype == "ntfs" and parttype_name == "Windows recovery environment":
                    continue
                # dict
                mountpoint_list.append(
                    {
                        "path": path,
                        "mountpoint": mountpoint,
                        "fstype": fstype,
                        "fssize": fssize,
                        "fsvail": fsvail,
                    }
                )
        logger.info(f"get_mountpoint: {mountpoint_list}")
        return mountpoint_list
    except subprocess.CalledProcessError as e:
        logger.error(f"Error getting mountpoint: {e}, {e.stderr}")
        return []


def add_library_folder(mountpoint: str):
    libraryfolder = os.path.join(mountpoint, "SteamLibrary")
    mkdirsWithUidGid(libraryfolder, 1000, 1000)
    logger.info(f"Adding library folder: {libraryfolder}")
    return send_to_steamcmd("addlibraryfolder", libraryfolder)


def mkdirsWithUidGid(path: str, uid: int, gid: int):
    try:
        if os.path.exists(path):
            os.chown(path, uid, gid)
            return True
        else:
            os.makedirs(path, exist_ok=True)
            os.chown(path, uid, gid)
            return True
    except Exception as e:
        logger.error(f"Error creating folder: {path}, {e}")
        return False
