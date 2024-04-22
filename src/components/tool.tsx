import {
    PanelSection,
    PanelSectionRow,
} from "decky-frontend-lib";
import { VFC, useState } from "react";
import { Backend, Settings } from "../backend";
import { ActionButtonItem } from ".";


export const ToolComponent: VFC = () => {
    const [showBootToWindows, _] = useState<boolean>(Settings.showBootToWindows);

    const bootToWindows = async () => {
        await Backend.bootToWindows();
    }

    return (
        <PanelSection title={"工具"}>
            {showBootToWindows && <PanelSectionRow>
                <ActionButtonItem
                    onClick={bootToWindows}
                    debugLabel="bootToWindows"
                > 重启到 Windows
                </ActionButtonItem>
            </PanelSectionRow>}
        </PanelSection>
    )

}