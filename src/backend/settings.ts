import { Backend } from ".";

export class Settings {
  private static _instance: Settings = new Settings();

  private _showSwitch: boolean = false;
  private _showAdvance: boolean = false;
  private _showAutoUpdate: boolean = false;

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

  private _currentVersion: string = "";
  private _latestVersion: string = "";

  private constructor() {}

  public static async init() {
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

  public static get showSwitch(): boolean {
    return this._instance._showSwitch;
  }

  public static set showSwitch(value: boolean) {
    this._instance._showSwitch = value;
  }

  public static get showAdvance(): boolean {
    return this._instance._showAdvance;
  }

  public static set showAdvance(value: boolean) {
    this._instance._showAdvance = value;
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

  public static get showAutoUpdate(): boolean {
    return this._instance._showAutoUpdate;
  }

  public static set showAutoUpdate(value: boolean) {
    this._instance._showAutoUpdate = value;
  }

}
