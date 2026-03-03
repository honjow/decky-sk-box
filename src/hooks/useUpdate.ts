import { useEffect, useState } from "react";
import { Backend, Settings } from "../backend";
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

  const fetchVersions = async () => {
    try {
      const [current, latest] = await Promise.all([
        Backend.getVersion(),
        Backend.getLatestVersion(),
      ]);
      setCurrentVersion(current);
      setLatestVersion(latest);
      Settings.currentVersion = current;
      Settings.latestVersion = latest;
      setVersionCache(current, latest);
      setLastCheckTime(Date.now());
    } catch (e) {
      console.error("fetchVersions error:", e);
      const stale = getStaleVersionCache();
      if (stale) {
        setCurrentVersion(stale.currentVersion);
        setLatestVersion(stale.latestVersion);
        setLastCheckTime(stale.lastCheckTime);
      }
    }
  };

  const checkForUpdates = async () => {
    setIsChecking(true);
    try {
      await fetchVersions();
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const cache = getVersionCache();
      if (cache) {
        setCurrentVersion(cache.currentVersion);
        setLatestVersion(cache.latestVersion);
        setLastCheckTime(cache.lastCheckTime);
        Settings.currentVersion = cache.currentVersion;
        Settings.latestVersion = cache.latestVersion;
      } else {
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
