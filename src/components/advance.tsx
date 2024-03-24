import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
} from "decky-frontend-lib";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { VFC, useEffect, useState } from "react";
import { Settings } from "../backend";


export const AdvanceComponent: VFC = () => {
  const [showAdvance, setShowAdvance] = useState<boolean>(Settings.showAdvance);

  useEffect(() => {
    Settings.showAdvance = showAdvance;
  }, [showAdvance]);

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
          <ButtonItem
            layout="below"
            onClick={() => { }}
          >
            修复启动项
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            description={"从预下载路径中安装Decky、Decky插件、手柄映射等。初始化Sk-ChimeraOS的一些用户配置"}
            onClick={() => { }}
          >
            重新运行首次自动配置脚本
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            description={"如果睡眠后立即唤醒, 可以尝试修复"}
            onClick={() => { }}
          >
            修复 /etc
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            description={"重启后需要重新配置网络连接等配置"}
            onClick={() => { }}
          >
            修复 /etc (完全)
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => { }}
          >
            重新创建 swapfile
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            description={"初始化 Gnome 桌面配置到默认状态"}
            onClick={() => { }}
          >
            重置 Gnome 桌面
          </ButtonItem>
        </PanelSectionRow>
      </>
      }
    </PanelSection>
  )
}