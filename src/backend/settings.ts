import { Backend } from ".";

export class Settings {
  private static _instance: Settings = new Settings();

  private _showSwitch: boolean = false;
  private _showAdvance: boolean = false;

  private _enableKeepBoot: boolean = true;
  private _enableHHD: boolean = true;
  private _enableHandyCon: boolean = false;
  private _enableUSBWakeup: boolean = false;
  private _enableHibernate: boolean = false;
  private _enableFirmwareOverride: boolean = false;

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

}
