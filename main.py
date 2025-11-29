import os


import decky
from py_enum import SleepMode
import update
import utils
import boot_to_win
import steam_util
import desktop
from settings import SettingsManager
from config import (
    logging,
    USER,
    CONFIG_KEY,
)
from gpu_manager import GpuManager


class Plugin:
    async def _main(self):
        self.settings = SettingsManager(
            name="config", settings_directory=decky.DECKY_PLUGIN_SETTINGS_DIR
        )
        # Initialize GPU manager
        self.gpu_manager = GpuManager(decky.DECKY_USER_HOME)
        logging.info("Plugin initialized with GPU manager")

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
        return f"{decky.DECKY_PLUGIN_VERSION}"

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
            logging.error("Error getting Auto Keep Boot enabled", exc_info=True)
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
            logging.error("Error getting Sleep Mode", exc_info=True)
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

    async def get_frzr_config_structure(self):
        """获取 frzr-sk.conf 配置结构"""
        try:
            return utils.get_frzr_config_structure()
        except Exception as e:
            logging.error(f"Error getting frzr config structure: {e}")
            return {}

    async def set_frzr_config(self, section: str, key: str, value: str):
        """设置 frzr-sk.conf 配置"""
        try:
            return utils.set_frzr_config(section, key, value)
        except Exception as e:
            logging.error(f"Error setting frzr config: {e}")
            return False

    async def get_frzr_metadata(self):
        """获取 frzr 元数据（只读）"""
        try:
            return utils.load_frzr_metadata()
        except Exception as e:
            logging.error(f"Error getting frzr metadata: {e}")
            return {}

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

    async def make_swapfile_with_size(self, size_gb: int):
        """Create swapfile with specified size"""
        logging.info(f"User requested swapfile creation with size: {size_gb}GB")
        try:
            success, msg = utils.make_swapfile_with_size(size_gb)
            if not success:
                logging.error(f"Swapfile creation failed: {msg}")
            return {'success': success, 'message': msg}
        except Exception as e:
            logging.error(f"Error creating swapfile: {e}", exc_info=True)
            return {'success': False, 'message': str(e)}

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
    
    # get_product_name
    async def get_product_name(self):
        try:
            return utils.get_product_name()
        except Exception as e:
            logging.error(f"Error getting product name: {e}")
            return ""
        
    # get_vendor_name
    async def get_vendor_name(self):
        try:
            return utils.get_vendor_name()
        except Exception as e:
            logging.error(f"Error getting vendor name: {e}")
            return ""
    
    # can_switch_desktop_session
    async def can_switch_desktop_session(self):
        try:
            return desktop.can_switch_desktop_session()
        except Exception as e:
            logging.error(f"Error checking desktop session switcher: {e}")
            return False

    # set_desktop_session
    async def set_desktop_session(self, session: str):
        try:
            return desktop.set_desktop_session(session)
        except Exception as e:
            logging.error(f"Error setting desktop session: {e}")
            return False

    # get_desktop_session
    async def get_desktop_session(self):
        try:
            return desktop.get_desktop_session()
        except Exception as e:
            logging.error(f"Error getting desktop session: {e}")
            return "xorg"

    # get_gpu_devices
    async def get_gpu_devices(self):
        try:
            logging.info("Getting GPU devices via GPU manager")
            return self.gpu_manager.get_gpu_devices()
        except Exception as e:
            logging.error(f"Error getting GPU devices: {e}", exc_info=True)
            return []

    # set_vulkan_adapter
    async def set_vulkan_adapter(self, device_id: str):
        try:
            logging.info(f"Setting Vulkan adapter via GPU manager: {device_id}")
            return self.gpu_manager.set_vulkan_adapter(device_id)
        except Exception as e:
            logging.error(f"Error setting Vulkan adapter: {e}", exc_info=True)
            return False

    # get_current_vulkan_adapter
    async def get_current_vulkan_adapter(self):
        try:
            logging.info("Getting current Vulkan adapter via GPU manager")
            return self.gpu_manager.get_current_vulkan_adapter()
        except Exception as e:
            logging.error(f"Error getting current Vulkan adapter: {e}", exc_info=True)
            return ""

    # get_hibernate_readiness
    async def get_hibernate_readiness(self):
        """Get hibernate readiness check result"""
        try:
            return utils.get_hibernate_readiness()
        except Exception as e:
            logging.error(f"Error checking hibernate readiness: {e}", exc_info=True)
            return {
                'can_hibernate': False,
                'reason': f'检查失败: {str(e)}',
                'checks': {},
                'info': {},
                'suggestions': []
            }

    # execute_hibernate
    async def execute_hibernate(self):
        """Execute system hibernation"""
        logging.info("User requested system hibernation")
        try:
            success, msg = utils.execute_hibernate()
            if not success:
                logging.error(f"Hibernate failed: {msg}")
            return {'success': success, 'message': msg}
        except Exception as e:
            logging.error(f"Error executing hibernate: {e}", exc_info=True)
            return {'success': False, 'message': str(e)}



    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky.logger.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky.migrate_logs(
            os.path.join(
                decky.DECKY_USER_HOME,
                ".config",
                "decky-template",
                "template.log",
            )
        )
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky.migrate_settings(
            os.path.join(decky.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky.DECKY_USER_HOME, ".config", "decky-template"),
        )
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky.migrate_runtime(
            os.path.join(decky.DECKY_HOME, "template"),
            os.path.join(
                decky.DECKY_USER_HOME, ".local", "share", "decky-template"
            ),
        )
