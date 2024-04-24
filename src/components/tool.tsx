import {
  ButtonItem,
  DialogButton,
  Field,
  Focusable,
  ModalRoot,
  PanelSection,
  PanelSectionRow,
  showModal,
} from "decky-frontend-lib";
import { VFC, useState } from "react";
import { Backend, MotionPoint, Settings } from "../backend";
import { ActionButtonItem } from ".";


export const ToolComponent: VFC = () => {
  const [showBootToWindows, _] = useState<boolean>(Settings.showBootToWindows);

  const bootToWindows = async () => {
    await Backend.bootToWindows();
  }

  const addSteamLibrary = async () => {
    const mountpoints = await Backend.getMountpoint();
    // log
    console.log(`mountpoints: ${mountpoints.map((p) => p.mountpoint).join(", ")}`);
    showModal(<AddSteamLibraryModel mountpoints={mountpoints} />);
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
          description="可以不用切换到桌面模式的 Steam 中添加, 但是不能检测已添加上的游戏库"
        > 添加 Steam 游戏库
        </ActionButtonItem>
      </PanelSectionRow>
    </PanelSection>
  )

}

export interface AddSteamLibraryModelProps {
  closeModal?: () => void;
  mountpoints: MotionPoint[];
}


export const AddSteamLibraryModel: VFC<AddSteamLibraryModelProps> = ({ closeModal, mountpoints }) => {
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

export const MountpointInfiModel: VFC<MountpointInfiModelProps> = ({ mountpoint, closeModal }) => {
  return (
    <ModalRoot closeModal={closeModal} onCancel={closeModal} onEscKeypress={closeModal}>
      <div>
        <PanelSection title={"挂载点信息"}>
          <PanelSectionRow>
            <Field focusable label={"挂载点"}>
              {mountpoint.mountpoint}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field focusable label={"设备"}>
              {mountpoint.path}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field focusable label={"文件系统"}>
              {mountpoint.fstype}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field focusable label={"容量"}>
              {mountpoint.fssize}
            </Field>
          </PanelSectionRow>
        </PanelSection>
      </div>
      <Focusable style={{ marginBlockEnd: "-25px", marginBlockStart: "-5px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(1, 1fr)", gridGap: "0.5rem", padding: "8px 0" }}>
        <DialogButton onClick={async () => {
          if (await Backend.addLibraryFolder(mountpoint.mountpoint)) {
            closeModal?.();
          }
        }}> {"确定添加"}</DialogButton>
        <DialogButton onClick={closeModal}> {"取消"}</DialogButton>
      </Focusable>
    </ModalRoot>
  );
}