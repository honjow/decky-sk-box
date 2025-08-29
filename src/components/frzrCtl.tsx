import { ButtonItem, PanelSection, PanelSectionRow, ToggleField, TextField } from "@decky/ui";
import { FC, useEffect, useState } from "react";
import { Settings } from "../backend";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
import { useFrzrCtl } from "../hooks/useFrzrCtl";

export const FrzrCtlComponent: FC = () => {
  const [showFrzrCtl, setShowFrzrCtl] = useState<boolean>(Settings.showFrzrCtl);
  const { configStructure, updateConfig } = useFrzrCtl();

  useEffect(() => {
    Settings.showFrzrCtl = showFrzrCtl;
  }, [showFrzrCtl]);

  const renderConfigItem = (section: string, key: string, configValue: any) => {
    const { value, type, label, description } = configValue;
    
    // 使用配置文件中的 label 和 description，如果没有则用 key 作为 fallback
    const displayLabel = label || key;
    const displayDescription = description || `${section}.${key} 配置项`;
    
    if (type === "boolean") {
      return (
        <ToggleField
          label={displayLabel}
          description={displayDescription}
          checked={value}
          onChange={(newValue) => updateConfig(section, key, newValue.toString())}
        />
      );
    } else {
      return (
        <TextField
          label={displayLabel}
          description={displayDescription}
          value={value}
          onChange={(e) => updateConfig(section, key, e.target.value)}
        />
      );
    }
  };

  return (
    <PanelSection title={"系统更新"}>
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
              // @ts-ignore
              <PanelSectionRow key={`${section}.${key}`}>
                {renderConfigItem(section, key, configValue)}
              </PanelSectionRow>
            ))
          )}
        </>
      )}
    </PanelSection>
  );
};