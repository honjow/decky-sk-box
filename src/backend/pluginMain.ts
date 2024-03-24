import { ServerAPI } from "decky-frontend-lib";
import { Backend, Settings } from ".";


export class PluginManager {
  public static register = async (serverAPI: ServerAPI) => {
    // await LocalizationManager.init(serverAPI);
    await Backend.init(serverAPI);
    await Settings.init();
  };
  public static unregister() {}
}
