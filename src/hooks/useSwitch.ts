import { useEffect, useState } from "react";
import { Backend, Settings } from "../backend";

export const useSwitch = () => {
  const [enableKeepBoot, setEnableKeepBoot] = useState(Settings.enableKeepBoot);
  const [enableHHD, setEnableHHD] = useState(Settings.enableHHD);
  const [enableHandyCon, setEnableHandyCon] = useState(Settings.enableHandyCon);
  const [enableUSBWakeup, setEnableUSBWakeup] = useState(
    Settings.enableUSBWakeup
  );
  const [enableHibernate, setEnableHibernate] = useState(
    Settings.enableHibernate
  );
  const [enableFirmwareOverride, setEnableFirmwareOverride] = useState(
    Settings.enableFirmwareOverride
  );
  useEffect(() => {
    Settings.enableKeepBoot = enableKeepBoot;
    Settings.enableHHD = enableHHD;
    Settings.enableHandyCon = enableHandyCon;
    Settings.enableUSBWakeup = enableUSBWakeup;
    Settings.enableHibernate = enableHibernate;
    Settings.enableFirmwareOverride = enableFirmwareOverride;
  }, [
    enableKeepBoot,
    enableHHD,
    enableHandyCon,
    enableUSBWakeup,
    enableHibernate,
    enableFirmwareOverride,
  ]);

  useEffect(() => {
    const getDate = async () => {
      const _enableKeepBoot = await Backend.getAutoKeepBootEnabled();
      const _enableHHD = await Backend.getHHDEnabled();
      const _enableHandyCon = await Backend.getHandyConEnabled();
      const _enableUSBWakeup = await Backend.getUsbWakeupEnabled();
      const _enableHibernate = await Backend.getHibernateEnabled();
      const _enableFirmwareOverride =
        await Backend.getFirmwareOverrideEnabled();

      setEnableKeepBoot(_enableKeepBoot);
      setEnableHHD(_enableHHD);
      setEnableHandyCon(_enableHandyCon);
      setEnableUSBWakeup(_enableUSBWakeup);
      setEnableHibernate(_enableHibernate);
      setEnableFirmwareOverride(_enableFirmwareOverride);
    };
    getDate();
  }, []);

  const updateKeepBoot = async (enable: boolean) => {
    await Backend.setAutoKeepBootEnabled(enable);
    Settings.enableKeepBoot = enable;
    setEnableKeepBoot(enable);
  };

  const updateHHD = async (enable: boolean) => {
    if (enable === true) {
      setEnableHandyCon(false);
    }
    await Backend.setHHDEnabled(enable);
    Settings.enableHHD = enable;
    setEnableHHD(enable);
  };

  const updateHandyCon = async (enable: boolean) => {
    if (enable === true) {
      setEnableHHD(false);
    }
    await Backend.setHandyConEnabled(enable);
    Settings.enableHandyCon = enable;
    setEnableHandyCon(enable);
  };

  const updateUSBWakeup = async (enable: boolean) => {
    await Backend.setUsbWakeup(enable);
    Settings.enableUSBWakeup = enable;
    setEnableUSBWakeup(enable);
  };

  const updateHibernate = async (enable: boolean) => {
    await Backend.setHibernateEnabled(enable);
    Settings.enableHibernate = enable;
    setEnableHibernate(enable);
  };

  const updateFirmwareOverride = async (enable: boolean) => {
    await Backend.setFirmwareOverride(enable);
    Settings.enableFirmwareOverride = enable;
    setEnableFirmwareOverride(enable);
  };

  return {
    enableKeepBoot,
    updateKeepBoot,
    enableHHD,
    updateHHD,
    enableHandyCon,
    updateHandyCon,
    enableUSBWakeup,
    updateUSBWakeup,
    enableHibernate,
    updateHibernate,
    enableFirmwareOverride,
    updateFirmwareOverride,
  };
};
