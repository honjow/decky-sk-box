

export class Settings {
    private static _instance: Settings = new Settings();

    private _showSwitch: boolean = false;
    private _showAdvance: boolean = false;

    private currentVersion: string = "";
    private latestVersion: string = "";

    private constructor() {}

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
        return this._instance.currentVersion;
    }

    public static set currentVersion(value: string) {
        this._instance.currentVersion = value;
    }

    public static get latestVersion(): string {
        return this._instance.latestVersion;
    }

    public static set latestVersion(value: string) {
        this._instance.latestVersion = value;
    }
    
}