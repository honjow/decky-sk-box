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
      const _enableAutoUpdateHHD = await Backend.getHhdUpdateEnabled();
      const _enableAutoUpdateSkChosTool = await Backend.getSktUpdateEnabled();
      setEnableAutoUpdate(_enableAutoUpdate);
      setEnableAutoUpdateHandyGCCS(_enableAutoUpdateHandyGCCS);
      setEnableAutoUpdateHHD(_enableAutoUpdateHHD);
      setEnableAutoUpdateSkChosTool(_enableAutoUpdateSkChosTool);
    };
    getDate();
  }, []);

  const updateAutoUpdate = async () => {
    setEnableAutoUpdate(!enableAutoUpdate);
    await Backend.setEnableAutoUpdate(!enableAutoUpdate);
  }

  const updateAutoUpdateHandyGCCS = async () => {
    setEnableAutoUpdateHandyGCCS(!enableAutoUpdateHandyGCCS);
    await Backend.setHandyUpdateEnabled(!enableAutoUpdateHandyGCCS);
  }

  const updateAutoUpdateHHD = async () => {
    setEnableAutoUpdateHHD(!enableAutoUpdateHHD);
    await Backend.setHhdUpdateEnabled(!enableAutoUpdateHHD);
  }

  const updateAutoUpdateSkChosTool = async () => {
    setEnableAutoUpdateSkChosTool(!enableAutoUpdateSkChosTool);
    await Backend.setSktUpdateEnabled(!enableAutoUpdateSkChosTool);
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
