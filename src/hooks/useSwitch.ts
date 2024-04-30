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

  const [enableInputPlumber, setEnableInputPlumber] = useState(
    Settings.enableInputPlumber
  );

  const [hhdInstalled, setHHDInstalled] = useState(Settings.hhdInstalled);
  const [handyConInstalled, setHandyConInstalled] = useState(
    Settings.handyConInstalled
  );
  const [inputPlumberInstalled, setInputPlumberInstalled] = useState(
    Settings.inputPlumberInstalled
  );

  useEffect(() => {
    Settings.enableKeepBoot = enableKeepBoot;
    Settings.enableHHD = enableHHD;
    Settings.enableHandyCon = enableHandyCon;
    Settings.enableInputPlumber = enableInputPlumber;
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
    Settings.hhdInstalled = hhdInstalled;
    Settings.handyConInstalled = handyConInstalled;
    Settings.inputPlumberInstalled = inputPlumberInstalled;
  }, [
    hhdInstalled,
    handyConInstalled,
    inputPlumberInstalled,
  ]);



  useEffect(() => {
    const getDate = async () => {
      const _enableKeepBoot = await Backend.getAutoKeepBootEnabled();
      const _enableHHD = await Backend.getHHDEnabled();
      const _enableHandyCon = await Backend.getHandyConEnabled();
      const _enableInputPlumber = await Backend.getInputPlumberEnabled();
      const _enableUSBWakeup = await Backend.getUsbWakeupEnabled();
      const _enableHibernate = await Backend.getHibernateEnabled();
      const _enableFirmwareOverride =
        await Backend.getFirmwareOverrideEnabled();

      const _hhdInstalled = await Backend.hhdInstalled();
      const _handyConInstalled = await Backend.handyconInstalled();
      const _inputPlumberInstalled = await Backend.inputplumberInstalled();

      setEnableKeepBoot(_enableKeepBoot);
      setEnableHHD(_enableHHD);
      setEnableHandyCon(_enableHandyCon);
      setEnableInputPlumber(_enableInputPlumber);
      setEnableUSBWakeup(_enableUSBWakeup);
      setEnableHibernate(_enableHibernate);
      setEnableFirmwareOverride(_enableFirmwareOverride);

      setHHDInstalled(_hhdInstalled);
      setHandyConInstalled(_handyConInstalled);
      setInputPlumberInstalled(_inputPlumberInstalled);
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
      setEnableInputPlumber(false);
    }
    await Backend.setHHDEnabled(enable);
    Settings.enableHHD = enable;
    setEnableHHD(enable);
  };

  const updateHandyCon = async (enable: boolean) => {
    if (enable === true) {
      setEnableHHD(false);
      setEnableInputPlumber(false);
    }
    await Backend.setHandyConEnabled(enable);
    Settings.enableHandyCon = enable;
    setEnableHandyCon(enable);
  };

  const updateInputPlumber = async (enable: boolean) => {
    if (enable === true) {
      setEnableHHD(false);
      setEnableHandyCon(false);
    }
    await Backend.setInputPlumberEnabled(enable);
    Settings.enableInputPlumber = enable;
    setEnableInputPlumber(enable);
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
    enableInputPlumber,
    updateInputPlumber,
    enableUSBWakeup,
    updateUSBWakeup,
    enableHibernate,
    updateHibernate,
    enableFirmwareOverride,
    updateFirmwareOverride,
    hhdInstalled,
    handyConInstalled,
    inputPlumberInstalled,
  };
};
