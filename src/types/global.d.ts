import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export interface GpuDevice {
  id: string;
  name: string;
  vendor: string;
  vendorLabel: string;
}

export interface FrzrConfigValue {
  value: boolean | string;
  type: "boolean" | "string";
  label?: string;        // 新增：显示标签
  description?: string;  // 新增：描述信息
}

export interface FrzrConfigStructure {
  [section: string]: {
    [key: string]: FrzrConfigValue;
  };
}

export interface FrzrMetadata {
  [section: string]: {
    [key: string]: {
      label?: string;
      description?: string;
    };
  };
}
