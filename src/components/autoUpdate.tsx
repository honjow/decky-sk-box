import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  ToggleField
} from "decky-frontend-lib";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { VFC, useEffect, useState } from "react";
import { Settings } from "../backend";
import { useAutoUpdate } from "../hooks";


export const AutoUpdateComponent: VFC = () => {
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
    <PanelSection title={"自动更新"}>
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
          {showAutoUpdate ? <RiArrowDownSFill /> : <RiArrowUpSFill />}
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