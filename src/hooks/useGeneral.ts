import { useEffect, useState } from "react";
import { Backend, SessionMode, Settings, SleepMode } from "../backend";
import { Logger } from "../util";

export const useGeneral = () => {
  const [enableKeepBoot, setEnableKeepBoot] = useState(Settings.enableKeepBoot);
  const [enableHHD, setEnableHHD] = useState(Settings.enableHHD);

  const [enableHibernate, setEnableHibernate] = useState(
    Settings.enableHibernate
  );

  const [hhdInstalled, setHHDInstalled] = useState(Settings.hhdInstalled);

  const [sleepMode, setSleepMode] = useState<SleepMode>(
    (Settings.sleepMode as SleepMode) || SleepMode.SUSPEND
  );
  const [hibernateDelay, setHibernateDelay] = useState<string>(
    Settings.hibernateDelay
  );

  const [sessionMode, setSessionMode] = useState<SessionMode>(
    (Settings.sessionMode as SessionMode) || SessionMode.XORG
  );

  const [canSwitchDesktopSession, setCanSwitchDesktopSession] = useState(
    Settings.canSwitchDesktopSession || false
  );

  useEffect(() => {
    Settings.enableKeepBoot = enableKeepBoot;
    Settings.enableHHD = enableHHD;
    Settings.enableHibernate = enableHibernate;
    Settings.sleepMode = sleepMode;
    Settings.hhdInstalled = hhdInstalled;
    Settings.hibernateDelay = hibernateDelay;
    Settings.sessionMode = sessionMode;
    Settings.canSwitchDesktopSession = canSwitchDesktopSession;
  }, [
    enableKeepBoot,
    enableHHD,
    enableHibernate,
    sleepMode,
    hhdInstalled,
    hibernateDelay,
    sessionMode,
    canSwitchDesktopSession,
  ]);

  useEffect(() => {
    const getDate = async () => {
      try {
        Logger.info("getDate general");
        const _enableKeepBoot = await Backend.getAutoKeepBootEnabled();
        Logger.info(`_enableKeepBoot: ${_enableKeepBoot}`);
        const _enableHHD = await Backend.getHHDEnabled();
        Logger.info(`_enableHHD: ${_enableHHD}`);
        const _enableHibernate = await Backend.getHibernateEnabled();
        Logger.info(`_enableHibernate: ${_enableHibernate}`);

        const _hhdInstalled = await Backend.hhdInstalled();

        const _sleepMode = await Backend.getSleepMode();
        const _hibernateDelay = await Backend.getHibernateDelay();
        const _sessionMode = await Backend.getDesktopSession();
        Logger.info(`>>>>> dddd _sessionMode: ${_sessionMode}`);

        const _canSwitchDesktopSession =
          await Backend.canSwitchDesktopSession();

        setEnableKeepBoot(_enableKeepBoot);
        setEnableHHD(_enableHHD);
        setEnableHibernate(_enableHibernate);

        setHHDInstalled(_hhdInstalled);
        setSleepMode((_sleepMode as SleepMode) || SleepMode.SUSPEND);
        setHibernateDelay(_hibernateDelay);
        setSessionMode((_sessionMode as SessionMode) || SessionMode.XORG);
        setCanSwitchDesktopSession(_canSwitchDesktopSession);
      } catch (e) {
        Logger.error(`getDate general error: ${e}`);
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
    Settings.enableHHD = val;
    setEnableHHD(val);
    await Backend.setHHDEnabled(val);
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
  };

  const updateHibernateDelay = async (delay: string) => {
    setHibernateDelay(delay);
    Settings.hibernateDelay = delay;
    await Backend.setHibernateDelay(delay);
  };

  const updateSessionMode = async (mode: SessionMode, sendBackend = true) => {
    setSessionMode(mode);
    if (sendBackend) {
      Settings.sessionMode = mode;
      await Backend.setDesktopSession(mode);
    }
  };

  return {
    enableKeepBoot,
    updateKeepBoot,
    enableHHD,
    updateHHD,
    enableHibernate,
    updateHibernate,
    hhdInstalled,
    sleepMode,
    updateSleepMode,
    sessionMode,
    updateSessionMode,
    canSwitchDesktopSession,
    hibernateDelay,
    updateHibernateDelay,
  };
};
