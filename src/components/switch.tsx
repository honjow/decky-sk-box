import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  ToggleField
} from "decky-frontend-lib";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { VFC, useEffect, useState } from "react";
import { Settings } from "../backend";
import { useSwitch } from "../hooks";


export const SwitchComponent: VFC = () => {
  const [showSwitch, setShowSwitch] = useState<boolean>(Settings.showSwitch);

  const {
    enableKeepBoot,
    updateKeepBoot,
    enableHHD,
    updateHHD,
    enableHandyCon,
    updateHandyCon,
    enableUSBWakeup,
    updateUSBWakeup,
    enableHibernate,
    updateHibernate,
    enableFirmwareOverride,
    updateFirmwareOverride,
  } = useSwitch();

  useEffect(() => {
    Settings.showSwitch = showSwitch;
  }, [showSwitch]);

  return (
    <PanelSection title={"常用开关"}>
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
          onClick={() => setShowSwitch(!showSwitch)}
        >
          {showSwitch ? <RiArrowDownSFill /> : <RiArrowUpSFill />}
        </ButtonItem>
      </PanelSectionRow>
      {showSwitch && <>
        <PanelSectionRow>
          <ToggleField
            label={"启动项守护服务"}
            description={"开启后, 每次启动 Sk-Chimeraos 都会将自身启动项作为下次启动项, 解决双系统启动项维持问题。最好配合 Windows 启动到 Sk-Chimeraos 的功能使用, 否则建议关闭"}
            checked={enableKeepBoot}
            onChange={updateKeepBoot}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label={"HHD"}
            description={"Handheld Daemon, 另一个手柄驱动程序, 通过模拟 PS5 手柄支持陀螺仪和背键能等功能. 不能和 HandyGCCS 同时使用. 请配合HHD Decky插件使用"}
            checked={enableHHD}
            onChange={updateHHD}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label={"HandyGCCS"}
            description={"用来驱动部分掌机的手柄按钮, 不能和 HHD 同时使用."}
            checked={enableHandyCon}
            onChange={updateHandyCon}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label={"休眠"}
            description={"开启后按下电源键会进入休眠状态, 否则是睡眠状态"}
            checked={enableHibernate}
            onChange={updateHibernate}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label={"firmware固件覆盖"}
            description={"启用DSDT、EDID覆盖等, 用于修复和优化部分掌机的问题，切换后需要重启生效。建议开启"}
            checked={enableFirmwareOverride}
            onChange={updateFirmwareOverride}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label={"USB唤醒"}
            checked={enableUSBWakeup}
            onChange={updateUSBWakeup}
          />
        </PanelSectionRow>
      </>}
    </PanelSection>
  )
}