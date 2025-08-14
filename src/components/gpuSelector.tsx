import { PanelSectionRow, DropdownItem } from "@decky/ui";
import { FC, useCallback, useMemo } from "react";
import { GpuDevice } from "../backend";

interface GpuSelectorProps {
  gpuDevices: GpuDevice[];
  currentVulkanAdapter: string;
  onGpuChange: (deviceId: string) => void;
}

export const GpuSelector: FC<GpuSelectorProps> = ({
  gpuDevices,
  currentVulkanAdapter,
  onGpuChange,
}) => {
  const getVendorLabel = useCallback((vendor: string): string => {
    switch (vendor) {
      case "1002":
        return "AMD";
      case "8086":
        return "Intel";
      case "10de":
        return "NVIDIA";
      default:
        return vendor;
    }
  }, []);

  // 直接使用useMemo计算选项，避免中间状态
  const options = useMemo(() => [
    { data: "auto", label: "自动" },
    ...gpuDevices.map((gpu) => ({
      data: gpu.id,
      label: `${gpu.name} [${getVendorLabel(gpu.vendor)}]`
    }))
  ], [gpuDevices, getVendorLabel]);

  // 获取当前选择值
  const currentValue = currentVulkanAdapter || "auto";

  const handleGpuChange = useCallback((value: string) => {
    if (value === "auto") {
      onGpuChange("");
    } else {
      onGpuChange(value);
    }
  }, [onGpuChange]);

  return (
    <>
      <PanelSectionRow>
        <DropdownItem
          label="GPU选择"
          description="为 gamescope 选择要使用的GPU设备，如果要使用内置屏幕输出，请选择核显"
          selectedOption={currentValue}
          onChange={(data) => handleGpuChange(data.data)}
          rgOptions={options}
        />
      </PanelSectionRow>
    </>
  );
};
