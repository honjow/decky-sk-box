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
  private static _instance: Settings = new Settings();

  private _settingsData: SettingsData;

  // private _showSwitch: boolean = false;
  // private _showAdvance: boolean = false;
  // private _showAutoUpdate: boolean = false;

  private _enableKeepBoot: boolean = false;
  private _enableHHD: boolean = false;
  private _enableHandyCon: boolean = false;
  private _enableUSBWakeup: boolean = false;
  private _enableHibernate: boolean = false;
  private _enableFirmwareOverride: boolean = false;
  private _enableInputPlumber: boolean = false;

  private _hhdInstalled: boolean = false;
  private _handyConInstalled: boolean = false;
  private _inputPlumberInstalled: boolean = false;

  private _enableAutoUpdate: boolean = false;
  private _enableAutoUpdateHandyGCCS: boolean = false;
  private _enableAutoUpdateHHD: boolean = false;
  private _enableAutoUpdateSkChosTool: boolean = false;

  private _swapfileMaking: boolean = false;

  private _showBootToWindows: boolean = false;

  private _currentVersion: string = "";
  private _latestVersion: string = "";

  private _addonVersion: string = "";
  private _sktVersion: string = "";

  private _sleepMode: string = "";
  private _hibernateDelay: string = defaultDelay;

  private _supportUmaf: boolean = false;

  private constructor() {
    this._settingsData = new SettingsData();
  }

  private static get settingsData(): SettingsData {
    return this._instance._settingsData;
  }

  public static async loadSettingsData() {
    const _settingsData = await Backend.getSettings();
    // console.log(`SettingsData: ${JSON.stringify(_settingsData)}`);
    this.settingsData.deepCopy(_settingsData);
  }

  public static async saveSettingsData() {
    // console.log(`SettingsData save: ${JSON.stringify(this.settingsData)}`);
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

    Backend.getPackageVersion("sk-chos-addon").then((value) => {
      this._instance._addonVersion = value;
    });

    Backend.getPackageVersion("sk-chos-tool").then((value) => {
      this._instance._sktVersion = value;
    });

    Backend.getUsbWakeupEnabled().then((value) => {
      this._instance._enableUSBWakeup = value;
    });

    Backend.getHandyConEnabled().then((value) => {
      this._instance._enableHandyCon = value;
    });

    Backend.getHHDEnabled().then((value) => {
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

    Backend.getWinBootEntry().then((value) => {
      if (Boolean(value)) {
        this._instance._showBootToWindows = true;
      }
    });

    Backend.hhdInstalled().then((value) => {
      this._instance._hhdInstalled = value;
    });

    Backend.handyconInstalled().then((value) => {
      this._instance._handyConInstalled = value;
    });

    Backend.inputplumberInstalled().then((value) => {
      this._instance._inputPlumberInstalled = value;
    });

    Backend.getSleepMode().then((value) => {
      this._instance._sleepMode = value;
    });

    Backend.getHibernateDelay().then((value) => {
      if (value === "") {
        this._instance._hibernateDelay = defaultDelay;
        Backend.setHibernateDelay(this._instance._hibernateDelay);
      }
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

  public static get addonVersion(): string {
    return this._instance._addonVersion;
  }

  public static set addonVersion(value: string) {
    this._instance._addonVersion = value;
  }

  public static get sktVersion(): string {
    return this._instance._sktVersion;
  }

  public static set sktVersion(value: string) {
    this._instance._sktVersion = value;
  }

  public static get showBootToWindows(): boolean {
    return this._instance._showBootToWindows;
  }

  public static set showBootToWindows(value: boolean) {
    this._instance._showBootToWindows = value;
  }

  public static get enableInputPlumber(): boolean {
    return this._instance._enableInputPlumber;
  }

  public static set enableInputPlumber(value: boolean) {
    this._instance._enableInputPlumber = value;
  }

  public static get hhdInstalled(): boolean {
    return this._instance._hhdInstalled;
  }

  public static set hhdInstalled(value: boolean) {
    this._instance._hhdInstalled = value;
  }

  public static get handyConInstalled(): boolean {
    return this._instance._handyConInstalled;
  }

  public static set handyConInstalled(value: boolean) {
    this._instance._handyConInstalled = value;
  }

  public static get inputPlumberInstalled(): boolean {
    return this._instance._inputPlumberInstalled;
  }

  public static set inputPlumberInstalled(value: boolean) {
    this._instance._inputPlumberInstalled = value;
  }

  public static get sleepMode(): string {
    return this._instance._sleepMode;
  }

  public static set sleepMode(value: string) {
    this._instance._sleepMode = value;
  }

  public static get hibernateDelay(): string {
    return this._instance._hibernateDelay;
  }

  public static set hibernateDelay(value: string) {
    this._instance._hibernateDelay = value;
  }

  public static get supportUmaf(): boolean {
    return this._instance._supportUmaf;
  }

  public static set supportUmaf(value: boolean) {
    this._instance._supportUmaf = value;
  }
}
