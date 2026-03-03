import { ButtonItem, Field, PanelSection, PanelSectionRow } from "@decky/ui";
import { Backend } from "../backend";
import { useUpdate } from "../hooks";
import { ActionButtonItem } from ".";
import { compareVersions } from "../util";
import { FC } from "react";

const getLastCheckText = (lastCheckTime: number): string => {
  const diff = Date.now() - lastCheckTime;
  if (diff < 60 * 1000) return "刚刚";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} 小时前`;
  return `${Math.floor(diff / 86400000)} 天前`;
};

export const MoreComponent: FC = () => {
  const {
    currentVersion,
    latestVersion,
    addonVersion,
    sktVersion,
    productName,
    vendorName,
    isChecking,
    lastCheckTime,
    checkForUpdates,
  } = useUpdate();

  let uptButtonText = "重新安装插件";
  if (currentVersion !== latestVersion && Boolean(latestVersion)) {
    const cmp = compareVersions(latestVersion, currentVersion);
    if (cmp > 0) {
      uptButtonText = `更新插件到 ${latestVersion}`;
    } else if (cmp < 0) {
      uptButtonText = `回滚插件到 ${latestVersion}`;
    }
  }

  return (
    <>
      <PanelSection title="更多信息">
        <PanelSectionRow>
          <ActionButtonItem
            layout="below"
            onClick={async () => {
              await Backend.updateLatest();
            }}
          >
            {uptButtonText}
          </ActionButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={checkForUpdates}
            disabled={isChecking}
            description={
              lastCheckTime
                ? `上次检查：${getLastCheckText(lastCheckTime)}`
                : "点击检查更新"
            }
          >
            {isChecking ? "检查中..." : "检查更新"}
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <Field focusable label={"当前版本"}>
            {currentVersion}
          </Field>
        </PanelSectionRow>
        {Boolean(latestVersion) && (
          <PanelSectionRow>
            <Field focusable label={"最新版本"}>
              {latestVersion}
            </Field>
          </PanelSectionRow>
        )}
        {Boolean(sktVersion) && (
          <PanelSectionRow>
            <Field focusable label={"SK Chos Tool 版本"}>
              {sktVersion}
            </Field>
          </PanelSectionRow>
        )}
        {Boolean(addonVersion) && (
          <PanelSectionRow>
            <Field focusable label={"SK Chos Addon 版本"}>
              {addonVersion}
            </Field>
          </PanelSectionRow>
        )}
      </PanelSection>
      <PanelSection title="设备">
        <PanelSectionRow>
          <Field focusable label={"产品"}>
            {productName}
          </Field>
        </PanelSectionRow>
        <PanelSectionRow>
          <Field focusable label={"供应商"}>
            {vendorName}
          </Field>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
};
