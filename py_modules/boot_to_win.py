import subprocess

from config import logger
from utils import get_env, run_command


# 存在 win 启动项
def get_win_boot():
    command = 'efibootmgr | grep -i "Windows Boot Manager" | grep -i "bootmgfw.efi" | awk \'{print $1}\' | head -n 1'
    try:
        result = subprocess.run(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True,
            env=get_env(),
        )
        logger.info(
            f"get windows boot number success, command: [{command}], stdout: {result.stdout}"
        )
        if not result.stdout:
            return ""
        stdout = result.stdout.strip()
        if stdout.startswith("Boot"):
            stdout = stdout[4:]
        if stdout.endswith("*"):
            stdout = stdout[:-1]

        logger.info(f"windows boot number: {stdout}")
        return stdout
    except subprocess.CalledProcessError as e:
        logger.error(
            f"Error: {e}, command: {command}, stdout: {e.stdout}, stderr: {e.stderr}"
        )
    return ""


def boot_to_win():
    win_boot_num = get_win_boot()
    if win_boot_num:
        run_command(f"sudo efibootmgr -n {win_boot_num}")
        run_command("sudo reboot")
    else:
        logger.error("No windows boot entry found")
        return False
    return True
