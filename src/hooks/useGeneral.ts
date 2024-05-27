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

  const [sleepMode, setSleepMode] = useState<SleepMode>(Settings.sleepMode as SleepMode || SleepMode.SUSPEND);
  const [hibernateDelay, setHibernateDelay] = useState<string>(Settings.hibernateDelay);

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
    Settings.hibernateDelay = hibernateDelay;
  }, [
    enableKeepBoot,
    enableHHD,
    enableHandyCon,
    enableHibernate,
    sleepMode,
    hhdInstalled,
    handyConInstalled,
    inputPlumberInstalled,
    hibernateDelay,
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

        const _sleepMode = await Backend.getSleepMode();
        const _hibernateDelay = await Backend.getHibernateDelay();

        setEnableKeepBoot(_enableKeepBoot);
        setEnableHHD(_enableHHD);
        setEnableHandyCon(_enableHandyCon);
        setEnableInputPlumber(_enableInputPlumber);
        setEnableHibernate(_enableHibernate);

        setHHDInstalled(_hhdInstalled);
        setHandyConInstalled(_handyConInstalled);
        setInputPlumberInstalled(_inputPlumberInstalled);
        setSleepMode(_sleepMode as SleepMode || SleepMode.SUSPEND);
        setHibernateDelay(_hibernateDelay);
      } catch (e) {
        console.error(`getDate general error: ${e}`);
      }
    };
    getDate();
  }, []);

  const updateKeepBoot = async (val: boolean) => {
    await Backend.setAutoKeepBootEnabled(val);
    Settings.enableKeepBoot = val;
    setEnableKeepBoot(val);
  };

  const updateHHD = async (val: boolean) => {
    if (val === true) {
      setEnableHandyCon(false);
      setEnableInputPlumber(false);
    }
    await Backend.setHHDEnabled(val);
    Settings.enableHHD = val;
    setEnableHHD(val);
  };

  const updateHandyCon = async (val: boolean) => {
    if (val === true) {
      setEnableHHD(false);
      setEnableInputPlumber(false);
    }
    await Backend.setHandyConEnabled(val);
    Settings.enableHandyCon = val;
    setEnableHandyCon(val);
  };

  const updateInputPlumber = async (val: boolean) => {
    if (val === true) {
      setEnableHHD(false);
      setEnableHandyCon(false);
    }
    await Backend.setInputPlumberEnabled(val);
    Settings.enableInputPlumber = val;
    setEnableInputPlumber(val);
  };


  const updateHibernate = async (val: boolean) => {
    await Backend.setHibernateEnabled(val);
    Settings.enableHibernate = val;
    setEnableHibernate(val);
  };

  const updateSleepMode = async (mode: SleepMode, sendBackend = true) => {
    setSleepMode(mode);
    if (sendBackend) {
      Settings.sleepMode = mode;
      await Backend.setSleepMode(mode);
    }
  }

  const updateHibernateDelay = async (delay: string) => {
    setHibernateDelay(delay);
    Settings.hibernateDelay = delay;
    await Backend.setHibernateDelay(delay);
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
    hibernateDelay,
    updateHibernateDelay,
  };
};
