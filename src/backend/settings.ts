import { Backend } from ".";

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
  private static _instance: Settings = new Settings();

  private _settingsData: SettingsData;

  // private _showSwitch: boolean = false;
  // private _showAdvance: boolean = false;
  // private _showAutoUpdate: boolean = false;

  private _enableKeepBoot: boolean = true;
  private _enableHHD: boolean = true;
  private _enableHandyCon: boolean = false;
  private _enableUSBWakeup: boolean = false;
  private _enableHibernate: boolean = false;
  private _enableFirmwareOverride: boolean = false;

  private _enableAutoUpdate: boolean = true;
  private _enableAutoUpdateHandyGCCS: boolean = true;
  private _enableAutoUpdateHHD: boolean = true;
  private _enableAutoUpdateSkChosTool: boolean = true;

  private _swapfileMaking: boolean = false;

  private _currentVersion: string = "";
  private _latestVersion: string = "";

  private constructor() {
    this._settingsData = new SettingsData();
  }

  private static get settingsData(): SettingsData {
    return this._instance._settingsData;
  }

  public static async loadSettingsData() {
    const _settingsData = await Backend.getSettings();
    console.log(`SettingsData: ${JSON.stringify(_settingsData)}`);
    this.settingsData.deepCopy(_settingsData);
  }

  public static async saveSettingsData() {
    console.log(`SettingsData save: ${JSON.stringify(this.settingsData)}`);
    await Backend.setSettings(this.settingsData);
  }

  public static async init() {
    await this.loadSettingsData();

    Backend.getVersion().then((value) => {
      this._instance._currentVersion = value;
    });

    Backend.getLatestVersion().then((value) => {
      this._instance._latestVersion = value;
    });

    Backend.getUsbWakeupEnabled().then((value) => {
      this._instance._enableUSBWakeup = value;
    });

    Backend.getHandyConEnabled().then((value) => {
      this._instance._enableHandyCon = value;
    });

    Backend.getHhdEnabled().then((value) => {
      this._instance._enableHHD = value;
    });

    Backend.getHibernateEnabled().then((value) => {
      this._instance._enableHibernate = value;
    });

    Backend.getFirmwareOverrideEnabled().then((value) => {
      this._instance._enableFirmwareOverride = value;
    });

    Backend.getAutoKeepBootEnabled().then((value) => {
      this._instance._enableKeepBoot = value;
    });

    Backend.getEnableAutoUpdate().then((value) => {
      this._instance._enableAutoUpdate = value;
    });

    Backend.getHandyUpdateEnabled().then((value) => {
      this._instance._enableAutoUpdateHandyGCCS = value;
    });

    Backend.getHhdUpdateEnabled().then((value) => {
      this._instance._enableAutoUpdateHHD = value;
    });

    Backend.getSktUpdateEnabled().then((value) => {
      this._instance._enableAutoUpdateSkChosTool = value;
    });
  }

  public static get swapfileMaking(): boolean {
    return this._instance._swapfileMaking;
  }

  public static set swapfileMaking(value: boolean) {
    this._instance._swapfileMaking = value;
  }

  public static get showSwitch(): boolean {
    return this.settingsData.showSwitch;
  }

  public static set showSwitch(value: boolean) {
    this.settingsData.showSwitch = value;
    this.saveSettingsData();
  }

  public static get showAdvance(): boolean {
    return this.settingsData.showAdvance;
  }

  public static set showAdvance(value: boolean) {
    this.settingsData.showAdvance = value;
    this.saveSettingsData();
  }

  public static get showAutoUpdate(): boolean {
    return this.settingsData.showAutoUpdate;
  }

  public static set showAutoUpdate(value: boolean) {
    this.settingsData.showAutoUpdate = value;
    this.saveSettingsData();
  }

  public static get currentVersion(): string {
    return this._instance._currentVersion;
  }

  public static set currentVersion(value: string) {
    this._instance._currentVersion = value;
  }

  public static get latestVersion(): string {
    return this._instance._latestVersion;
  }

  public static set latestVersion(value: string) {
    this._instance._latestVersion = value;
  }

  public static get enableKeepBoot(): boolean {
    return this._instance._enableKeepBoot;
  }

  public static set enableKeepBoot(value: boolean) {
    this._instance._enableKeepBoot = value;
  }

  public static get enableHHD(): boolean {
    return this._instance._enableHHD;
  }

  public static set enableHHD(value: boolean) {
    this._instance._enableHHD = value;
  }

  public static get enableHandyCon(): boolean {
    return this._instance._enableHandyCon;
  }

  public static set enableHandyCon(value: boolean) {
    this._instance._enableHandyCon = value;
  }

  public static get enableUSBWakeup(): boolean {
    return this._instance._enableUSBWakeup;
  }

  public static set enableUSBWakeup(value: boolean) {
    this._instance._enableUSBWakeup = value;
  }

  public static get enableHibernate(): boolean {
    return this._instance._enableHibernate;
  }

  public static set enableHibernate(value: boolean) {
    this._instance._enableHibernate = value;
  }

  public static get enableFirmwareOverride(): boolean {
    return this._instance._enableFirmwareOverride;
  }

  public static set enableFirmwareOverride(value: boolean) {
    this._instance._enableFirmwareOverride = value;
  }

  public static get enableAutoUpdate(): boolean {
    return this._instance._enableAutoUpdate;
  }

  public static set enableAutoUpdate(value: boolean) {
    this._instance._enableAutoUpdate = value;
  }

  public static get enableAutoUpdateHandyGCCS(): boolean {
    return this._instance._enableAutoUpdateHandyGCCS;
  }

  public static set enableAutoUpdateHandyGCCS(value: boolean) {
    this._instance._enableAutoUpdateHandyGCCS = value;
  }

  public static get enableAutoUpdateHHD(): boolean {
    return this._instance._enableAutoUpdateHHD;
  }

  public static set enableAutoUpdateHHD(value: boolean) {
    this._instance._enableAutoUpdateHHD = value;
  }

  public static get enableAutoUpdateSkChosTool(): boolean {
    return this._instance._enableAutoUpdateSkChosTool;
  }

  public static set enableAutoUpdateSkChosTool(value: boolean) {
    this._instance._enableAutoUpdateSkChosTool = value;
  }
}
