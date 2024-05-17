import {
  definePlugin,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaDemocrat } from "react-icons/fa";
import {
  AdvanceComponent,
  AutoUpdateComponent,
  MoreComponent,
  GeneralComponent,
  ToolComponent,
} from "./components";
import { PluginManager } from "./backend";

const Content: VFC<{}> = () => {

  return (
    <>
      <ToolComponent />
      <GeneralComponent />
      <AdvanceComponent />
      <AutoUpdateComponent />
      <MoreComponent />
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  PluginManager.register(serverApi);

  return {
    title: <div className={staticClasses.Title}>SK Box</div>,
    content: <Content />,
    icon: <FaDemocrat />,
    onDismount() {
      PluginManager.unregister();
    },
  };
});
