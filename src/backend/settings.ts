import { Backend } from ".";

export const delayList = [
  { data: '10sec', label: '10秒' },
  { data: '30sec', label: '30秒' },
  { data: '1min', label: '1分钟' },
  { data: '5min', label: '5分钟' },
  { data: '10min', label: '10分钟' },
  { data: '30min', label: '30分钟' },
  { data: '1hour', label: '1小时' },
  { data: '2hour', label: '2小时' },
  { data: '3hour', label: '3小时' },
  { data: '6hour', label: '6小时' },
  { data: '12hour', label: '12小时' },
]
export const defaultDelay = '30min';

export class SettingsData {
  public showSwitch: boolean;
  public showAdvance: boolean;
  public showAutoUpdate: boolean;

  public constructor() {
    this.showSwitch = false;
    this.showAdvance = false;
    this.showAutoUpdate = false;
  }

  public deepCopy(settingsData: SettingsData): SettingsData {
    this.showSwitch = settingsData.showSwitch;
    this.showAdvance = settingsData.showAdvance;
    this.showAutoUpdate = settingsData.showAutoUpdate;
    return this;
  }

  public copyWith(
    showSwitch?: boolean,
    showAdvance?: boolean,
    showAutoUpdate?: boolean
  ): SettingsData {
    if (showSwitch !== undefined) this.showSwitch = showSwitch;
    if (showAdvance !== undefined) this.showAdvance = showAdvance;
    if (showAutoUpdate !== undefined) this.showAutoUpdate = showAutoUpdate;
    return this;
  }
}

export class Settings {
  private static _settingsData: SettingsData = new SettingsData();

  public static enableKeepBoot = false;
  public static enableHHD = false;
  public static enableHandyCon = false;
  public static enableUSBWakeup = false;
  public static enableHibernate = false;
  public static enableFirmwareOverride = false;
  public static enableInputPlumber = false;

  public static hhdInstalled = false;
  public static handyConInstalled = false;
  public static inputPlumberInstalled = false;

  public static enableAutoUpdate = false;
  public static enableAutoUpdateHandyGCCS = false;
  public static enableAutoUpdateHHD = false;
  public static enableAutoUpdateSkChosTool = false;

  public static swapfileMaking = false;
  public static showBootToWindows = false;

  public static currentVersion = "";
  public static latestVersion = "";
  public static addonVersion = "";
  public static sktVersion = "";

  public static sleepMode = "";
  public static hibernateDelay = defaultDelay;

  public static supportUmaf = false;
  public static productName = "";
  public static vendorName = "";

  // 私有构造函数，防止实例化
  private constructor() {}

  private static get settingsData(): SettingsData {
    return this._settingsData;
  }

  // UI settings from SettingsData with special handling
  static get showSwitch(): boolean {
    return this.settingsData.showSwitch;
  }

  static set showSwitch(value: boolean) {
    this.settingsData.showSwitch = value;
    this.saveSettingsData();
  }

  static get showAdvance(): boolean {
    return this.settingsData.showAdvance;
  }

  static set showAdvance(value: boolean) {
    this.settingsData.showAdvance = value;
    this.saveSettingsData();
  }

  static get showAutoUpdate(): boolean {
    return this.settingsData.showAutoUpdate;
  }

  static set showAutoUpdate(value: boolean) {
    this.settingsData.showAutoUpdate = value;
    this.saveSettingsData();
  }

  // Methods
  public static async loadSettingsData() {
    const settingsData = await Backend.getSettings();
    this.settingsData.deepCopy(settingsData);
  }

  public static async saveSettingsData() {
    await Backend.setSettings(this.settingsData);
  }

  public static async init() {
    await this.loadSettingsData();

    const [
      version,
      latestVersion,
      addonVersion,
      sktVersion,
      usbWakeup,
      handyCon,
      hhd,
      hibernate,
      firmwareOverride,
      keepBoot,
      autoUpdate,
      handyUpdateEnabled,
      hhdUpdateEnabled,
      sktUpdateEnabled,
      winBootEntry,
      hhdInstalled,
      handyconInstalled,
      inputplumberInstalled,
      sleepMode,
      hibernateDelay
    ] = await Promise.all([
      Backend.getVersion(),
      Backend.getLatestVersion(),
      Backend.getPackageVersion("sk-chos-addon"),
      Backend.getPackageVersion("sk-chos-tool"),
      Backend.getUsbWakeupEnabled(),
      Backend.getHandyConEnabled(),
      Backend.getHHDEnabled(),
      Backend.getHibernateEnabled(),
      Backend.getFirmwareOverrideEnabled(),
      Backend.getAutoKeepBootEnabled(),
      Backend.getEnableAutoUpdate(),
      Backend.getHandyUpdateEnabled(),
      Backend.getHHDUpdateEnabled(),
      Backend.getSktUpdateEnabled(),
      Backend.getWinBootEntry(),
      Backend.hhdInstalled(),
      Backend.handyconInstalled(),
      Backend.inputplumberInstalled(),
      Backend.getSleepMode(),
      Backend.getHibernateDelay()
    ]);

    // Update versions
    this.currentVersion = version;
    this.latestVersion = latestVersion;
    this.addonVersion = addonVersion;
    this.sktVersion = sktVersion;

    // Update system settings
    this.enableKeepBoot = keepBoot;
    this.enableHHD = hhd;
    this.enableHandyCon = handyCon;
    this.enableUSBWakeup = usbWakeup;
    this.enableHibernate = hibernate;
    this.enableFirmwareOverride = firmwareOverride;

    // Update installation status
    this.hhdInstalled = hhdInstalled;
    this.handyConInstalled = handyconInstalled;
    this.inputPlumberInstalled = inputplumberInstalled;

    // Update auto-update settings
    this.enableAutoUpdate = autoUpdate;
    this.enableAutoUpdateHandyGCCS = handyUpdateEnabled;
    this.enableAutoUpdateHHD = hhdUpdateEnabled;
    this.enableAutoUpdateSkChosTool = sktUpdateEnabled;

    // Update other settings
    this.showBootToWindows = Boolean(winBootEntry);
    this.sleepMode = sleepMode;

    if (!hibernateDelay) {
      this.hibernateDelay = defaultDelay;
      Backend.setHibernateDelay(defaultDelay);
    }
  }
}
