import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
} from "decky-frontend-lib";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { VFC, useEffect, useState } from "react";
import { Backend, Settings, SteamUtils } from "../backend";
import { ActionButtonItem } from ".";


export const AdvanceComponent: VFC = () => {
  const [showAdvance, setShowAdvance] = useState<boolean>(Settings.showAdvance);
  const [swapfileMaking, setSwapfileMaking] = useState<boolean>(Settings.swapfileMaking);

  useEffect(() => {
    Settings.showAdvance = showAdvance;
  }, [showAdvance]);

  useEffect(() => {
    Settings.swapfileMaking = swapfileMaking;
  }, [swapfileMaking]);

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

  const handResetGnome = async () => {
    await Backend.resetGnome();
    console.log("resetGnome done");
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
          {showAdvance ? <RiArrowDownSFill /> : <RiArrowUpSFill />}
        </ButtonItem>
      </PanelSectionRow>
      {showAdvance && <>
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
            description={"初始化 Gnome 桌面配置到默认状态"}
            onClick={handResetGnome}
            debugLabel="resetGnome"
          >
            重置 Gnome 桌面
          </ActionButtonItem>
        </PanelSectionRow>
      </>
      }
    </PanelSection>
  )
}