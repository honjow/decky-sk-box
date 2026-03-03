import json
import os
import shutil
import ssl
import stat
import subprocess
import urllib.request

import decky
from config import API_URL, logger
from utils import get_env, recursive_chmod

_REQUEST_TIMEOUT = 5  # seconds


def get_version() -> str:
    return f"{decky.DECKY_PLUGIN_VERSION}"


def get_latest_version() -> str:
    gcontext = ssl.SSLContext()
    try:
        response = urllib.request.urlopen(API_URL, context=gcontext, timeout=_REQUEST_TIMEOUT)
        json_data = json.load(response)

        tag = json_data.get("tag_name", "")
        if tag.startswith("v"):
            tag = tag[1:]

        logger.info(f"latest version: {tag}")
        return tag
    except Exception as e:
        logger.error(f"get_latest_version failed: {e}")
        return ""


def download_latest_build() -> str:
    gcontext = ssl.SSLContext()

    response = urllib.request.urlopen(API_URL, context=gcontext, timeout=_REQUEST_TIMEOUT)
    json_data = json.load(response)

    download_url = json_data.get("assets")[0].get("browser_download_url")
    logger.info(f"downloading from: {download_url}")

    if download_url.endswith(".zip"):
        file_path = f"/tmp/{decky.DECKY_PLUGIN_NAME}.zip"
    else:
        file_path = f"/tmp/{decky.DECKY_PLUGIN_NAME}.tar.gz"

    with (
        urllib.request.urlopen(download_url, context=gcontext) as response,
        open(file_path, "wb") as output_file,
    ):
        output_file.write(response.read())

    return file_path


def update_latest():
    downloaded_filepath = download_latest_build()

    if not os.path.exists(downloaded_filepath):
        logger.error(f"downloaded file not found: {downloaded_filepath}")
        return None

    plugin_dir = decky.DECKY_PLUGIN_DIR

    try:
        logger.info(f"removing old plugin from {plugin_dir}")
        recursive_chmod(plugin_dir, stat.S_IWUSR)
        shutil.rmtree(plugin_dir)
    except Exception as e:
        logger.error(f"ota error during removal of old plugin: {e}")

    try:
        logger.info(f"extracting ota file to {plugin_dir}")
        shutil.unpack_archive(
            downloaded_filepath,
            f"{decky.DECKY_USER_HOME}/homebrew/plugins",
            format="gztar" if downloaded_filepath.endswith(".tar.gz") else "zip",
        )
        os.remove(downloaded_filepath)
    except Exception as e:
        logger.error(f"error during ota file extraction: {e}")

    logger.info("restarting plugin_loader")
    cmd = "pkill -HUP PluginLoader"
    result = subprocess.run(
        cmd,
        shell=True,
        check=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=get_env(),
    )
    logger.info(result.stdout)
    return result
