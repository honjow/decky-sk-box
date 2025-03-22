import os
from config import logger


def can_switch_desktop_session():
    check_file_path = "/usr/bin/plasma-session-oneshot"
    if os.path.exists(check_file_path):
        return True
    return False

def get_desktop_session():
    config_file_path = "/etc/default/sk-chos-desktop-session"
    try:
        with open(config_file_path, "r") as f:
            for line in f:
                if line.startswith("SK_CHOS_SESSION="):
                    logger.debug(f"Found SK_CHOS_SESSION: {line}")
                    session = line.split("=")[1].strip().strip('"')
                    logger.debug(f"Parsed session: {session}")
                    return session
    except Exception as e:
        logger.error(f"Error getting desktop session: {e}")
    return "xorg"


def set_desktop_session(session: str):
    # default SK_CHOS_SESSION="xorg"
    config_file_path = "/etc/default/sk-chos-desktop-session"
    try:
        # 检查文件是否存在
        file_exists = os.path.exists(config_file_path)

        # 构造新内容
        new_content = ""

        if file_exists:
            # 读取现有文件内容
            try:
                with open(config_file_path, "r") as f:
                    lines = f.readlines()

                # 查找并更新 SK_CHOS_SESSION 行
                session_line_found = False
                for i, line in enumerate(lines):
                    if line.startswith("SK_CHOS_SESSION="):
                        lines[i] = f'SK_CHOS_SESSION="{session}"\n'
                        session_line_found = True
                        break

                # 如果没有找到相关行，添加一行
                if not session_line_found:
                    lines.append(f'SK_CHOS_SESSION="{session}"\n')

                new_content = "".join(lines)
            except PermissionError:
                # 如果没有读取权限，使用默认内容
                new_content = f'SK_CHOS_SESSION="{session}"\n'
        else:
            # 如果文件不存在，创建它
            new_content = f'SK_CHOS_SESSION="{session}"\n'

        # 写入文件
        try:
            with open(config_file_path, "w") as f:
                f.write(new_content)
            return True
        except PermissionError:
            # 如果没有写入权限，提示错误
            logger.error(
                f"Permission denied: Cannot write to {config_file_path}", exc_info=True
            )
            return False

    except Exception as e:
        logger.error(f"Error setting desktop session: {e}", exc_info=True)
        return False
