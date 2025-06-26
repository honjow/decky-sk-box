import {
  ButtonItem,
  DropdownItem,
  NotchLabel,
  PanelSection,
  PanelSectionRow,
  ToggleField,
} from "@decky/ui";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { FC, useEffect, useState } from "react";
import {
  Settings,
  SleepMode,
  SessionMode,
  defaultDelay,
  delayList,
} from "../backend";
import { useGeneral } from "../hooks";
import { SlowSliderField } from ".";

export const GeneralComponent: FC = () => {
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
    sessionMode,
    updateSessionMode,
    canSwitchDesktopSession,
    hibernateDelay,
    updateHibernateDelay,
  } = useGeneral();

  useEffect(() => {
    Settings.showSwitch = showSwitch;
  }, [showSwitch]);

  const sleepOptions = [
    { mode: SleepMode.SUSPEND, label: "睡眠" },
    { mode: SleepMode.HIBERNATE, label: "休眠" },
    { mode: SleepMode.SUSPEND_THEN_HIBERNATE, label: "睡眠后休眠" },
  ];

  const sleepModeToNumber = (mode: string) => {
    return sleepOptions.findIndex((option) => option.mode === mode);
  };

  const sleepNumberToMode = (number: number) => {
    return sleepOptions[number].mode || SleepMode.SUSPEND;
  };

  const sleepNotchLabels: NotchLabel[] = sleepOptions.map((option, idx) => {
    return {
      notchIndex: idx,
      label: option.label,
      value: sleepModeToNumber(option.mode),
    };
  });

  const _updateSleepMode = (mode: number) => {
    updateSleepMode(sleepNumberToMode(mode), false);
  };

  const _updateSleepModeEnd = (mode: number) => {
    updateSleepMode(sleepNumberToMode(mode));
  };

  const sessionOptions = [
    { mode: SessionMode.WAYLAND, label: "Wayland" },
    { mode: SessionMode.XORG, label: "Xorg" },
  ];

  const sessionModeToNumber = (mode: string) => {
    console.log(`sessionModeToNumber: ${mode}`);
    return sessionOptions.findIndex((option) => option.mode === mode);
  };

  const sessionNumberToMode = (number: number) => {
    console.log(`sessionNumberToMode: ${number}`);
    return sessionOptions[number].mode || SessionMode.WAYLAND;
  };

  const sessionNotchLabels: NotchLabel[] = sessionOptions.map((option, idx) => {
    console.log(`sessionNotchLabels: ${option.label}`);
    return {
      notchIndex: idx,
      label: option.label,
      value: sessionModeToNumber(option.mode),
    };
  });

  const _updateSessionMode = (mode: number) => {
    updateSessionMode(sessionNumberToMode(mode), false);
  };

  const _updateSessionModeEnd = (mode: number) => {
    updateSessionMode(sessionNumberToMode(mode));
  };

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
          {showSwitch ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
        </ButtonItem>
      </PanelSectionRow>
      {showSwitch && (
        <>
          <PanelSectionRow>
            <ToggleField
              label={"启动项守护服务"}
              description={
                "开启后, 每次启动 Sk-Chimeraos 都会将自身启动项作为下次启动项, 解决双系统启动项维持问题。最好配合 Windows 启动到 Sk-Chimeraos 的功能使用, 否则建议关闭"
              }
              checked={enableKeepBoot}
              onChange={updateKeepBoot}
            />
          </PanelSectionRow>
          {hhdInstalled && (
            <PanelSectionRow>
              <ToggleField
                label={"HHD"}
                description={
                  "Handheld Daemon, 另一个手柄驱动程序, 通过模拟 PS5 手柄支持陀螺仪和背键能等功能. 不能和 InputPlumber 同时使用. 请配合HHD Decky插件使用"
                }
                checked={enableHHD}
                onChange={updateHHD}
              />
            </PanelSectionRow>
          )}
          {handyConInstalled && (
            <PanelSectionRow>
              <ToggleField
                label={"HandyGCCS"}
                description={"用来驱动部分掌机的手柄按钮, 不能和 HHD 同时使用."}
                checked={enableHandyCon}
                onChange={updateHandyCon}
              />
            </PanelSectionRow>
          )}
          {inputPlumberInstalled && (
            <PanelSectionRow>
              <ToggleField
                label={"InputPlumber"}
                description={"奇美拉官方系统使用的控制器驱动, 不能和 HHD 同时使用."}
                checked={enableInputPlumber}
                onChange={updateInputPlumber}
              />
            </PanelSectionRow>
          )}
          <PanelSectionRow>
            <SlowSliderField
              // @ts-ignore
              label={"睡眠模式"}
              description={
                "选择睡眠模式, 睡眠是默认选择。休眠是将系统状态保存到硬盘，再关机，速度较慢。睡眠后休眠 是先睡眠，在达到设置的时间后自动休眠，但是部分设备上可能存在问题"
              }
              value={sleepModeToNumber(sleepMode)}
              min={0}
              max={sleepOptions.length - 1}
              step={1}
              notchCount={sleepOptions.length}
              notchLabels={sleepNotchLabels}
              notchTicksVisible={true}
              showValue={false}
              onChange={_updateSleepMode}
              onChangeEnd={_updateSleepModeEnd}
              delay={2000}
            />
          </PanelSectionRow>
          {sleepMode == SleepMode.SUSPEND_THEN_HIBERNATE && (
            <PanelSectionRow>
              <DropdownItem
                label={"休眠延迟"}
                description={"睡眠后多长时间进入休眠"}
                rgOptions={delayList.map((item) => {
                  return {
                    label: item.label,
                    data: item.data,
                  };
                })}
                onChange={(data) => {
                  updateHibernateDelay(data.data);
                }}
                selectedOption={hibernateDelay || defaultDelay}
              />
            </PanelSectionRow>
          )}
          {canSwitchDesktopSession && (
            <PanelSectionRow>
              <SlowSliderField
                // @ts-ignore
                label={"桌面会话"}
                description={"为支持的分支提供桌面会话切换功能, Wayland 为默认"}
                value={sessionModeToNumber(sessionMode)}
                min={0}
                max={sessionOptions.length - 1}
                step={1}
                notchCount={sessionOptions.length}
                notchLabels={sessionNotchLabels}
                notchTicksVisible={true}
                showValue={false}
                onChange={_updateSessionMode}
                onChangeEnd={_updateSessionModeEnd}
                delay={2000}
              />
            </PanelSectionRow>
          )}
        </>
      )}
    </PanelSection>
  );
};
