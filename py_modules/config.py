import logging


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