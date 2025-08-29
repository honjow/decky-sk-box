import { ButtonItem, PanelSection, PanelSectionRow, ToggleField, TextField } from "@decky/ui";
import { FC, useEffect, useState } from "react";
import { Settings } from "../backend";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
import { useFrzrCtl } from "../hooks/useFrzrCtl";

export const FrzrCtlComponent: FC = () => {
  const [showFrzrCtl, setShowFrzrCtl] = useState<boolean>(Settings.showFrzrCtl);
  const { configStructure, loading, updateConfig } = useFrzrCtl();

  useEffect(() => {
    Settings.showFrzrCtl = showFrzrCtl;
  }, [showFrzrCtl]);

  const renderConfigItem = (section: string, key: string, configValue: any) => {
    const { value, type } = configValue;
    
    if (type === "boolean") {
      return (
        <ToggleField
          label={key}
          checked={value}
          onChange={(newValue) => updateConfig(section, key, newValue.toString())}
          disabled={loading}
        />
      );
    } else {
      return (
        <TextField
          label={key}
          value={value}
          onChange={(e) => updateConfig(section, key, e.target.value)}
          disabled={loading}
        />
      );
    }
  };

  return (
    <PanelSection title={"更新控制"}>
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
          onClick={() => setShowFrzrCtl(!showFrzrCtl)}
        >
          {showFrzrCtl ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
        </ButtonItem>
      </PanelSectionRow>
      {showFrzrCtl && (
        <>
          {Object.entries(configStructure).map(([section, sectionConfig]) =>
            Object.entries(sectionConfig).map(([key, configValue]) => (
              <PanelSectionRow>
                {renderConfigItem(section, key, configValue)}
              </PanelSectionRow>
            ))
          )}
        </>
      )}
    </PanelSection>
  );
};