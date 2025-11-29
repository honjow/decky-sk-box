import {
  ButtonItem,
  ConfirmModal,
  DialogButton,
  Field,
  Focusable,
  ModalRoot,
  PanelSection,
  PanelSectionRow,
  showModal,
} from "@decky/ui";
import { FC, useState, useEffect } from "react";
import { Backend, MotionPoint, Settings, HibernateReadiness, SteamUtils } from "../backend";
import { ActionButtonItem } from ".";

export const ToolComponent: FC = () => {
  const [showBootToWindows, _] = useState<boolean>(Settings.showBootToWindows);
  const [hibernateReadiness, setHibernateReadiness] = useState<HibernateReadiness | null>(null);
  const [hibernateChecking, setHibernateChecking] = useState<boolean>(false);

  useEffect(() => {
    // Load hibernate readiness on component mount
    const loadHibernateReadiness = async () => {
      setHibernateChecking(true);
      try {
        const readiness = await Backend.getHibernateReadiness();
        setHibernateReadiness(readiness);
      } catch (e) {
        console.error(`Failed to load hibernate readiness: ${e}`);
      } finally {
        setHibernateChecking(false);
      }
    };
    loadHibernateReadiness();
  }, []);

  const bootToWindows = async () => {
    // await Backend.bootToWindows();
    showModal(<BootToWinModal />);
  };

  const addSteamLibrary = async () => {
    const mountpoints = await Backend.getMountpoint();
    // log
    console.log(
      `mountpoints: ${mountpoints.map((p) => p.mountpoint).join(", ")}`
    );
    showModal(<AddSteamLibraryModal mountpoints={mountpoints} />);
  };

  const handleHibernate = async () => {
    // Recheck hibernate readiness before showing modal
    setHibernateChecking(true);
    try {
      const readiness = await Backend.getHibernateReadiness();
      setHibernateReadiness(readiness);
      
      if (!readiness.can_hibernate) {
        // If swap is insufficient but active, offer to create larger swap
        if (!readiness.checks.swap_size_ok && readiness.checks.swap_active) {
          const requiredSize = Math.ceil(readiness.info.mem_total_gb);
          showModal(
            <SwapInsufficientModal 
              currentSize={readiness.info.swap_total_gb}
              requiredSize={requiredSize}
            />
          );
          return;
        }
        
        // Other errors, show simple toast
        SteamUtils.simpleToast(`无法休眠: ${readiness.reason}`);
        return;
      }
      
      // Can hibernate, show confirmation modal
      showModal(<HibernateConfirmModal readiness={readiness} />);
    } catch (e) {
      console.error(`Failed to check hibernate readiness: ${e}`);
      SteamUtils.simpleToast(`检查失败: ${e}`);
    } finally {
      setHibernateChecking(false);
    }
  };

  const getHibernateDescription = () => {
    if (hibernateChecking) {
      return "正在检查系统状态...";
    }
    
    if (!hibernateReadiness) {
      return "加载中...";
    }
    
    let desc = hibernateReadiness.reason;
    
    // If swap is insufficient, simplify the hint (clicking will auto-guide)
    if (!hibernateReadiness.can_hibernate && !hibernateReadiness.checks.swap_size_ok && hibernateReadiness.checks.swap_active) {
      desc += "\n\n点击后会引导创建足够大小的 swap";
    } else if (!hibernateReadiness.can_hibernate && hibernateReadiness.suggestions.length > 0) {
      desc += `\n\n解决方案:\n${hibernateReadiness.suggestions.join('\n')}`;
    }
    
    return desc;
  };

  return (
    <PanelSection title={"系统工具"}>
      {showBootToWindows && (
        <PanelSectionRow>
          <ActionButtonItem onClick={bootToWindows} debugLabel="bootToWindows">
            重启到 Windows
          </ActionButtonItem>
        </PanelSectionRow>
      )}
      <PanelSectionRow>
        <ActionButtonItem
          onClick={handleHibernate}
          debugLabel="hibernate"
          disabled={hibernateChecking}
          loading={hibernateChecking}
          description={getHibernateDescription()}
        >
          立即休眠
        </ActionButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ActionButtonItem
          onClick={addSteamLibrary}
          debugLabel="addSteamLibrary"
          description="可以直接添加 Steam 游戏库, 省去切换桌面模式的步骤。主要用于添加新的空库, 现有游戏库默认情况已经会自动添加。如果发现现有库未添加, 请检查磁盘挂载以及权限是否正确"
        >
          添加 Steam 游戏库
        </ActionButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

export interface BootToWinModalProps {
  closeModal?: () => void;
}

export const BootToWinModal: FC<BootToWinModalProps> = ({ closeModal }) => {
  return (
    <ConfirmModal
      strTitle="重启到 Windows"
      strDescription="系统将重启到 Windows，确认继续吗？"
      strOKButtonText="确认"
      strCancelButtonText="取消"
      onOK={async () => {
        await Backend.bootToWindows();
        closeModal?.();
      }}
      onCancel={closeModal}
      closeModal={closeModal}
    />
  );
};

export interface AddSteamLibraryModalProps {
  closeModal?: () => void;
  mountpoints: MotionPoint[];
}

export const AddSteamLibraryModal: FC<AddSteamLibraryModalProps> = ({
  closeModal,
  mountpoints,
}) => {
  return (
    <ModalRoot closeModal={closeModal}>
      <div>
        <PanelSection title={"选择库路径"}>
          {mountpoints.map((point, index) => {
            return (
              <div key={index}>
                <PanelSectionRow>
                  <ButtonItem
                    label={point.mountpoint}
                    description={
                      point.is_added
                        ? "此路径的 SteamLibrary 已添加"
                        : undefined
                    }
                    // disabled={point.is_added}
                    onClick={() => {
                      showModal(<MountpointInfiModel mountpoint={point} />);
                    }}
                  >
                    {point.is_added ? "重新添加" : "添加"}
                  </ButtonItem>
                </PanelSectionRow>
              </div>
            );
          })}
        </PanelSection>
      </div>
    </ModalRoot>
  );
};

interface MountpointInfiModelProps {
  mountpoint: MotionPoint;
  closeModal?: () => void;
}

export const MountpointInfiModel: FC<MountpointInfiModelProps> = ({
  mountpoint,
  closeModal,
}) => {
  return (
    <ModalRoot
      closeModal={closeModal}
      onCancel={closeModal}
      onEscKeypress={closeModal}
    >
      <div>
        <PanelSection title={"挂载点信息"}>
          <PanelSectionRow>
            <Field label={"挂载点"}>{mountpoint.mountpoint}</Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field label={"设备"}>{mountpoint.path}</Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field label={"文件系统"}>{mountpoint.fstype}</Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field label={"分区空间"}>{mountpoint.fssize}</Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field label={"可用空间"}>{mountpoint.fsvail}</Field>
          </PanelSectionRow>
        </PanelSection>
      </div>
      <Focusable
        style={{
          marginBlockEnd: "-25px",
          marginBlockStart: "-5px",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "repeat(1, 1fr)",
          gridGap: "0.5rem",
          padding: "8px 0",
        }}
        children={
          <>
            <DialogButton
              onClick={async () => {
                if (await Backend.addLibraryFolder(mountpoint.mountpoint)) {
                  closeModal?.();
                }
              }}
            >
              {"确认添加"}
            </DialogButton>
            <DialogButton onClick={closeModal}> {"取消"}</DialogButton>
          </>
        }
      ></Focusable>
    </ModalRoot>
  );
};

export interface HibernateConfirmModalProps {
  closeModal?: () => void;
  readiness: HibernateReadiness;
}

export const HibernateConfirmModal: FC<HibernateConfirmModalProps> = ({
  closeModal,
  readiness,
}) => {
  const [hibernating, setHibernating] = useState<boolean>(false);

  const handleConfirm = async () => {
    setHibernating(true);
    try {
      const result = await Backend.executeHibernate();
      if (!result.success) {
        SteamUtils.simpleToast(`休眠失败: ${result.message}`);
        closeModal?.();
      }
      // If successful, system will hibernate and this code won't execute
    } catch (e) {
      console.error(`Hibernate error: ${e}`);
      SteamUtils.simpleToast(`休眠失败: ${e}`);
      closeModal?.();
    } finally {
      setHibernating(false);
    }
  };

  const description = (
    <div>
      <Field label="内存">{readiness.info.mem_total_gb} GB</Field>
      <Field label="Swap">{readiness.info.swap_total_gb} GB</Field>
      {readiness.info.resume_device && (
        <Field label="Resume 设备">
          {readiness.info.resume_device}
          {readiness.info.resume_offset && ` (offset: ${readiness.info.resume_offset})`}
        </Field>
      )}
      <div style={{ marginTop: "12px", opacity: 0.7 }}>
        系统将进入休眠状态，所有运行的程序将被保存到磁盘。确认继续吗？
      </div>
    </div>
  );

  return (
    <ConfirmModal
      strTitle="确认休眠"
      strDescription={description}
      strOKButtonText={hibernating ? "休眠中..." : "确认休眠"}
      strCancelButtonText="取消"
      onOK={handleConfirm}
      onCancel={closeModal}
      closeModal={closeModal}
      bOKDisabled={hibernating}
      bCancelDisabled={hibernating}
    />
  );
};

export interface SwapInsufficientModalProps {
  closeModal?: () => void;
  currentSize: number;
  requiredSize: number;
}

export const SwapInsufficientModal: FC<SwapInsufficientModalProps> = ({
  closeModal,
  currentSize,
  requiredSize,
}) => {
  const [creating, setCreating] = useState<boolean>(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const result = await Backend.makeSwapfileWithSize(requiredSize);
      if (result.success) {
        SteamUtils.simpleToast("Swap 创建成功，请重启系统后使用休眠功能");
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
      <div>当前 Swap: {currentSize}GB</div>
      <div>需要: {requiredSize}GB</div>
      <div style={{ marginTop: "12px", fontSize: "0.9em", opacity: 0.8 }}>
        要使用休眠功能，需要创建更大的 swap。
        <br />
        是否立即创建 {requiredSize}GB 的 swapfile？
        <br />
        <br />
        注意：
        <br />
        • 创建后需要重启系统生效
        <br />
        • 会自动配置 resume 内核参数
        <br />
        • 不会改变默认睡眠按钮的行为
      </div>
    </div>
  );

  return (
    <ConfirmModal
      strTitle="Swap 不足"
      strDescription={description}
      strOKButtonText={creating ? "创建中..." : "创建并配置"}
      strCancelButtonText="取消"
      onOK={handleCreate}
      onCancel={closeModal}
      closeModal={closeModal}
      bOKDisabled={creating}
      bCancelDisabled={creating}
    />
  );
};
