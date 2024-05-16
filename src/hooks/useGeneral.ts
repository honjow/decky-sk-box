import { useEffect, useState } from "react";
import { Backend, Settings, SleepMode } from "../backend";

export const useGeneral = () => {
  const [enableKeepBoot, setEnableKeepBoot] = useState(Settings.enableKeepBoot);
  const [enableHHD, setEnableHHD] = useState(Settings.enableHHD);
  const [enableHandyCon, setEnableHandyCon] = useState(Settings.enableHandyCon);

  const [enableHibernate, setEnableHibernate] = useState(
    Settings.enableHibernate
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

  const [sleepMode, setSleepMode] = useState<SleepMode>(SleepMode.SUSPEND);

  useEffect(() => {
    Settings.enableKeepBoot = enableKeepBoot;
    Settings.enableHHD = enableHHD;
    Settings.enableHandyCon = enableHandyCon;
    Settings.enableInputPlumber = enableInputPlumber;
    Settings.enableHibernate = enableHibernate;
    Settings.sleepMode = sleepMode;
    Settings.hhdInstalled = hhdInstalled;
    Settings.handyConInstalled = handyConInstalled;
    Settings.inputPlumberInstalled = inputPlumberInstalled;
  }, [
    enableKeepBoot,
    enableHHD,
    enableHandyCon,
    enableHibernate,
    sleepMode,
    hhdInstalled,
    handyConInstalled,
    inputPlumberInstalled,
  ]);


  useEffect(() => {
    const getDate = async () => {
      try {
        console.log("getDate general");
        const _enableKeepBoot = await Backend.getAutoKeepBootEnabled();
        console.log(`_enableKeepBoot: ${_enableKeepBoot}`);
        const _enableHHD = await Backend.getHHDEnabled();
        console.log(`_enableHHD: ${_enableHHD}`);
        const _enableHandyCon = await Backend.getHandyConEnabled();
        console.log(`_enableHandyCon: ${_enableHandyCon}`);
        const _enableInputPlumber = await Backend.getInputPlumberEnabled();
        console.log(`_enableInputPlumber: ${_enableInputPlumber}`);
        const _enableHibernate = await Backend.getHibernateEnabled();
        console.log(`_enableHibernate: ${_enableHibernate}`);

        const _hhdInstalled = await Backend.hhdInstalled();
        const _handyConInstalled = await Backend.handyconInstalled();
        const _inputPlumberInstalled = await Backend.inputplumberInstalled();

        // const _sleepMode = await Backend.getSleepMode();

        setEnableKeepBoot(_enableKeepBoot);
        setEnableHHD(_enableHHD);
        setEnableHandyCon(_enableHandyCon);
        setEnableInputPlumber(_enableInputPlumber);
        setEnableHibernate(_enableHibernate);

        setHHDInstalled(_hhdInstalled);
        setHandyConInstalled(_handyConInstalled);
        setInputPlumberInstalled(_inputPlumberInstalled);
        // setSleepMode(_sleepMode as SleepMode || SleepMode.SUSPEND);
      } catch (e) {
        console.error(`getDate general error: ${e}`);
      }
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


  const updateHibernate = async (enable: boolean) => {
    await Backend.setHibernateEnabled(enable);
    Settings.enableHibernate = enable;
    setEnableHibernate(enable);
  };

  const updateSleepMode = async (mode: SleepMode) => {
    await Backend.setSleepMode(mode);
    Settings.sleepMode = mode;
    setSleepMode(mode);
  }

  return {
    enableKeepBoot,
    updateKeepBoot,
    enableHHD,
    updateHHD,
    enableHandyCon,
    updateHandyCon,
    enableInputPlumber,
    updateInputPlumber,
    enableHibernate,
    updateHibernate,
    hhdInstalled,
    handyConInstalled,
    inputPlumberInstalled,
    sleepMode,
    updateSleepMode,
  };
};
