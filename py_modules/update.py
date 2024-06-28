import json
import os
import shutil
import ssl
import stat
import subprocess

import urllib.request

from config import logging
import decky
from utils import recursive_chmod

api_url = "http://api.github.com/repos/honjow/decky-sk-box/releases/latest"


def update_latest():
    downloaded_filepath = download_latest_build()

    if os.path.exists(downloaded_filepath):
        plugin_dir = f"{decky.DECKY_USER_HOME}/homebrew/plugins/decky-sk-box"

        try:
            logging.info(f"removing old plugin from {plugin_dir}")
            # add write perms to directory
            recursive_chmod(plugin_dir, stat.S_IWUSR)

            # remove old plugin
            shutil.rmtree(plugin_dir)
        except Exception as e:
            logging.error(f"ota error during removal of old plugin: {e}")

        try:
            logging.info(f"extracting ota file to {plugin_dir}")
            # extract files to decky plugins dir
            shutil.unpack_archive(
                downloaded_filepath,
                f"{decky.DECKY_USER_HOME}/homebrew/plugins",
                format="gztar",
            )

            # cleanup downloaded files
            os.remove(downloaded_filepath)
        except Exception as e:
            decky.logger.error(f"error during ota file extraction {e}")

        logging.info("restarting plugin_loader.service")
        cmd = "systemctl restart plugin_loader.service"
        result = subprocess.run(
            cmd,
            shell=True,
            check=True,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        logging.info(result.stdout)
        return result


def download_latest_build():
    gcontext = ssl.SSLContext()

    response = urllib.request.urlopen(api_url, context=gcontext)
    json_data = json.load(response)

    download_url = json_data.get("assets")[0].get("browser_download_url")

    logging.info(download_url)

    file_path = f"/tmp/decky-sk-box.tag.gz"

    with urllib.request.urlopen(download_url, context=gcontext) as response, open(
        file_path, "wb"
    ) as output_file:
        output_file.write(response.read())
        output_file.close()

    return file_path


def get_latest_version():
    gcontext = ssl.SSLContext()

    response = urllib.request.urlopen(api_url, context=gcontext)
    json_data = json.load(response)

    tag = json_data.get("tag_name")
    # if tag is a v* tag, remove the v
    if tag.startswith("v"):
        tag = tag[1:]
    return tag
