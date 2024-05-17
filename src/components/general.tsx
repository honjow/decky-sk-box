import {
  ButtonItem,
  DropdownItem,
  NotchLabel,
  PanelSection,
  PanelSectionRow,
  ToggleField
} from "decky-frontend-lib";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { VFC, useEffect, useState } from "react";
import { Settings, SleepMode, defaultDelay, delayList } from "../backend";
import { useGeneral } from "../hooks";
import { SlowSliderField } from ".";


export const GeneralComponent: VFC = () => {
  const [showSwitch, setShowSwitch] = useState<boolean>(Settings.showSwitch);

  const {
    enableKeepBoot,
    updateKeepBoot,
    enableHHD,
    updateHHD,
    enableHandyCon,
    updateHandyCon,
    enableInputPlumber,
    updateInputPlumber,
    hhdInstalled,
    handyConInstalled,
    inputPlumberInstalled,
    sleepMode,
    updateSleepMode,
    hibernateDelay,
    updateHibernateDelay,
  } = useGeneral();

  useEffect(() => {
    Settings.showSwitch = showSwitch;
  }, [showSwitch]);

  const sleepOptions = [
    { mode: SleepMode.SUSPEND, label: '睡眠' },
    { mode: SleepMode.HIBERNATE, label: '休眠' },
    { mode: SleepMode.SUSPEND_THEN_HIBERNATE, label: '睡眠后休眠' },
  ];

  const modeToNumber = (mode: string) => {
    return sleepOptions.findIndex((option) => option.mode === mode);
  }

  const numberToMode = (number: number) => {
    return sleepOptions[number].mode || SleepMode.SUSPEND;
  }

  const sleepNotchLabels: NotchLabel[] = sleepOptions.map((option, idx) => {
    return {
      notchIndex: idx,
      label: option.label,
      value: modeToNumber(option.mode),
    };
  });

  const updateMode = (mode: number) => {
    updateSleepMode(numberToMode(mode), false);
  }

  const updateModeEnd = (mode: number) => {
    updateSleepMode(numberToMode(mode));
  }

  return (
    <PanelSection title={"常规"}>
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
        {hhdInstalled && <PanelSectionRow>
          <ToggleField
            label={"HHD"}
            description={"Handheld Daemon, 另一个手柄驱动程序, 通过模拟 PS5 手柄支持陀螺仪和背键能等功能. 不能和 HandyGCCS 同时使用. 请配合HHD Decky插件使用"}
            checked={enableHHD}
            onChange={updateHHD}
          />
        </PanelSectionRow>}
        {handyConInstalled && <PanelSectionRow>
          <ToggleField
            label={"HandyGCCS"}
            description={"用来驱动部分掌机的手柄按钮, 不能和 HHD 同时使用."}
            checked={enableHandyCon}
            onChange={updateHandyCon}
          />
        </PanelSectionRow>}
        {inputPlumberInstalled && <PanelSectionRow>
          <ToggleField
            label={"InputPlumber"}
            description={"HandyGCCS 的替代品, 奇美拉官方出品. 控制器驱动"}
            checked={enableInputPlumber}
            onChange={updateInputPlumber}
          />
        </PanelSectionRow>}
        <PanelSectionRow>
          <SlowSliderField
            label={'睡眠模式'}
            description={'选择睡眠模式, 睡眠是默认选择。休眠是将系统状态保存到硬盘，再关机，速度较慢。睡眠后休眠 是先睡眠，在达到设置的时间后自动休眠，但是部分设备上可能存在问题'}
            value={modeToNumber(sleepMode)}
            min={0}
            max={sleepOptions.length - 1}
            step={1}
            notchCount={sleepOptions.length}
            notchLabels={sleepNotchLabels}
            notchTicksVisible={true}
            showValue={false}
            onChange={updateMode}
            onChangeEnd={updateModeEnd}
            delay={2000}
          />
        </PanelSectionRow>
        {sleepMode == SleepMode.SUSPEND_THEN_HIBERNATE && <PanelSectionRow>
          <DropdownItem
            label={"休眠延迟"}
            description={"睡眠后多长时间进入休眠"}
            rgOptions={delayList.map((item) => {
              return {
                label: item.label,
                data: item.data,
              };
            })}
            onChange={
              (data) => {
                updateHibernateDelay(data.data);
              }
            }
            selectedOption={hibernateDelay || defaultDelay}
          />
        </PanelSectionRow>}
        {/* <PanelSectionRow>
          <ToggleField
            label={"休眠"}
            description={"开启后按下电源键会进入休眠状态, 否则是睡眠状态"}
            checked={enableHibernate}
            onChange={updateHibernate}
          />
        </PanelSectionRow> */}
        {/* <PanelSectionRow>
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
        </PanelSectionRow> */}
      </>}
    </PanelSection>
  )
}