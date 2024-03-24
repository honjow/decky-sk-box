import {
  definePlugin,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip } from "react-icons/fa";
import { AdvanceComponent, MoreComponent, SwitchComponent } from "./components";
import { PluginManager } from "./backend";

const Content: VFC<{}> = () => {

  return (
    <>
      <SwitchComponent />
      <AdvanceComponent />
      <MoreComponent />
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  PluginManager.register(serverApi);

  return {
    title: <div className={staticClasses.Title}>SK Box</div>,
    content: <Content />,
    icon: <FaShip />,
    onDismount() {
      PluginManager.unregister();
    },
  };
});
