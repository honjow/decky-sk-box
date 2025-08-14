import { useEffect, useState } from "react";
import { Backend, Settings, GpuDevice } from "../backend";
import { SteamUtils } from "../backend/steamUtils";

export const useAdvance = () => {
    const [enableFirmwareOverride, setEnableFirmwareOverride] = useState(
        Settings.enableFirmwareOverride
    );
    const [enableUSBWakeup, setEnableUSBWakeup] = useState(
        Settings.enableUSBWakeup
    );
    const [supportUmaf, setSupportUmaf] = useState(Settings.supportUmaf);
    const [gpuDevices, setGpuDevices] = useState<GpuDevice[]>(Settings.gpuDevices);
    const [currentVulkanAdapter, setCurrentVulkanAdapter] = useState<string>(Settings.currentVulkanAdapter);

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
            const _gpuDevices = await Backend.getGpuDevices();
            const _currentVulkanAdapter = await Backend.getCurrentVulkanAdapter();

            setEnableFirmwareOverride(_enableFirmwareOverride);
            setEnableUSBWakeup(_enableUSBWakeup);
            setSupportUmaf(_supportUmaf);
            setGpuDevices(_gpuDevices);
            setCurrentVulkanAdapter(_currentVulkanAdapter);

            // 更新Settings缓存
            Settings.enableFirmwareOverride = _enableFirmwareOverride;
            Settings.enableUSBWakeup = _enableUSBWakeup;
            Settings.supportUmaf = _supportUmaf;
            Settings.gpuDevices = _gpuDevices;
            Settings.currentVulkanAdapter = _currentVulkanAdapter;
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

    const updateVulkanAdapter = async (deviceId: string) => {
        try {
            const success = await Backend.setVulkanAdapter(deviceId);
            if (success) {
                const newAdapter = deviceId || "";
                setCurrentVulkanAdapter(newAdapter);
                Settings.currentVulkanAdapter = newAdapter;
                // SteamUtils.simpleToast("GPU设置已更新");
            } else {
                SteamUtils.simpleToast("GPU设置更新失败");
            }
        } catch (e) {
            console.error(`updateVulkanAdapter error: ${e}`);
            SteamUtils.simpleToast("GPU设置更新失败");
        }
    };

    return {
        enableFirmwareOverride,
        updateFirmwareOverride,
        enableUSBWakeup,
        updateUSBWakeup,
        supportUmaf,
        gpuDevices,
        currentVulkanAdapter,
        updateVulkanAdapter,
    };
};