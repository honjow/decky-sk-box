import json
import os
import shutil
import ssl
import stat
import subprocess
import urllib.error
import urllib.request

import decky
from config import API_URL, logger
from utils import get_env, recursive_chmod

_REQUEST_TIMEOUT = 5  # seconds
# GitHub API rejects requests without a User-Agent (403 / non-JSON body).
_GITHUB_USER_AGENT = "honjow-decky-sk-box-plugin"


def _github_urlopen(url: str):
    gcontext = ssl.SSLContext()
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": _GITHUB_USER_AGENT,
            "Accept": "application/vnd.github+json",
        },
    )
    return urllib.request.urlopen(req, context=gcontext, timeout=_REQUEST_TIMEOUT)


def get_version() -> str:
    return f"{decky.DECKY_PLUGIN_VERSION}"


def get_latest_version():
    """
    Returns a dict for Decky JSON bridge:
    version: release tag without leading 'v', or empty string on failure
    error: short machine-readable code or None on success
    message: user-facing hint (Chinese) when error is set
    """
    try:
        response = _github_urlopen(API_URL)
        json_data = json.load(response)

        tag = json_data.get("tag_name", "")
        if tag.startswith("v"):
            tag = tag[1:]

        logger.info(f"latest version: {tag}")
        return {"version": tag, "error": None, "message": ""}
    except urllib.error.HTTPError as e:
        reason = (str(e.reason) if e.reason else str(e)).lower()
        body = ""
        try:
            body = e.read().decode("utf-8", errors="replace").lower()
        except Exception:
            pass
        if e.code == 403 and (
            "rate limit" in reason
            or "rate limit" in body
            or "api rate limit exceeded" in body
        ):
            msg = (
                "GitHub API 已达未认证请求上限（约 60 次/小时），请稍后再试。"
            )
            logger.error(f"get_latest_version: GitHub rate limit: {e}")
            return {"version": "", "error": "rate_limit", "message": msg}
        msg = f"无法获取版本信息（HTTP {e.code}）"
        if e.reason:
            msg += f"：{e.reason}"
        logger.error(f"get_latest_version HTTP error: {e}")
        return {"version": "", "error": f"http_{e.code}", "message": msg}
    except urllib.error.URLError as e:
        reason = getattr(e, "reason", e)
        msg = f"网络错误，请检查连接：{reason}"
        logger.error(f"get_latest_version URL error: {e}")
        return {"version": "", "error": "network", "message": msg}
    except json.JSONDecodeError as e:
        msg = "服务器返回数据无效，请稍后重试"
        logger.error(f"get_latest_version JSON error: {e}")
        return {"version": "", "error": "parse", "message": msg}
    except Exception as e:
        logger.error(f"get_latest_version failed: {e}")
        return {
            "version": "",
            "error": "unknown",
            "message": str(e) or "未知错误",
        }


def download_latest_build() -> str:
    response = _github_urlopen(API_URL)
    json_data = json.load(response)

    download_url = json_data.get("assets")[0].get("browser_download_url")
    logger.info(f"downloading from: {download_url}")

    if download_url.endswith(".zip"):
        file_path = f"/tmp/{decky.DECKY_PLUGIN_NAME}.zip"
    else:
        file_path = f"/tmp/{decky.DECKY_PLUGIN_NAME}.tar.gz"

    dl_req = urllib.request.Request(
        download_url,
        headers={"User-Agent": _GITHUB_USER_AGENT},
    )
    gcontext = ssl.SSLContext()
    with (
        urllib.request.urlopen(dl_req, context=gcontext, timeout=_REQUEST_TIMEOUT)
        as dl_response,
        open(file_path, "wb") as output_file,
    ):
        output_file.write(dl_response.read())

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
