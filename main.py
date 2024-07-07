import os


import decky_plugin
from py_enum import SleepMode
import update
import utils
import boot_to_win
import steam_util
from settings import SettingsManager
from config import (
    logging,
    USER,
    CONFIG_KEY,
)


class Plugin:
    async def _main(self):
        self.settings = SettingsManager(
            name="config", settings_directory=decky_plugin.DECKY_PLUGIN_SETTINGS_DIR
        )

    async def get_settings(self):
        return self.settings.getSetting(CONFIG_KEY)

    async def set_settings(self, settings):
        self.settings.setSetting(CONFIG_KEY, settings)
        logging.log(f"save Settings: {settings}")
        return True

    async def update_latest(self):
        logging.info("Updating latest")
        return update.update_latest()

    async def get_version(self):
        return f"{decky_plugin.DECKY_PLUGIN_VERSION}"

    async def get_latest_version(self):
        try:
            return update.get_latest_version()
        except Exception as e:
            logging.error(f"Error getting latest version: {e}")
            return ""

    async def get_usb_wakeup_enabled(self):
        return utils.chk_usb_wakeup()

    async def set_usb_wakeup(self, enabled: bool):
        return utils.set_usb_wakeup(enabled)

    async def get_handycon_enabled(self):
        return utils.service_is_enabled("handycon.service")

    async def set_handycon_enabled(self, enabled: bool):
        try:
            utils.toggle_handheld_service("handycon.service", enabled)
            return True
        except Exception as e:
            logging.error(f"Error setting HandyCon enabled: {e}")
            return False

    # get_inputplumber_enabled
    async def get_inputplumber_enabled(self):
        return utils.service_is_enabled("inputplumber.service")

    # set_inputplumber_enabled
    async def set_inputplumber_enabled(self, enabled: bool):
        try:
            utils.toggle_handheld_service("inputplumber.service", enabled)
            return True
        except Exception as e:
            logging.error(f"Error setting Input Plumber enabled: {e}")
            return False

    async def get_hhd_enabled(self):
        return utils.service_is_enabled(f"hhd@{USER}.service")

    async def set_hhd_enabled(self, enabled: bool):
        try:
            utils.toggle_handheld_service(f"hhd@{USER}.service", enabled)
            return True
        except Exception as e:
            logging.error(f"Error setting HHD enabled: {e}", exc_info=True)
            return False

    async def hhd_installed(self):
        return os.path.exists("/usr/bin/hhd")

    async def handycon_installed(self):
        return os.path.exists("/usr/bin/handycon")

    async def inputplumber_installed(self):
        return os.path.exists("/usr/bin/inputplumber")

    async def get_auto_keep_boot_enabled(self):
        try:
            return utils.service_is_enabled("sk-setup-next-boot.service")
        except Exception:
            logging.error(f"Error getting Auto Keep Boot enabled", exc_info=True)
            return False

    async def set_auto_keep_boot_enabled(self, enabled: bool):
        logging.info(f"Setting Auto Keep Boot enabled: {enabled}")
        try:
            utils.toggle_service("sk-setup-next-boot.service", enabled)
            return True
        except Exception as e:
            logging.error(f"Error setting Auto Keep Boot enabled: {e}")
            return False

    async def get_hibernate_enabled(self):
        return utils.chk_hibernate()

    async def set_hibernate_enabled(self, enabled: bool):
        try:
            utils.set_hibernate(enabled)
            return True
        except Exception as e:
            logging.error(f"Error setting Hibernate enabled: {e}")
            return False

    async def get_sleep_mode(self) -> str:
        try:
            result = utils.get_sleep_mode()
            logging.info(f"获取休眠类型: {result}")
            return result.value
        except Exception:
            logging.error(f"Error getting Sleep Mode", exc_info=True)
            return SleepMode.SUSPEND.value

    async def set_sleep_mode(self, sleep_mode: str):
        logging.info(f"Setting Sleep Mode: {sleep_mode}")
        try:
            mode: SleepMode = SleepMode(sleep_mode)
            utils.set_sleep_mode(mode)
            return True
        except Exception as e:
            logging.error(f"Error setting Sleep Mode: {e}")
            return False

    async def firmware_override_enabled(self):
        return utils.chk_firmware_override()

    async def set_firmware_override(self, enabled: bool):
        try:
            utils.set_firmware_override(enabled)
            return True
        except Exception as e:
            logging.error(f"Error setting Firmware Override enabled: {e}")
            return False

    async def get_enable_auto_update(self):
        return utils.service_is_enabled("sk-chos-tool-autoupdate.timer")

    async def set_enable_auto_update(self, enabled: bool):
        logging.info(f"Setting Auto Update enabled: {enabled}")
        try:
            utils.toggle_service("sk-chos-tool-autoupdate.timer", enabled)
            return True
        except Exception as e:
            logging.error(f"Error setting Auto Update enabled: {e}")
            return False

    async def get_skt_update_enabled(self):
        skt_key = "sk_chos_tool"
        return utils.get_autoupdate(skt_key)

    async def set_skt_update_enabled(self, enabled: bool):
        skt_key = "sk_chos_tool"
        try:
            utils.set_autoupdate(skt_key, enabled)
            return True
        except Exception as e:
            logging.error(f"Error setting SKT Update enabled: {e}")
            return False

    async def get_handy_update_enabled(self):
        handy_key = "handygccs"
        return utils.get_autoupdate(handy_key)

    async def set_handy_update_enabled(self, enabled: bool):
        handy_key = "handygccs"
        try:
            utils.set_autoupdate(handy_key, enabled)
            return True
        except Exception as e:
            logging.error(f"Error setting Handy Update enabled: {e}")
            return False

    async def get_hhd_update_enabled(self):
        hhd_key = "hhd"
        return utils.get_autoupdate(hhd_key)

    async def set_hhd_update_enabled(self, enabled: bool):
        hhd_key = "hhd"
        try:
            utils.set_autoupdate(hhd_key, enabled)
            return True
        except Exception as e:
            logging.error(f"Error setting HHD Update enabled: {e}")
            return False

    async def boot_repair(self):
        try:
            utils.boot_repair()
            return True
        except Exception as e:
            logging.error(f"Error repairing boot: {e}")
            return False

    async def re_first_run(self):
        try:
            code, msg = utils.re_first_run()
            if code != 0:
                logging.error(f"Error resetting first run: {msg}")
                return False
            return True
        except Exception as e:
            logging.error(f"Error resetting first run: {e}")
            return False

    async def etc_repair(self):
        try:
            utils.etc_repair()
            return True
        except Exception as e:
            logging.error(f"Error repairing etc: {e}")
            return False

    async def etc_repair_full(self):
        try:
            utils.etc_repair_full()
            return True
        except Exception as e:
            logging.error(f"Error repairing etc: {e}")
            return False

    async def make_swapfile(self):
        logging.info("Making swapfile")
        try:
            utils.make_swapfile()
            return True
        except Exception as e:
            logging.error(f"Error making swapfile: {e}")
            return False

    async def reset_gnome(self):
        logging.info("Resetting gnome")
        try:
            utils.reset_gnome()
            return True
        except Exception as e:
            logging.error(f"Error resetting gnome: {e}")
            return False

    async def get_package_version(self, package_name):
        try:
            return utils.get_package_version(package_name)
        except Exception as e:
            logging.error(f"Error getting package version: {e}")
            return ""

    async def get_win_boot(self):
        try:
            return boot_to_win.get_win_boot()
        except Exception as e:
            logging.error(f"Error getting windows boot: {e}")
            return ""

    async def boot_to_win(self):
        try:
            return boot_to_win.boot_to_win()
        except Exception as e:
            logging.error(f"Error booting to windows: {e}")
            return False

    async def get_mountpoint(self):
        try:
            return steam_util.get_mountpoint()
        except Exception as e:
            logging.error(f"Error getting mountpoint: {e}")
            import traceback

            logging.error(traceback.format_exc())
            return ""

    async def add_library_folder(self, mountpoint: str):
        logging.info(f"Adding library folder: {mountpoint}")
        try:
            return steam_util.add_library_folder(mountpoint)
        except Exception as e:
            logging.error(f"Error adding library folder: {e}")
            # 堆栈跟踪
            import traceback

            logging.error(traceback.format_exc())
            return False

    async def set_hibernate_delay(self, delay: str):
        logging.info(f"Setting Hibernate delay: {delay}")
        try:
            utils.set_hibernate_delay(delay)
            return True
        except Exception as e:
            logging.error(f"Error setting Hibernate delay: {e}")
            return False

    async def get_hibernate_delay(self) -> str:
        try:
            result = utils.get_hibernate_delay()
            logging.info(f"获取休眠延迟: {result}")
            return result
        except Exception as e:
            logging.error(f"Error getting Hibernate delay: {e}")
            return ""

    async def support_umaf(self):
        try:
            return utils.support_umaf()
        except Exception as e:
            logging.error(f"Error getting umaf support: {e}")
            return False

    async def boot_umaf(self):
        try:
            return utils.boot_umaf()
        except Exception as e:
            logging.error(f"Error booting umaf: {e}")
            return False

    async def boot_bios(self):
        try:
            return utils.boot_bios()
        except Exception as e:
            logging.error(f"Error booting bios: {e}")
            return False

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky_plugin.migrate_logs(
            os.path.join(
                decky_plugin.DECKY_USER_HOME,
                ".config",
                "decky-template",
                "template.log",
            )
        )
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"),
        )
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "template"),
            os.path.join(
                decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"
            ),
        )
