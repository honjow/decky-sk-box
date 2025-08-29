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
}

export interface FrzrConfigStructure {
  [section: string]: {
    [key: string]: FrzrConfigValue;
  };
}
