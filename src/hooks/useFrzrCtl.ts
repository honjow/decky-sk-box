import { useState, useEffect } from "react";
import { Backend } from "../backend";
import { FrzrConfigStructure } from "../types/global";

// 在 hook 外部定义，组件重新挂载时不会丢失
let cachedConfigStructure: FrzrConfigStructure = {};

export const useFrzrCtl = () => {
  const [configStructure, setConfigStructure] = useState<FrzrConfigStructure>(cachedConfigStructure);

  // 加载配置结构
  const loadConfigStructure = async () => {
    // 如果缓存有数据，先显示缓存，然后静默更新
    if (Object.keys(cachedConfigStructure).length > 0) {
      setConfigStructure(cachedConfigStructure);
      
      // 静默更新到最新数据
      try {
        const structure = await Backend.getFrzrConfigStructure();
        cachedConfigStructure = structure;
        setConfigStructure(structure);
      } catch (e) {
        console.error("Failed to update frzr config structure:", e);
      }
      return;
    }
    
    // 第一次加载
    try {
      const structure = await Backend.getFrzrConfigStructure();
      cachedConfigStructure = structure;
      setConfigStructure(structure);
    } catch (e) {
      console.error("Failed to load frzr config structure:", e);
    }
  };

  // 更新配置（乐观更新）
  const updateConfig = async (section: string, key: string, value: string) => {
    // 保存旧值，用于失败时回滚
    const oldValue = configStructure[section][key];
    
    // 立即更新 UI（乐观更新）
    const newStructure = {
      ...configStructure,
      [section]: {
        ...configStructure[section],
        [key]: {
          ...configStructure[section][key],
          value: value === "true" ? true : value === "false" ? false : value,
          type: configStructure[section][key].type
        }
      }
    };
    setConfigStructure(newStructure);
    cachedConfigStructure = newStructure;
    
    // 后台同步数据
    try {
      const success = await Backend.setFrzrConfig(section, key, value);
      if (!success) {
        // 失败时回滚
        setConfigStructure(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [key]: oldValue
          }
        }));
        cachedConfigStructure = configStructure;
      }
    } catch (e) {
      console.error("Failed to update frzr config:", e);
      // 失败时回滚
      setConfigStructure(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: oldValue
        }
      }));
      cachedConfigStructure = configStructure;
    }
  };

  useEffect(() => {
    loadConfigStructure();
  }, []);

  return {
    configStructure,
    updateConfig,
    reloadConfig: loadConfigStructure
  };
};