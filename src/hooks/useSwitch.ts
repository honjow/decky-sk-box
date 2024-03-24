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
      const _enableHHD = await Backend.getHhdEnabled();
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

  const updateKeepBoot = async (value: boolean) => {
    await Backend.setAutoKeepBootEnabled(value);
    Settings.enableKeepBoot = value;
  }

  const updateHHD = async (value: boolean) => {
    await Backend.setHhdEnabled(value);
    Settings.enableHHD = value;
    setEnableHandyCon(false);
  }

  const updateHandyCon = async (value: boolean) => {
    await Backend.setHandyConEnabled(value);
    Settings.enableHandyCon = value;
    setEnableHHD(false);
  }

  const updateUSBWakeup = async (value: boolean) => {
    await Backend.setUsbWakeup(value);
    Settings.enableUSBWakeup = value;
  }

  const updateHibernate = async (value: boolean) => {
    await Backend.setHibernateEnabled(value);
    Settings.enableHibernate = value;
  }

  const updateFirmwareOverride = async (value: boolean) => {
    await Backend.setFirmwareOverride(value);
    Settings.enableFirmwareOverride = value;
  }

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
