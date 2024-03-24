import { ButtonItem, Field, PanelSection, PanelSectionRow } from "decky-frontend-lib";
import { VFC } from "react";
import { Backend } from "../backend";
import { useUpdate } from "../hooks";

export const MoreComponent: VFC = () => {
    const { currentVersion, latestVersion } = useUpdate();

    let uptButtonText = "重新安装插件";

    if (currentVersion !== latestVersion && Boolean(latestVersion)) {
        uptButtonText = `更新插件到 ${latestVersion}`;
    }

    return (
        <PanelSection title="More">
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
        </PanelSection>
    )
}