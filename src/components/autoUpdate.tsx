import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  ToggleField
} from "@decky/ui";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { FC, useEffect, useState } from "react";
import { Settings } from "../backend";
import { useAutoUpdate } from "../hooks";


export const AutoUpdateComponent: FC = () => {
  const [showAutoUpdate, setShowAutoUpdate] = useState<boolean>(Settings.showAutoUpdate);

  const {
    enableAutoUpdate,
    enableAutoUpdateHandyGCCS,
    enableAutoUpdateHHD,
    enableAutoUpdateSkChosTool,
    updateAutoUpdate,
    updateAutoUpdateHandyGCCS,
    updateAutoUpdateHHD,
    updateAutoUpdateSkChosTool,
  } = useAutoUpdate();

  useEffect(() => {
    Settings.showAutoUpdate = showAutoUpdate;
  }, [showAutoUpdate]);

  return (
    <PanelSection title={"更新"}>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          // @ts-ignore
          style={{
            height: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setShowAutoUpdate(!showAutoUpdate)}
        >
          {showAutoUpdate ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
        </ButtonItem>
      </PanelSectionRow>
      {showAutoUpdate && <>
        <PanelSectionRow>
          <ToggleField
            label={"自动更新组件"}
            description={"总开关"}
            checked={enableAutoUpdate}
            onChange={updateAutoUpdate}
          />
        </PanelSectionRow>
        {enableAutoUpdate && <>
          <PanelSectionRow>
            <ToggleField
              label={"自动更新 HHD"}
              checked={enableAutoUpdateHHD}
              onChange={updateAutoUpdateHHD}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField
              label={"自动更新 HandyGCCS"}
              checked={enableAutoUpdateHandyGCCS}
              onChange={updateAutoUpdateHandyGCCS}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField
              label={"自动更新 Sk-ChimeraOS 工具"}
              checked={enableAutoUpdateSkChosTool}
              onChange={updateAutoUpdateSkChosTool}
            />
          </PanelSectionRow>
        </>}
      </>}
    </PanelSection>
  )
}