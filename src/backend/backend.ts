import { ServerAPI } from "decky-frontend-lib";

export class Backend {
  private static serverAPI: ServerAPI;
  public static async init(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
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

  // get_hhd_enabled
  public static async getHhdEnabled(): Promise<boolean> {
    return (await this.serverAPI!.callPluginMethod("get_hhd_enabled", {}))
      .result as boolean;
  }

  // set_hhd_enabled
  public static async setHhdEnabled(value: boolean) {
    return await this.serverAPI!.callPluginMethod("set_hhd_enabled", {
      enabled: value,
    });
  }

  // get_auto_keep_boot_enabled
  public static async getAutoKeepBootEnabled(): Promise<boolean> {
    return (
      await this.serverAPI!.callPluginMethod("get_auto_keep_boot_enabled", {})
    ).result as boolean;
  }

  // set_auto_keep_boot_enabled
  public static async setAutoKeepBootEnabled(value: boolean) {
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
  public static async getHhdUpdateEnabled(): Promise<boolean> {
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
}