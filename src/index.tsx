import {
  definePlugin,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip } from "react-icons/fa";
import { AdvanceComponent, MoreComponent, SwitchComponent } from "./components";

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

  return {
    title: <div className={staticClasses.Title}>SK Box</div>,
    content: <Content />,
    icon: <FaShip />,
    onDismount() {
    },
  };
});
