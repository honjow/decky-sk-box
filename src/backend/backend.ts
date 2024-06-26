import { ServerAPI } from "decky-frontend-lib";
import { SettingsData, SleepMode } from ".";

export interface MotionPoint {
  path: string;
  mountpoint: string;
  fstype: string;
  fssize: string;
  fsvail: string;
}

export class Backend {
  private static serverAPI: ServerAPI;
  public static async init(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
  }

  public static getServerAPI() {
    return this.serverAPI;
  }

  public static async updateLatest() {
    return await this.serverAPI!.callPluginMethod("update_latest", {});
  }

  public static async getVersion(): Promise<string> {
    return (await this.serverAPI!.callPluginMethod("get_version", {}))
      .result as string;
  }

  public static async getLatestVersion(): Promise<string> {
    return (await this.serverAPI!.callPluginMethod("get_latest_version", {}))
      .result as string;
  }

  // get_usb_wakeup_enabled
  public static async getUsbWakeupEnabled(): Promise<boolean> {
    return (
      await this.serverAPI!.callPluginMethod("get_usb_wakeup_enabled", {})
    ).result as boolean;
  }

  // set_usb_wakeup
  public static async setUsbWakeup(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_usb_wakeup", {
      enabled: value,
    });
  }

  // get_handycon_enabled
  public static async getHandyConEnabled(): Promise<boolean> {
    return (await this.serverAPI!.callPluginMethod("get_handycon_enabled", {}))
      .result as boolean;
  }

  // set_handycon_enabled
  public static async setHandyConEnabled(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_handycon_enabled", {
      enabled: value,
    });
  }

  // get_inputplumber_enabled
  public static async getInputPlumberEnabled(): Promise<boolean> {
    return (
      await this.serverAPI!.callPluginMethod("get_inputplumber_enabled", {})
    ).result as boolean;
  }

  // set_inputplumber_enabled
  public static async setInputPlumberEnabled(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_inputplumber_enabled", {
      enabled: value,
    });
  }

  // get_hhd_enabled
  public static async getHHDEnabled(): Promise<boolean> {
    return (await this.serverAPI!.callPluginMethod("get_hhd_enabled", {}))
      .result as boolean;
  }

  // set_hhd_enabled
  public static async setHHDEnabled(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_hhd_enabled", {
      enabled: value,
    });
  }

  // get_auto_keep_boot_enabled
  public static async getAutoKeepBootEnabled(): Promise<boolean> {
    // return (
    //   await this.serverAPI!.callPluginMethod("get_auto_keep_boot_enabled", {})
    // ).result as boolean;
    try {
      return (await this.serverAPI!.callPluginMethod("get_auto_keep_boot_enabled", {})).result as boolean;
    } catch (e) {
      console.error(`getAutoKeepBootEnabled error: ${e}`);
      return false;
    }
  }

  // set_auto_keep_boot_enabled
  public static async setAutoKeepBootEnabled(value: boolean) {
    console.log("setAutoKeepBootEnabled", value);
    return await this.serverAPI!.callPluginMethod(
      "set_auto_keep_boot_enabled",
      { enabled: value }
    );
  }

  // get_hibernate_enabled
  public static async getHibernateEnabled(): Promise<boolean> {
    return (await this.serverAPI!.callPluginMethod("get_hibernate_enabled", {}))
      .result as boolean;
  }

  // set_hibernate_enabled
  public static async setHibernateEnabled(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_hibernate_enabled", {
      enabled: value,
    });
  }

  // firmware_override_enabled
  public static async getFirmwareOverrideEnabled(): Promise<boolean> {
    return (
      await this.serverAPI!.callPluginMethod("firmware_override_enabled", {})
    ).result as boolean;
  }

  // set_firmware_override
  public static async setFirmwareOverride(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_firmware_override", {
      enabled: value,
    });
  }

  // get_enable_auto_update
  public static async getEnableAutoUpdate(): Promise<boolean> {
    return (
      await this.serverAPI!.callPluginMethod("get_enable_auto_update", {})
    ).result as boolean;
  }

  // set_enable_auto_update
  public static async setEnableAutoUpdate(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_enable_auto_update", {
      enabled: value,
    });
  }

  // get_skt_update_enabled
  public static async getSktUpdateEnabled(): Promise<boolean> {
    return (
      await this.serverAPI!.callPluginMethod("get_skt_update_enabled", {})
    ).result as boolean;
  }

  // set_skt_update_enabled
  public static async setSktUpdateEnabled(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_skt_update_enabled", {
      enabled: value,
    });
  }

  // get_handy_update_enabled
  public static async getHandyUpdateEnabled(): Promise<boolean> {
    return (
      await this.serverAPI!.callPluginMethod("get_handy_update_enabled", {})
    ).result as boolean;
  }

  // set_handy_update_enabled
  public static async setHandyUpdateEnabled(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_handy_update_enabled", {
      enabled: value,
    });
  }

  // get_hhd_update_enabled
  public static async getHHDUpdateEnabled(): Promise<boolean> {
    return (
      await this.serverAPI!.callPluginMethod("get_hhd_update_enabled", {})
    ).result as boolean;
  }

  // set_hhd_update_enabled
  public static async setHhdUpdateEnabled(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_hhd_update_enabled", {
      enabled: value,
    });
  }

  // boot_repair
  public static async bootRepair() {
    return await this.serverAPI!.callPluginMethod("boot_repair", {});
  }

  // re_first_run
  public static async reFirstRun() {
    return await this.serverAPI!.callPluginMethod("re_first_run", {});
  }

  // etc_repair
  public static async etcRepair() {
    return await this.serverAPI!.callPluginMethod("etc_repair", {});
  }

  // etc_repair_full
  public static async etcRepairFull() {
    return await this.serverAPI!.callPluginMethod("etc_repair_full", {});
  }

  // make_swapfile
  public static async makeSwapfile() {
    return await this.serverAPI!.callPluginMethod("make_swapfile", {});
  }

  // reset_gnome
  public static async resetGnome() {
    return await this.serverAPI!.callPluginMethod("reset_gnome", {});
  }

  // get_settings
  public static async getSettings(): Promise<SettingsData> {
    const res = await this.serverAPI!.callPluginMethod("get_settings", {});
    if (!res.success) {
      return new SettingsData();
    }
    return res.result as SettingsData;
  }

  // set_settings
  public static async setSettings(settings: SettingsData) {
    return await this.serverAPI!.callPluginMethod("set_settings", {
      settings: settings,
    });
  }

  // get_package_version
  public static async getPackageVersion(packageName: string): Promise<string> {
    return (
      await this.serverAPI!.callPluginMethod("get_package_version", {
        package_name: packageName,
      })
    ).result as string;
  }

  // get_win_boot
  public static async getWinBootEntry(): Promise<string> {
    return (await this.serverAPI!.callPluginMethod("get_win_boot", {}))
      .result as string;
  }

  // boot_to_win
  public static async bootToWindows() {
    return await this.serverAPI!.callPluginMethod("boot_to_win", {});
  }

  // get_mountpoint
  public static async getMountpoint(): Promise<MotionPoint[]> {
    const result = await this.serverAPI!.callPluginMethod("get_mountpoint", {});
    if (!result.success) {
      return [];
    }
    const data = result.result;

    return (data as []).map((item: any) => {
      return {
        path: item["path"],
        mountpoint: item["mountpoint"],
        fstype: item["fstype"],
        fssize: item["fssize"],
        fsvail: item["fsvail"],
      } as MotionPoint;
    });
  }

  // add_library_folder
  public static async addLibraryFolder(mountpoint: string): Promise<boolean> {
    const result = await this.serverAPI!.callPluginMethod(
      "add_library_folder",
      {
        mountpoint: mountpoint,
      }
    );
    if (!result.success) {
      return false;
    }
    return result.result as boolean;
  }

  // hhd_installed
  public static async hhdInstalled(): Promise<boolean> {
    return (await this.serverAPI!.callPluginMethod("hhd_installed", {}))
      .result as boolean;
  }

  // handycon_installed
  public static async handyconInstalled(): Promise<boolean> {
    return (await this.serverAPI!.callPluginMethod("handycon_installed", {}))
      .result as boolean;
  }

  // inputplumber_installed
  public static async inputplumberInstalled(): Promise<boolean> {
    return (await this.serverAPI!.callPluginMethod("inputplumber_installed", {}))
      .result as boolean;
  }

  // get_sleep_mode
  public static async getSleepMode(): Promise<SleepMode> {
    const result = await this.serverAPI!.callPluginMethod("get_sleep_mode", {});
    console.log(">>>>>>>> getSleepMode", result);
    if (!result.success) {
      return SleepMode.SUSPEND;
    }
    const sleepMode = result.result as String;
    console.log(">>>>>>>> getSleepMode", sleepMode);
    return result.result as SleepMode;
  }

  // set_sleep_mode
  public static async setSleepMode(type: SleepMode) {
    return await this.serverAPI!.callPluginMethod("set_sleep_mode", {
      sleep_mode: type.toString(),
    });
  }

  // set_hibernate_delay
  public static async setHibernateDelay(delay: string) {
    return await this.serverAPI!.callPluginMethod("set_hibernate_delay", {
      delay: delay,
    });
  }

  // get_hibernate_delay
  public static async getHibernateDelay(): Promise<string> {
    const result = await this.serverAPI!.callPluginMethod("get_hibernate_delay", {});
    if (!result.success) {
      return "";
    }
    return result.result as string;
  }

  // support_umaf
  public static async supportUmaf(): Promise<boolean> {
    return (await this.serverAPI!.callPluginMethod("support_umaf", {}))
      .result as boolean;
  }

  // boot_umaf
  public static async bootUmaf() {
    return await this.serverAPI!.callPluginMethod("boot_umaf", {});
  }

  // boot_bios
  public static async bootBios() {
    return await this.serverAPI!.callPluginMethod("boot_bios", {});
  }
}
