import {
  ButtonItem,
  DialogButton,
  Field,
  Focusable,
  ModalRoot,
  PanelSection,
  PanelSectionRow,
  showModal,
} from "@decky/ui";
import { FC, useState } from "react";
import { Backend, MotionPoint, Settings } from "../backend";
import { ActionButtonItem } from ".";


export const ToolComponent: FC = () => {
  const [showBootToWindows, _] = useState<boolean>(Settings.showBootToWindows);

  const bootToWindows = async () => {
    // await Backend.bootToWindows();
    showModal(<BootToWinModal />);
  }

  const addSteamLibrary = async () => {
    const mountpoints = await Backend.getMountpoint();
    // log
    console.log(`mountpoints: ${mountpoints.map((p) => p.mountpoint).join(", ")}`);
    showModal(<AddSteamLibraryModal mountpoints={mountpoints} />);
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
          description="可以直接添加 Steam 游戏库, 省去切换桌面模式的步骤, 但是不能自动排除已经添加为库的路径。主要用于添加新的空库, 现有游戏库默认情况已经会自动添加"
        > 添加 Steam 游戏库
        </ActionButtonItem>
      </PanelSectionRow>
    </PanelSection>
  )

}

export interface BootToWinModalProps {
  closeModal?: () => void;
}

export const BootToWinModal: FC<BootToWinModalProps> = ({ closeModal }) => {
  return (
    <ModalRoot closeModal={closeModal}>
      <div>
        <PanelSection title={"重启到 Windows"}>
          <PanelSectionRow>
            您确认吗?
          </PanelSectionRow>
        </PanelSection>
      </div>
      <Focusable style={{ marginBlockEnd: "-25px", marginBlockStart: "-5px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(1, 1fr)", gridGap: "0.5rem", padding: "8px 0" }}>
        <DialogButton onClick={async () => {
          await Backend.bootToWindows();
          closeModal?.();
        }}> {"确认"}</DialogButton>
        <DialogButton onClick={closeModal}> {"取消"}</DialogButton>
      </Focusable>
    </ModalRoot>
  );
}

export interface AddSteamLibraryModalProps {
  closeModal?: () => void;
  mountpoints: MotionPoint[];
}


export const AddSteamLibraryModal: FC<AddSteamLibraryModalProps> = ({ closeModal, mountpoints }) => {
  return (
    <ModalRoot closeModal={closeModal}>
      <div>
        <PanelSection title={"选择库路径"}>
          {
            mountpoints.map((point, index) => {
              return (
                <PanelSectionRow key={index}>
                  <ButtonItem
                    label={point.mountpoint}
                    onClick={() => {
                      showModal(<MountpointInfiModel mountpoint={point} />);
                    }}
                  >
                    添加
                  </ButtonItem>
                </PanelSectionRow>
              )
            })
          }
        </PanelSection>
      </div>
    </ModalRoot>
  );
}

interface MountpointInfiModelProps {
  mountpoint: MotionPoint;
  closeModal?: () => void;
}

export const MountpointInfiModel: FC<MountpointInfiModelProps> = ({ mountpoint, closeModal }) => {
  return (
    <ModalRoot closeModal={closeModal} onCancel={closeModal} onEscKeypress={closeModal}>
      <div>
        <PanelSection title={"挂载点信息"}>
          <PanelSectionRow>
            <Field label={"挂载点"}>
              {mountpoint.mountpoint}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field label={"设备"}>
              {mountpoint.path}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field label={"文件系统"}>
              {mountpoint.fstype}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field label={"分区空间"}>
              {mountpoint.fssize}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field label={"可用空间"}>
              {mountpoint.fsvail}
            </Field>
          </PanelSectionRow>
        </PanelSection>
      </div>
      <Focusable style={{ marginBlockEnd: "-25px", marginBlockStart: "-5px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(1, 1fr)", gridGap: "0.5rem", padding: "8px 0" }}>
        <DialogButton onClick={async () => {
          if (await Backend.addLibraryFolder(mountpoint.mountpoint)) {
            closeModal?.();
          }
        }}> {"确认添加"}</DialogButton>
        <DialogButton onClick={closeModal}> {"取消"}</DialogButton>
      </Focusable>
    </ModalRoot>
  );
}