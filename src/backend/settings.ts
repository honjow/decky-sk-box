import { Backend } from ".";

export class Settings {
  private static _instance: Settings = new Settings();

  private _showSwitch: boolean = false;
  private _showAdvance: boolean = false;

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
}
