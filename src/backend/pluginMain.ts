import { Backend, Settings } from ".";


export class PluginManager {
  public static register = async () => {
    await Backend.init();
    await Settings.init();
  };
  public static unregister() {}
}
