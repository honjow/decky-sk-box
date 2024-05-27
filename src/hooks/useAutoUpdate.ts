import { useEffect, useState } from "react";
import { Backend, Settings } from "../backend";

export const useAutoUpdate = () => {
  const [enableAutoUpdate, setEnableAutoUpdate] = useState(
    Settings.enableAutoUpdate
  );
  const [enableAutoUpdateHandyGCCS, setEnableAutoUpdateHandyGCCS] = useState(
    Settings.enableAutoUpdateHandyGCCS
  );

  const [enableAutoUpdateHHD, setEnableAutoUpdateHHD] = useState(
    Settings.enableAutoUpdateHHD
  );
  const [enableAutoUpdateSkChosTool, setEnableAutoUpdateSkChosTool] = useState(
    Settings.enableAutoUpdateSkChosTool
  );

  useEffect(() => {
    Settings.enableAutoUpdate = enableAutoUpdate;
    Settings.enableAutoUpdateHandyGCCS = enableAutoUpdateHandyGCCS;
    Settings.enableAutoUpdateHHD = enableAutoUpdateHHD;
    Settings.enableAutoUpdateSkChosTool = enableAutoUpdateSkChosTool;
  }, [
    enableAutoUpdate,
    enableAutoUpdateHandyGCCS,
    enableAutoUpdateHHD,
    enableAutoUpdateSkChosTool,
  ]);

  useEffect(() => {
    const getDate = async () => {
      console.log("getDate auto update");
      const _enableAutoUpdate = await Backend.getEnableAutoUpdate();
      const _enableAutoUpdateHandyGCCS = await Backend.getHandyUpdateEnabled();
      const _enableAutoUpdateHHD = await Backend.getHHDUpdateEnabled();
      const _enableAutoUpdateSkChosTool = await Backend.getSktUpdateEnabled();
      setEnableAutoUpdate(_enableAutoUpdate);
      setEnableAutoUpdateHandyGCCS(_enableAutoUpdateHandyGCCS);
      setEnableAutoUpdateHHD(_enableAutoUpdateHHD);
      setEnableAutoUpdateSkChosTool(_enableAutoUpdateSkChosTool);
    };
    getDate();
  }, []);

  const updateAutoUpdate = async (val: boolean) => {
    setEnableAutoUpdate(val);
    await Backend.setEnableAutoUpdate(val);
  }

  const updateAutoUpdateHandyGCCS = async (val: boolean) => {
    setEnableAutoUpdateHandyGCCS(val);
    await Backend.setHandyUpdateEnabled(val);
  }

  const updateAutoUpdateHHD = async (val: boolean) => {
    setEnableAutoUpdateHHD(val);
    await Backend.setHhdUpdateEnabled(val);
  }

  const updateAutoUpdateSkChosTool = async (val: boolean) => {
    setEnableAutoUpdateSkChosTool(val);
    await Backend.setSktUpdateEnabled(val);
  }

  return {
    enableAutoUpdate,
    enableAutoUpdateHandyGCCS,
    enableAutoUpdateHHD,
    enableAutoUpdateSkChosTool,
    updateAutoUpdate,
    updateAutoUpdateHandyGCCS,
    updateAutoUpdateHHD,
    updateAutoUpdateSkChosTool,
  };
};
