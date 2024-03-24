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

}
