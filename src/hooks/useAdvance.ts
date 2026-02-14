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
    const [currentOrientation, setCurrentOrientation] = useState<string>(Settings.currentOrientation);
    const [hasGnomeShell, setHasGnomeShell] = useState(Settings.hasGnomeShell);
    const [enableGnomeExtensions, setEnableGnomeExtensions] = useState(Settings.enableGnomeExtensions);

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
            const _currentOrientation = await Backend.getCurrentOrientation();
            const _hasGnomeShell = await Backend.hasGnomeShell();
            const _enableGnomeExtensions = _hasGnomeShell
                ? await Backend.getGnomeExtensionsEnabled()
                : true;

            setEnableFirmwareOverride(_enableFirmwareOverride);
            setEnableUSBWakeup(_enableUSBWakeup);
            setSupportUmaf(_supportUmaf);
            setGpuDevices(_gpuDevices);
            setCurrentVulkanAdapter(_currentVulkanAdapter);
            setCurrentOrientation(_currentOrientation);
            setHasGnomeShell(_hasGnomeShell);
            setEnableGnomeExtensions(_enableGnomeExtensions);

            // 更新Settings缓存
            Settings.enableFirmwareOverride = _enableFirmwareOverride;
            Settings.enableUSBWakeup = _enableUSBWakeup;
            Settings.supportUmaf = _supportUmaf;
            Settings.gpuDevices = _gpuDevices;
            Settings.currentVulkanAdapter = _currentVulkanAdapter;
            Settings.currentOrientation = _currentOrientation;
            Settings.hasGnomeShell = _hasGnomeShell;
            Settings.enableGnomeExtensions = _enableGnomeExtensions;
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

    const updateOrientationOverride = async (enable: boolean, orientation: string = "") => {
        try {
            if (enable && orientation) {
                const success = await Backend.setOrientationOverride(orientation);
                if (success) {
                    setCurrentOrientation(orientation);
                    Settings.currentOrientation = orientation;
                }
            } else {
                const success = await Backend.setOrientationOverride("");
                if (success) {
                    setCurrentOrientation("");
                    Settings.currentOrientation = "";
                }
            }
        } catch (e) {
            console.error(`updateOrientationOverride error: ${e}`);
        }
    };

    const updateGnomeExtensions = async (enable: boolean) => {
        const success = await Backend.setGnomeExtensionsEnabled(enable);
        if (success) {
            setEnableGnomeExtensions(enable);
            Settings.enableGnomeExtensions = enable;
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
        currentOrientation,
        updateOrientationOverride,
        hasGnomeShell,
        enableGnomeExtensions,
        updateGnomeExtensions,
    };
};