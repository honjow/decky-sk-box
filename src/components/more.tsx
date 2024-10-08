import { Field, PanelSection, PanelSectionRow } from "@decky/ui";
import { Backend } from "../backend";
import { useUpdate } from "../hooks";
import { ActionButtonItem } from ".";
import { FC } from "react";

export const MoreComponent: FC = () => {
    const { currentVersion, latestVersion, addonVersion, sktVersion } = useUpdate();

    let uptButtonText = "重新安装插件";

    if (currentVersion !== latestVersion && Boolean(latestVersion)) {
        uptButtonText = `更新插件到 ${latestVersion}`;
    }

    return (
        <PanelSection title="更多">
            <PanelSectionRow>
                <ActionButtonItem
                    layout="below"
                    onClick={async () => {
                        await Backend.updateLatest();
                    }}
                >{uptButtonText}</ActionButtonItem>
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
    )
}