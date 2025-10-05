// 软件配置相关接口
export interface SoftwareConfig {
  metadata: {
    enabledSoftware: string[];
    displayOrder: string[];
  };
  children: SoftwareConfigApp[];
}

export interface SoftwareConfigApp {
  id: string;
  name: string;
  children: SoftwareConfigWay[];
}

export interface SoftwareConfigWay {
  id: string;
  name: string;
  path: string;
  provider?: string;
}

export interface SoftwareConfigFile {
  name: string;
  url: string;
}

// 下载方式相关接口
export interface DownloadWay {
  latest?: string;
  children: DownloadVersion[];
}

export interface DownloadVersion {
  name: string;
  type: string;
  children: DownloadFile[];
}

export interface DownloadFile {
  name: string;
  type: string;
  download_link: string;
  arch: string;
}

// 选择器相关接口
export interface SelectorItem {
  id: string;
  name: string;
  provider?: string;
}

// 组件通用接口
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export interface ErrorMessageProps {
  message: string;
  className?: string;
}

export interface DownloadButtonProps {
  name: string;
  downloadLink: string;
}

export interface AppSelectorProps {
  apps: SelectorItem[];
  selectedApp: string;
  onAppSelect: (appId: string) => void;
}

export interface WaySelectorProps {
  ways: SelectorItem[];
  selectedWay: string;
  onWaySelect: (wayId: string) => void;
}

export interface TreeStructureViewProps {
  appName: string;
  wayName: string;
  data: DownloadWay;
  apiVersion?: number | null;
  processedData?: unknown;
}

export interface SimpleListViewProps {
  appName: string;
  wayName: string;
  data: SoftwareConfigFile[];
}