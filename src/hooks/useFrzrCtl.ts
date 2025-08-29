import { useState, useEffect } from "react";
import { Backend } from "../backend";
import { FrzrConfigStructure } from "../types/global";

export const useFrzrCtl = () => {
  const [configStructure, setConfigStructure] = useState<FrzrConfigStructure>({});
  const [loading, setLoading] = useState(false);

  // 加载配置结构
  const loadConfigStructure = async () => {
    setLoading(true);
    try {
      const structure = await Backend.getFrzrConfigStructure();
      setConfigStructure(structure);
    } catch (e) {
      console.error("Failed to load frzr config structure:", e);
    } finally {
      setLoading(false);
    }
  };

  // 更新配置
  const updateConfig = async (section: string, key: string, value: string) => {
    setLoading(true);
    try {
      const success = await Backend.setFrzrConfig(section, key, value);
      if (success) {
        // 更新本地状态
        setConfigStructure(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [key]: {
              ...prev[section][key],
              value: value === "true" ? true : value === "false" ? false : value,
              type: prev[section][key].type
            }
          }
        }));
      }
    } catch (e) {
      console.error("Failed to update frzr config:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigStructure();
  }, []);

  return {
    configStructure,
    loading,
    updateConfig,
    reloadConfig: loadConfigStructure
  };
};