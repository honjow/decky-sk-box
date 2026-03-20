import { useEffect, useState } from "react";
import { Backend, Settings, SteamUtils } from "../backend";
import { getVersionCache, setVersionCache, getStaleVersionCache } from "../util/versionCache";

export const useUpdate = () => {
  const [currentVersion, setCurrentVersion] = useState<string>(Settings.currentVersion);
  const [latestVersion, setLatestVersion] = useState<string>(Settings.latestVersion);
  const [addonVersion, setAddonVersion] = useState<string>(Settings.addonVersion);
  const [sktVersion, setSktVersion] = useState<string>(Settings.sktVersion);
  const [productName, setProductName] = useState<string>(Settings.productName);
  const [vendorName, setVendorName] = useState<string>(Settings.vendorName);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheckTime, setLastCheckTime] = useState<number | null>(null);

  /** Returns true when a non-empty remote latest version was received. */
  const fetchVersions = async (opts?: { userInitiated?: boolean }): Promise<boolean> => {
    try {
      const [current, latestRes] = await Promise.all([
        Backend.getVersion(),
        Backend.getLatestVersion(),
      ]);
      const trimmed = (latestRes.version || "").trim();
      setCurrentVersion(current);
      Settings.currentVersion = current;
      if (trimmed) {
        setLatestVersion(trimmed);
        Settings.latestVersion = trimmed;
        setVersionCache(current, trimmed);
        setLastCheckTime(Date.now());
        return true;
      }
      console.warn(
        `getLatestVersion empty: error=${latestRes.error} message=${latestRes.message}`
      );
      if (opts?.userInitiated) {
        const hint = (latestRes.message || "").trim();
        SteamUtils.simpleToast(
          hint || "无法获取远程版本，请检查网络后重试"
        );
      }
      return false;
    } catch (e) {
      console.error("fetchVersions error:", e);
      const stale = getStaleVersionCache();
      if (stale?.latestVersion) {
        setCurrentVersion(stale.currentVersion);
        setLatestVersion(stale.latestVersion);
        setLastCheckTime(stale.lastCheckTime);
      }
      if (opts?.userInitiated) {
        SteamUtils.simpleToast("检查更新失败，请检查网络");
      }
      return false;
    }
  };

  const checkForUpdates = async () => {
    setIsChecking(true);
    try {
      await fetchVersions({ userInitiated: true });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      // Settings.init() already fetched versions; do not let localStorage cache overwrite fresher data.
      setCurrentVersion(Settings.currentVersion);
      setLatestVersion(Settings.latestVersion);

      const cache = getVersionCache();
      if (cache) {
        setLastCheckTime(cache.lastCheckTime);
      }

      if (!Settings.latestVersion?.trim()) {
        const stale = getStaleVersionCache();
        if (stale?.latestVersion?.trim()) {
          setCurrentVersion(stale.currentVersion);
          setLatestVersion(stale.latestVersion.trim());
          setLastCheckTime(stale.lastCheckTime);
        }
        await fetchVersions();
      } else if (!getVersionCache()) {
        await fetchVersions();
      }

      const [addon, skt, product, vendor] = await Promise.all([
        Backend.getPackageVersion("sk-chos-addon"),
        Backend.getPackageVersion("sk-chos-tool"),
        Backend.getProductName(),
        Backend.getVendorName(),
      ]);
      setAddonVersion(addon);
      setSktVersion(skt);
      setProductName(product);
      setVendorName(vendor);
      Settings.addonVersion = addon;
      Settings.sktVersion = skt;
      Settings.productName = product;
      Settings.vendorName = vendor;
    };

    init();
  }, []);

  return {
    currentVersion,
    latestVersion,
    addonVersion,
    sktVersion,
    productName,
    vendorName,
    isChecking,
    lastCheckTime,
    checkForUpdates,
  };
};
