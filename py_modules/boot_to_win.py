import os
import subprocess

from config import logging


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
        )
        logging.info(
            f"get windows boot number success, command: [{command}], stdout: {result.stdout}"
        )
        if not result.stdout:
            return ""
        stdout = result.stdout.strip()
        if stdout.startswith("Boot"):
            stdout = stdout[4:]
        if stdout.endswith("*"):
            stdout = stdout[:-1]

        logging.info(f"windows boot number: {stdout}")
        return stdout
    except subprocess.CalledProcessError as e:
        logging.error(
            f"Error: {e}, command: {command}, stdout: {e.stdout}, stderr: {e.stderr}"
        )
    return ""


def boot_to_win():
    win_boot_num = get_win_boot()
    if win_boot_num:
        command = f"sudo efibootmgr -n {win_boot_num}"
        try:
            result = subprocess.run(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                check=True,
            )
            logging.info(
                f"set next boot to windows success, command: {command}, stdout: {result.stdout}"
            )
            subprocess.run(
                "sudo reboot",
                shell=True,
                text=True,
                check=True,
                capture_output=True,
            )
        except subprocess.CalledProcessError as e:
            logging.error(
                f"Error: {e}, command: {command}, stdout: {e.stdout}, stderr: {e.stderr}"
            )
    else:
        logging.error("No windows boot entry found")
        return False
    return True
