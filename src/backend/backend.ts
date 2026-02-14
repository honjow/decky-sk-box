import { call } from "@decky/api";
import {
  FrzrConfigStructure,
  FrzrMetadata,
  GpuDevice,
  SessionMode,
  SettingsData,
  SleepMode,
} from ".";

export interface MotionPoint {
  path: string;
  mountpoint: string;
  fstype: string;
  fssize: string;
  fsvail: string;
  is_added: boolean;
}

export interface HibernateInfo {
  mem_total_gb: number;
  swap_total_gb: number;
  swap_devices: Array<{
    device: string;
    type: string;
    size_kb: number;
    used_kb: number;
    is_zram: boolean;
  }>;
  resume_device: string | null;
  resume_offset: string | null;
}

export interface HibernateReadiness {
  can_hibernate: boolean;
  reason: string;
  checks: {
    swap_size_ok: boolean;
    resume_configured: boolean;
    swap_active: boolean;
  };
  info: HibernateInfo;
  suggestions: string[];
}

export interface HibernateResult {
  success: boolean;
  message: string;
}

export class Backend {
  public static async init() {}

  public static async updateLatest() {
    return call("update_latest");
  }

  public static async getVersion(): Promise<string> {
    return (await call("get_version")) as string;
  }

  public static async getLatestVersion(): Promise<string> {
    return (await call("get_latest_version")) as string;
  }

  // get_usb_wakeup_enabled
  public static async getUsbWakeupEnabled(): Promise<boolean> {
    try {
      return (await call("get_usb_wakeup_enabled")) as boolean;
    } catch (e) {
      console.error(`getUsbWakeupEnabled error: ${e}`);
      return false;
    }
  }

  // set_usb_wakeup
  public static async setUsbWakeup(value: boolean) {
    return await call("set_usb_wakeup", value);
  }

  // get_handycon_enabled
  public static async getHandyConEnabled(): Promise<boolean> {
    try {
      return (await call("get_handycon_enabled")) as boolean;
    } catch (e) {
      console.error(`getHandyConEnabled error: ${e}`);
      return false;
    }
  }

  // set_handycon_enabled
  public static async setHandyConEnabled(value: boolean) {
    return await call("set_handycon_enabled", value);
  }

  // get_inputplumber_enabled
  public static async getInputPlumberEnabled(): Promise<boolean> {
    try {
      return (await call("get_inputplumber_enabled")) as boolean;
    } catch (e) {
      console.error(`getInputPlumberEnabled error: ${e}`);
      return false;
    }
  }

  // set_inputplumber_enabled
  public static async setInputPlumberEnabled(value: boolean) {
    return await call("set_inputplumber_enabled", value);
  }

  // get_hhd_enabled
  public static async getHHDEnabled(): Promise<boolean> {
    try {
      return (await call("get_hhd_enabled")) as boolean;
    } catch (e) {
      console.error(`getHHDEnabled error: ${e}`);
      return false;
    }
  }

  // set_hhd_enabled
  public static async setHHDEnabled(value: boolean) {
    return await call("set_hhd_enabled", value);
  }

  // get_auto_keep_boot_enabled
  public static async getAutoKeepBootEnabled(): Promise<boolean> {
    try {
      return (await call("get_auto_keep_boot_enabled")) as boolean;
    } catch (e) {
      console.error(`getAutoKeepBootEnabled error: ${e}`);
      return false;
    }
  }

  // set_auto_keep_boot_enabled
  public static async setAutoKeepBootEnabled(value: boolean) {
    return await call("set_auto_keep_boot_enabled", value);
  }

  // get_hibernate_enabled
  public static async getHibernateEnabled(): Promise<boolean> {
    try {
      return (await call("get_hibernate_enabled")) as boolean;
    } catch (e) {
      console.error(`getHibernateEnabled error: ${e}`);
      return false;
    }
  }

  // set_hibernate_enabled
  public static async setHibernateEnabled(value: boolean) {
    return await call("set_hibernate_enabled", value);
  }

  // firmware_override_enabled
  public static async getFirmwareOverrideEnabled(): Promise<boolean> {
    try {
      return (await call("firmware_override_enabled")) as boolean;
    } catch (e) {
      console.error(`getFirmwareOverrideEnabled error: ${e}`);
      return false;
    }
  }

  // set_firmware_override
  public static async setFirmwareOverride(value: boolean) {
    return await call("set_firmware_override", value);
  }

  // get_enable_auto_update
  public static async getEnableAutoUpdate(): Promise<boolean> {
    try {
      return (await call("get_enable_auto_update")) as boolean;
    } catch (e) {
      console.error(`getEnableAutoUpdate error: ${e}`);
      return false;
    }
  }

  // set_enable_auto_update
  public static async setEnableAutoUpdate(value: boolean) {
    return await call("set_enable_auto_update", value);
  }

  // get_skt_update_enabled
  public static async getSktUpdateEnabled(): Promise<boolean> {
    return ((await call("get_skt_update_enabled")) as boolean) || false;
  }

  // set_skt_update_enabled
  public static async setSktUpdateEnabled(value: boolean) {
    return await call("set_skt_update_enabled", value);
  }

  // get_handy_update_enabled
  public static async getHandyUpdateEnabled(): Promise<boolean> {
    return ((await call("get_handy_update_enabled")) as boolean) || false;
  }

  // set_handy_update_enabled
  public static async setHandyUpdateEnabled(value: boolean) {
    return await call("set_handy_update_enabled", value);
  }

  // get_hhd_update_enabled
  public static async getHHDUpdateEnabled(): Promise<boolean> {
    return ((await call("get_hhd_update_enabled")) as boolean) || false;
  }

  // set_hhd_update_enabled
  public static async setHhdUpdateEnabled(value: boolean) {
    return await call("set_hhd_update_enabled", value);
  }

  // get_frzr_config_structure
  public static async getFrzrConfigStructure(): Promise<FrzrConfigStructure> {
    try {
      return (await call("get_frzr_config_structure")) as FrzrConfigStructure;
    } catch (e) {
      console.error(`getFrzrConfigStructure error: ${e}`);
      return {};
    }
  }

  // set_frzr_config
  public static async setFrzrConfig(
    section: string,
    key: string,
    value: string
  ): Promise<boolean> {
    try {
      return (await call("set_frzr_config", section, key, value)) as boolean;
    } catch (e) {
      console.error(`setFrzrConfig error: ${e}`);
      return false;
    }
  }

  // get_frzr_metadata
  public static async getFrzrMetadata(): Promise<FrzrMetadata> {
    try {
      return (await call("get_frzr_metadata")) as FrzrMetadata;
    } catch (e) {
      console.error(`getFrzrMetadata error: ${e}`);
      return {};
    }
  }

  // boot_repair
  public static async bootRepair() {
    return await call("boot_repair");
  }

  // re_first_run
  public static async reFirstRun() {
    return await call("re_first_run");
  }

  // etc_repair
  public static async etcRepair() {
    return await call("etc_repair");
  }

  // etc_repair_full
  public static async etcRepairFull() {
    return await call("etc_repair_full");
  }

  // make_swapfile
  public static async makeSwapfile() {
    return await call("make_swapfile");
  }

  // reset_dconf
  public static async resetDconf() {
    return await call("reset_dconf");
  }

  // has_gnome_shell
  public static async hasGnomeShell(): Promise<boolean> {
    try {
      return (await call("has_gnome_shell")) as boolean;
    } catch (e) {
      console.error(`hasGnomeShell error: ${e}`);
      return false;
    }
  }

  // get_gnome_extensions_enabled
  public static async getGnomeExtensionsEnabled(): Promise<boolean> {
    try {
      return (await call("get_gnome_extensions_enabled")) as boolean;
    } catch (e) {
      console.error(`getGnomeExtensionsEnabled error: ${e}`);
      return true;
    }
  }

  // set_gnome_extensions_enabled
  public static async setGnomeExtensionsEnabled(value: boolean): Promise<boolean> {
    try {
      return (await call("set_gnome_extensions_enabled", value)) as boolean;
    } catch (e) {
      console.error(`setGnomeExtensionsEnabled error: ${e}`);
      return false;
    }
  }

  // get_settings
  public static async getSettings(): Promise<SettingsData> {
    const res = (await call("get_settings")) as any;
    if (!res) {
      return new SettingsData();
    }
    return res as SettingsData;
  }

  // set_settings
  public static async setSettings(settings: SettingsData) {
    return await call("set_settings", settings);
  }

  // get_package_version
  public static async getPackageVersion(packageName: string): Promise<string> {
    return (await call("get_package_version", packageName)) as string;
  }

  // get_win_boot
  public static async getWinBootEntry(): Promise<string> {
    return (await call("get_win_boot")) as string;
  }

  // boot_to_win
  public static async bootToWindows() {
    return await call("boot_to_win");
  }

  // get_mountpoint
  public static async getMountpoint(): Promise<MotionPoint[]> {
    const result = (await call("get_mountpoint")) as any;
    if (!result) {
      return [];
    }
    const data = result;

    return (data as []).map((item: any) => {
      return {
        path: item["path"],
        mountpoint: item["mountpoint"],
        fstype: item["fstype"],
        fssize: item["fssize"],
        fsvail: item["fsvail"],
        is_added: item["is_added"] || false,
      } as MotionPoint;
    });
  }

  // add_library_folder
  public static async addLibraryFolder(mountpoint: string): Promise<boolean> {
    const result = (await call("add_library_folder", mountpoint)) as any;
    if (!result) {
      return false;
    }
    return result as boolean;
  }

  // hhd_installed
  public static async hhdInstalled(): Promise<boolean> {
    return (await call("hhd_installed")) as boolean;
  }

  // handycon_installed
  public static async handyconInstalled(): Promise<boolean> {
    return (await call("handycon_installed")) as boolean;
  }

  // inputplumber_installed
  public static async inputplumberInstalled(): Promise<boolean> {
    return (await call("inputplumber_installed")) as boolean;
  }

  // get_sleep_mode
  public static async getSleepMode(): Promise<SleepMode> {
    return ((await call("get_sleep_mode")) as SleepMode) || SleepMode.SUSPEND;
  }

  // set_sleep_mode
  public static async setSleepMode(type: SleepMode) {
    return await call("set_sleep_mode", type);
  }

  // set_hibernate_delay
  public static async setHibernateDelay(delay: string) {
    return await call("set_hibernate_delay", delay);
  }

  // get_hibernate_delay
  public static async getHibernateDelay(): Promise<string> {
    return ((await call("get_hibernate_delay")) as string) || "";
  }

  // support_umaf
  public static async supportUmaf(): Promise<boolean> {
    return (await call("support_umaf")) as boolean;
  }

  // boot_umaf
  public static async bootUmaf() {
    return await call("boot_umaf");
  }

  // boot_bios
  public static async bootBios() {
    return await call("boot_bios");
  }

  // get_product_name
  public static async getProductName(): Promise<string> {
    return ((await call("get_product_name")) as string) || "";
  }

  // get_vendor_name
  public static async getVendorName(): Promise<string> {
    return ((await call("get_vendor_name")) as string) || "";
  }

  // get_desktop_session
  public static async getDesktopSession(): Promise<SessionMode> {
    const result = (await call("get_desktop_session")) as SessionMode;
    console.log(`get_desktop_session: ${result}`);
    return result || SessionMode.XORG;
  }

  // set_desktop_session
  public static async setDesktopSession(session: SessionMode) {
    return await call("set_desktop_session", session);
  }

  // can_switch_desktop_session
  public static async canSwitchDesktopSession(): Promise<boolean> {
    return (await call("can_switch_desktop_session")) as boolean;
  }

  // get_gpu_devices
  public static async getGpuDevices(): Promise<GpuDevice[]> {
    try {
      const result = (await call("get_gpu_devices")) as any;
      if (!result) {
        return [];
      }
      return result as GpuDevice[];
    } catch (e) {
      console.error(`getGpuDevices error: ${e}`);
      return [];
    }
  }

  // set_vulkan_adapter
  public static async setVulkanAdapter(deviceId: string): Promise<boolean> {
    try {
      return (await call("set_vulkan_adapter", deviceId)) as boolean;
    } catch (e) {
      console.error(`setVulkanAdapter error: ${e}`);
      return false;
    }
  }

  // get_current_vulkan_adapter
  public static async getCurrentVulkanAdapter(): Promise<string> {
    try {
      return (await call("get_current_vulkan_adapter")) as string;
    } catch (e) {
      console.error(`getCurrentVulkanAdapter error: ${e}`);
      return "";
    }
  }

  // get_hibernate_readiness
  public static async getHibernateReadiness(): Promise<HibernateReadiness> {
    try {
      return (await call("get_hibernate_readiness")) as HibernateReadiness;
    } catch (e) {
      console.error(`getHibernateReadiness error: ${e}`);
      return {
        can_hibernate: false,
        reason: "检查失败",
        checks: {
          swap_size_ok: false,
          resume_configured: false,
          swap_active: false,
        },
        info: {
          mem_total_gb: 0,
          swap_total_gb: 0,
          swap_devices: [],
          resume_device: null,
          resume_offset: null,
        },
        suggestions: [],
      };
    }
  }

  // execute_hibernate
  public static async executeHibernate(): Promise<HibernateResult> {
    try {
      return (await call("execute_hibernate")) as HibernateResult;
    } catch (e) {
      console.error(`executeHibernate error: ${e}`);
      return {
        success: false,
        message: `执行失败: ${e}`,
      };
    }
  }

  // make_swapfile_with_size
  public static async makeSwapfileWithSize(sizeGb: number): Promise<HibernateResult> {
    try {
      return (await call("make_swapfile_with_size", sizeGb)) as HibernateResult;
    } catch (e) {
      console.error(`makeSwapfileWithSize error: ${e}`);
      return {
        success: false,
        message: `创建失败: ${e}`,
      };
    }
  }

  // get_current_orientation
  public static async getCurrentOrientation(): Promise<string> {
    try {
      return (await call("get_current_orientation")) as string;
    } catch (e) {
      console.error(`getCurrentOrientation error: ${e}`);
      return "";
    }
  }

  // set_orientation_override
  public static async setOrientationOverride(orientation: string): Promise<boolean> {
    try {
      return (await call("set_orientation_override", orientation)) as boolean;
    } catch (e) {
      console.error(`setOrientationOverride error: ${e}`);
      return false;
    }
  }
}
