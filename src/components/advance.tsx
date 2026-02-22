import {
  ButtonItem,
  ConfirmModal,
  DropdownItem,
  PanelSection,
  PanelSectionRow,
  showModal,
  ToggleField,
} from "@decky/ui";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { FC, useEffect, useState } from "react";
import { Backend, Settings, SteamUtils } from "../backend";
import { ActionButtonItem } from ".";
import { useAdvance } from "../hooks";
import { GpuSelector } from "./gpuSelector";


export const AdvanceComponent: FC = () => {
  const [showAdvance, setShowAdvance] = useState<boolean>(Settings.showAdvance);
  const [swapfileMaking, setSwapfileMaking] = useState<boolean>(Settings.swapfileMaking);

  const {
    enableFirmwareOverride,
    updateFirmwareOverride,
    enableUSBWakeup,
    updateUSBWakeup,
    supportUmaf,
    gpuDevices,
    currentVulkanAdapter,
    updateVulkanAdapter,
    currentOrientation,
    updateOrientationOverride,
    hasGnomeShell,
    enableGnomeExtensions,
    updateGnomeExtensions,
  } = useAdvance();

  useEffect(() => {
    Settings.showAdvance = showAdvance;
  }, [showAdvance]);

  useEffect(() => {
    Settings.swapfileMaking = swapfileMaking;
  }, [swapfileMaking]);

  const orientationOptions = [
    { data: "left", label: "left" },
    { data: "right", label: "right" },
    { data: "normal", label: "normal" },
    { data: "upsidedown", label: "upsidedown" },
  ];

  const handBootRepair = async () => {
    await Backend.bootRepair();
  }

  const handReFirstRun = async () => {
    await Backend.reFirstRun();
  }

  const handEtcRepair = async () => {
    await Backend.etcRepair();
    SteamUtils.simpleToast("处理完成, 请重启系统");
  }

  const handEtcRepairFull = async () => {
    await Backend.etcRepairFull();
    SteamUtils.simpleToast("处理完成, 请重启系统");
  }

  const handMakeSwapfile = async () => {
    try {
      setSwapfileMaking(true);
      await Backend.makeSwapfile();
      SteamUtils.simpleToast("重建 swapfile 完成");
    } catch (e) {
      console.error(`makeSwapfile error: ${e}`);
      SteamUtils.simpleToast(`重建 swapfile 失败: ${e}`);
    } finally {
      setSwapfileMaking(false);
    }
  }

  const handResetDconf = async () => {
    await Backend.resetDconf();
    console.log("resetDconf done");
  }

  const handBootBios = async () => {
    await Backend.bootBios();
  }

  const handBootUmaf = async () => {
    await Backend.bootUmaf();
  }

  const handCustomSwapSize = () => {
    showModal(<CustomSwapModal />);
  }

  return (
    <PanelSection title={"高级设置"}>
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
          onClick={() => setShowAdvance(!showAdvance)}
        >
          {showAdvance ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
        </ButtonItem>
      </PanelSectionRow>
      {showAdvance && <>
        {/* 显示方向覆盖设置 - 放在最前面 */}
        <PanelSectionRow>
          <ToggleField
            label={"覆盖游戏模式显示方向"}
            description={"开启后可手动指定显示方向，重启后生效"}
            checked={currentOrientation !== ""}
            onChange={async (checked) => {
              if (checked) {
                const orientation = currentOrientation || "normal";
                await updateOrientationOverride(true, orientation);
              } else {
                await updateOrientationOverride(false);
              }
            }}
          />
        </PanelSectionRow>
        {currentOrientation && (
          <PanelSectionRow>
            <DropdownItem
              label="显示方向"
              rgOptions={orientationOptions}
              selectedOption={currentOrientation}
              onChange={async (option) => {
                await updateOrientationOverride(true, option.data);
              }}
            />
          </PanelSectionRow>
        )}
        
        <GpuSelector
          gpuDevices={gpuDevices}
          currentVulkanAdapter={currentVulkanAdapter}
          onGpuChange={updateVulkanAdapter}
        />
        <PanelSectionRow>
          <ActionButtonItem
            onClick={handBootBios}
          >
            启动到 BIOS/UEFI 设置界面
          </ActionButtonItem>
        </PanelSectionRow>
        {supportUmaf && <PanelSectionRow>
          <ActionButtonItem
            description={"启动到通用 AMD BIOS/UEFI 界面"}
            onClick={handBootUmaf}
          >
            启动到 UMAF 设置界面
          </ActionButtonItem>
        </PanelSectionRow>}
        <PanelSectionRow>
          <ActionButtonItem
            onClick={handBootRepair}
          >
            修复启动项
          </ActionButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ActionButtonItem
            description={"从预下载路径中安装Decky、Decky插件、手柄映射等。初始化Sk-ChimeraOS的一些用户配置"}
            onClick={handReFirstRun}
          >
            重新运行首次自动配置脚本
          </ActionButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ActionButtonItem
            description={"如果睡眠后立即唤醒, 可以尝试修复"}
            onClick={handEtcRepair}
          >
            修复 /etc
          </ActionButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ActionButtonItem
            description={"重启后需要重新配置网络连接等配置"}
            onClick={handEtcRepairFull}
          >
            修复 /etc (完全)
          </ActionButtonItem>
        </PanelSectionRow>
        {/* <PanelSectionRow>
          <ToggleField
            label={"firmware固件覆盖"}
            description={"启用DSDT、EDID覆盖等, 用于修复和优化部分掌机的问题，切换后需要重启生效。建议开启"}
            checked={enableFirmwareOverride}
            onChange={updateFirmwareOverride}
          />
        </PanelSectionRow> */}
        {/* <PanelSectionRow>
          <ToggleField
            label={"USB唤醒"}
            checked={enableUSBWakeup}
            onChange={updateUSBWakeup}
          />
        </PanelSectionRow> */}

        <PanelSectionRow>
          <ActionButtonItem
            loading={swapfileMaking}
            onClick={handMakeSwapfile}
            debugLabel="makeSwapfile"
          > 重新创建 swapfile
          </ActionButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ActionButtonItem
            onClick={handCustomSwapSize}
            debugLabel="customSwapSize"
            description="手动指定 swapfile 大小创建，适合需要特定大小或用于休眠的场景"
          >
            自定义 Swap 大小
          </ActionButtonItem>
        </PanelSectionRow>
        {hasGnomeShell && (
          <PanelSectionRow>
            <ToggleField
              label={"GNOME 扩展"}
              description={"开启或关闭 GNOME 扩展，桌面异常时可尝试关闭"}
              checked={enableGnomeExtensions}
              onChange={updateGnomeExtensions}
            />
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <ActionButtonItem
            description={"重置 dconf 配置，可将 Gnome 桌面恢复到默认状态"}
            onClick={handResetDconf}
            debugLabel="resetDconf"
          >
            重置 dconf
          </ActionButtonItem>
        </PanelSectionRow>
      </>
      }
    </PanelSection>
  )
}

interface CustomSwapModalProps {
  closeModal?: () => void;
}

const CustomSwapModal: FC<CustomSwapModalProps> = ({ closeModal }) => {
  const [swapSize, setSwapSize] = useState<number>(32);
  const [memorySize, setMemorySize] = useState<number>(32);
  const [creating, setCreating] = useState<boolean>(false);
  
  useEffect(() => {
    const getMemory = async () => {
      try {
        const info = await Backend.getHibernateReadiness();
        if (info.info.mem_total_gb > 0) {
          const size = Math.ceil(info.info.mem_total_gb);
          setMemorySize(size);
          setSwapSize(size);
        }
      } catch (e) {
        console.error(`Failed to get memory size: ${e}`);
      }
    };
    getMemory();
  }, []);
  
  const sizeOptions = [
    { data: 4, label: "4 GB（默认）" },
    { data: 8, label: "8 GB" },
    { data: 16, label: "16 GB" },
    { data: 32, label: "32 GB" },
    { data: memorySize, label: `${memorySize} GB（匹配内存）` },
  ].filter((option, index, self) => 
    index === self.findIndex((t) => t.data === option.data)
  );
  
  const handleCreate = async () => {
    setCreating(true);
    try {
      const result = await Backend.makeSwapfileWithSize(swapSize);
      if (result.success) {
        SteamUtils.simpleToast(`创建 ${swapSize}GB swapfile 成功，请重启系统`);
        closeModal?.();
      } else {
        SteamUtils.simpleToast(`创建失败: ${result.message}`);
      }
    } catch (e) {
      SteamUtils.simpleToast(`创建失败: ${e}`);
    } finally {
      setCreating(false);
    }
  };
  
  const description = (
    <div>
      <DropdownItem
        label="选择大小"
        rgOptions={sizeOptions}
        selectedOption={swapSize}
        onChange={(option) => setSwapSize(option.data)}
      />
      <div style={{ marginTop: "12px", fontSize: "0.9em", opacity: 0.8 }}>
        • 系统内存: {memorySize}GB
        <br />
        • 休眠需要 swap ≥ 内存大小
        <br />
        • 创建后需要重启系统生效
      </div>
    </div>
  );
  
  return (
    <ConfirmModal
      strTitle="自定义 Swap 大小"
      strDescription={description}
      strOKButtonText={creating ? "创建中..." : "确认创建"}
      strCancelButtonText="取消"
      onOK={handleCreate}
      onCancel={closeModal}
      closeModal={closeModal}
      bOKDisabled={creating}
      bCancelDisabled={creating}
    />
  );
};