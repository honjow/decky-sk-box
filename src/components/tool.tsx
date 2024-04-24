import {
  PanelSection,
  PanelSectionRow,
} from "decky-frontend-lib";
import { VFC, useState } from "react";
import { Backend, Settings } from "../backend";
import { ActionButtonItem } from ".";


export const ToolComponent: VFC = () => {
  const [showBootToWindows, _] = useState<boolean>(Settings.showBootToWindows);

  const bootToWindows = async () => {
    await Backend.bootToWindows();
  }

  const addSteamLibrary = async () => {
    const mountpoints = await Backend.getMountpoint();
    // log
    console.log(`mountpoints: ${mountpoints.map((p) => p.mountpoint).join(", ")}`);
  }

  return (
    <PanelSection title={"工具"}>
      {showBootToWindows &&
        <PanelSectionRow>
          <ActionButtonItem
            onClick={bootToWindows}
            debugLabel="bootToWindows"
          > 重启到 Windows
          </ActionButtonItem>
        </PanelSectionRow>}
      <PanelSectionRow>
        <ActionButtonItem
          onClick={addSteamLibrary}
          debugLabel="addSteamLibrary"
          description="可以不用切换到桌面模式的 Steam 中添加, 但是不能检测已添加上的游戏库"
        > 添加 Steam 游戏库
        </ActionButtonItem>
      </PanelSectionRow>
    </PanelSection>
  )

}