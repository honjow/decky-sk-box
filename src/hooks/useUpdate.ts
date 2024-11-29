import { useEffect, useState } from "react";
import { Backend } from "../backend";
import { Settings } from "../backend";

export const useUpdate = () => {
  const [currentVersion, setCurrentVersion] = useState<string>(
    Settings.currentVersion
  );
  const [latestVersion, setLatestVersion] = useState<string>(
    Settings.latestVersion
  );

  const [addonVersion, setAddonVersion] = useState<string>(
    Settings.addonVersion
  );
  const [sktVersion, setSktVersion] = useState<string>(Settings.sktVersion);

  const [productName, setProductName] = useState<string>(Settings.productName);
  const [vendorName, setVendorName] = useState<string>(Settings.vendorName);

  useEffect(() => {
    const getData = async () => {
      const latestVersion = await Backend.getLatestVersion();
      setLatestVersion(latestVersion);
      Settings.latestVersion = latestVersion;
    };
    getData();
  });

  useEffect(() => {
    const getData = async () => {
      const version = await Backend.getVersion();
      setCurrentVersion(version);
      Settings.currentVersion = version;
    };
    getData();
  });

  useEffect(() => {
    const getData = async () => {
      const version = await Backend.getPackageVersion("sk-chos-addon");
      setAddonVersion(version);
      Settings.addonVersion = version;
    };
    getData();
  });

  useEffect(() => {
    const getData = async () => {
      const version = await Backend.getPackageVersion("sk-chos-tool");
      setSktVersion(version);
      Settings.sktVersion = version;
    };
    getData();
  });

  useEffect(() => {
    const getData = async () => {
      const productName = await Backend.getProductName();
      setProductName(productName);
      Settings.productName = productName;
    };
    getData();
  });

  useEffect(() => {
    const getData = async () => {
      const vendorName = await Backend.getVendorName();
      setVendorName(vendorName);
      Settings.vendorName = vendorName;
    };
    getData();
  });

  return { currentVersion, latestVersion, addonVersion, sktVersion, productName, vendorName };
};
