import logging
import os

import decky
from logging_handler import SystemdHandler

SK_TOOL_PATH = "/usr/share/sk-chos-tool"
SK_TOOL_SCRIPTS_PATH = f"{SK_TOOL_PATH}/scripts"

LOG_LOCATION = "/tmp/SK-Box.log"
LOG_LEVEL = logging.DEBUG


def setup_logger():
    # 定义日志格式
    file_format = "[%(asctime)s | %(filename)s:%(lineno)s:%(funcName)s] %(levelname)s: %(message)s"
    systemd_format = "[%(filename)s:%(lineno)s:%(funcName)s] %(levelname)s: %(message)s"

    # 创建并配置 handlers
    systemd_handler = SystemdHandler()
    systemd_handler.setFormatter(logging.Formatter(systemd_format))

    file_handler = logging.FileHandler(filename=LOG_LOCATION, mode="w")
    file_handler.setFormatter(logging.Formatter(file_format))

    # 获取 logger
    try:
        logger = decky.logger
    except Exception:
        logger = logging.getLogger(__name__)

    logger.setLevel(LOG_LEVEL)
    logger.addHandler(systemd_handler)
    logger.addHandler(file_handler)

    return logger


# 初始化 logger
logger = setup_logger()


try:
    PRODUCT_NAME = open("/sys/devices/virtual/dmi/id/product_name", "r").read().strip()
    logger.info(f"PRODUCT_NAME: {PRODUCT_NAME}")
except Exception as e:
    logger.error(f"exception|{e}")
    PRODUCT_NAME = "UNKNOWN"

USER = decky.DECKY_USER
USER_HOME = decky.DECKY_USER_HOME

ASUS_ALLY_HID_MOD_NAME = "asus_ally_hid"

CONFIG_KEY = "sk-box"

HIBERNATE_DELAY_FILE = "/etc/systemd/sleep.conf.d/99-hibernate_delay.conf"

# Orientation override config
ORIENTATION_ENV_DIR = os.path.join(USER_HOME, ".config", "environment.d")
ORIENTATION_CONFIG_FILE = os.path.join(ORIENTATION_ENV_DIR, "zzz-decky-skbox.conf")
