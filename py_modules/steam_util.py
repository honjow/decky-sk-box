import os
import subprocess
import urllib.parse
import re
import codecs
import decky
from config import logger
from utils import get_env


def urlencode(arg):
    return urllib.parse.quote(arg, safe="")


def decode_lsblk_escape(text: str) -> str:
    """Decode escape sequences from lsblk -r output
    
    lsblk -r escapes special characters (including spaces and non-ASCII chars) as \\xXX
    This function decodes them back to the original string.
    
    Args:
        text: String with escape sequences like \\xe6\\xb8\\xb8
        
    Returns:
        Decoded string with proper UTF-8 characters
    """
    try:
        # First decode the escape sequences as unicode_escape
        decoded = codecs.decode(text, 'unicode_escape')
        # The result is in latin-1, re-encode and decode as UTF-8
        return decoded.encode('latin-1').decode('utf-8')
    except (UnicodeDecodeError, UnicodeEncodeError) as e:
        logger.warning(f"Failed to decode escape sequences in '{text}': {e}")
        return text  # Return original if decoding fails


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


def get_steam_library_folders():
    """Get all Steam library folders from libraryfolders.vdf"""
    library_paths = []
    
    # Possible locations for libraryfolders.vdf
    possible_paths = [
        os.path.expanduser("~/.steam/steam/steamapps/libraryfolders.vdf"),
        os.path.expanduser("~/.local/share/Steam/steamapps/libraryfolders.vdf"),
        f"/home/{decky.DECKY_USER}/.steam/steam/steamapps/libraryfolders.vdf",
        f"/home/{decky.DECKY_USER}/.local/share/Steam/steamapps/libraryfolders.vdf",
    ]
    
    vdf_path = None
    for path in possible_paths:
        if os.path.exists(path):
            vdf_path = path
            break
    
    if not vdf_path:
        logger.warning("libraryfolders.vdf not found")
        return library_paths
    
    try:
        with open(vdf_path, "r", encoding="utf-8") as f:
            content = f.read()
            # Extract all "path" values from VDF file
            # Pattern matches: "path"		"/some/path"
            path_pattern = r'"path"\s+"([^"]+)"'
            matches = re.findall(path_pattern, content)
            library_paths = matches
            logger.info(f"Found Steam library folders: {library_paths}")
    except Exception as e:
        logger.error(f"Error reading libraryfolders.vdf: {e}")
    
    return library_paths


def is_library_folder_exists(folder_path: str):
    """Check if a folder path is already added as a Steam library"""
    library_folders = get_steam_library_folders()
    # Normalize paths for comparison
    normalized_target = os.path.normpath(folder_path)
    for lib_path in library_folders:
        if os.path.normpath(lib_path) == normalized_target:
            return True
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
                # Decode escaped characters in user-controlled fields
                mountpoint = decode_lsblk_escape(mountpoint)
                parttype_name = decode_lsblk_escape(parttype_name)
                logger.info(
                    f"get_mountpoint: {path}, {mountpoint}, {fstype}, {fssize}, {fsvail}, {parttype_name}"
                )
                if fstype == "ntfs" and parttype_name == "Windows recovery environment":
                    continue
                
                # Check if this mountpoint's SteamLibrary is already added
                libraryfolder = os.path.join(mountpoint, "SteamLibrary")
                is_added = is_library_folder_exists(libraryfolder)
                
                # dict
                mountpoint_list.append(
                    {
                        "path": path,
                        "mountpoint": mountpoint,
                        "fstype": fstype,
                        "fssize": fssize,
                        "fsvail": fsvail,
                        "is_added": is_added,
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
