import { ButtonItem, Field, PanelSection, PanelSectionRow } from "decky-frontend-lib";
import { VFC } from "react";
import { Backend } from "../backend";
import { useUpdate } from "../hooks";

export const MoreComponent: VFC = () => {
    const { currentVersion, latestVersion, addonVersion, sktVersion } = useUpdate();

    let uptButtonText = "重新安装插件";

    if (currentVersion !== latestVersion && Boolean(latestVersion)) {
        uptButtonText = `更新插件到 ${latestVersion}`;
    }

    return (
        <PanelSection title="更多">
            <PanelSectionRow>
                <ButtonItem
                    layout="below"
                    onClick={() => {
                        Backend.updateLatest();
                    }}
                >{uptButtonText}</ButtonItem>
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