import logging

import decky_plugin

SK_TOOL_PATH = "/usr/share/sk-chos-tool"
SK_TOOL_SCRIPTS_PATH = f"{SK_TOOL_PATH}/scripts"

try:
    LOG_LOCATION = f"/tmp/SK-Box.log"
    logging.basicConfig(
        level=logging.INFO,
        filename=LOG_LOCATION,
        format="[%(asctime)s | %(filename)s:%(lineno)s:%(funcName)s] %(levelname)s: %(message)s",
        filemode="w",
        force=True,
    )
except Exception as e:
    logging.error(f"exception|{e}")


try:
    PRODUCT_NAME = open("/sys/devices/virtual/dmi/id/product_name", "r").read().strip()
    logging.info(f"PRODUCT_NAME: {PRODUCT_NAME}")
except Exception as e:
    logging.error(f"exception|{e}")
    PRODUCT_NAME = "UNKNOWN"

USER = decky_plugin.DECKY_USER
USER_HOME = decky_plugin.DECKY_USER_HOME

CONFIG_KEY = "sk-box"

HIBERNATE_DELAY_FILE = "/etc/systemd/sleep.conf.d/99-hibernate_delay.conf"