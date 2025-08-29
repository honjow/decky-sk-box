import {
  definePlugin,
  staticClasses,
} from "@decky/ui";
import { FC } from "react";
import { FaDemocrat } from "react-icons/fa";
import {
  AdvanceComponent,
  AutoUpdateComponent,
  FrzrCtlComponent,
  MoreComponent,
  GeneralComponent,
  ToolComponent,
} from "./components";
import { PluginManager } from "./backend";

const Content: FC<{}> = () => {

  return (
    <>
      <ToolComponent />
      <GeneralComponent />
      <AdvanceComponent />
      <FrzrCtlComponent />
      <AutoUpdateComponent />
      <MoreComponent />
    </>
  );
};

export default definePlugin(() => {
  PluginManager.register();

  return {
    title: <div className={staticClasses.Title}>SK Box</div>,
    content: <Content />,
    icon: <FaDemocrat />,
    onDismount() {
      PluginManager.unregister();
    },
  };
});
