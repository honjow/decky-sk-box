import { useEffect, useState } from "react";
import { Backend, Settings } from "../backend";

export const useAdvance = () => {
    const [enableFirmwareOverride, setEnableFirmwareOverride] = useState(
        Settings.enableFirmwareOverride
    );
    const [enableUSBWakeup, setEnableUSBWakeup] = useState(
        Settings.enableUSBWakeup
    );
    const [supportUmaf, setSupportUmaf] = useState(Settings.supportUmaf);

    useEffect(() => {
        Settings.enableFirmwareOverride = enableFirmwareOverride;
    }, [
        enableFirmwareOverride,
    ]);
    

    useEffect(() => {
        const getDate = async () => {
            const _enableFirmwareOverride =
                await Backend.getFirmwareOverrideEnabled();
            const _enableUSBWakeup = await Backend.getUsbWakeupEnabled();
            const _supportUmaf = await Backend.supportUmaf();

            setEnableFirmwareOverride(_enableFirmwareOverride);
            setEnableUSBWakeup(_enableUSBWakeup);
            setSupportUmaf(_supportUmaf);
        };
        getDate();
    }, []);

    const updateUSBWakeup = async (enable: boolean) => {
        await Backend.setUsbWakeup(enable);
        Settings.enableUSBWakeup = enable;
        setEnableUSBWakeup(enable);
    };


    const updateFirmwareOverride = async (enable: boolean) => {
        await Backend.setFirmwareOverride(enable);
        Settings.enableFirmwareOverride = enable;
        setEnableFirmwareOverride(enable);
    };

    return {
        enableFirmwareOverride,
        updateFirmwareOverride,
        enableUSBWakeup,
        updateUSBWakeup,
        supportUmaf,
    };
}