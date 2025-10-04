"use client";

import { useState, useEffect } from "react";
import { useSoftwareConfig, useDownloadWay } from "@/hooks/useSoftwareConfig";
import { 
  SoftwareConfig, 
  SoftwareConfigApp, 
  SoftwareConfigWay, 
  DownloadWay, 
  SoftwareConfigFile 
} from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import AppSelector from "./AppSelector";
import WaySelector from "./WaySelector";
import TreeStructureView from "./TreeStructureView";
import SimpleListView from "./SimpleListView";

export default function Download() {
  const { config, loading: configLoading, error: configError } = useSoftwareConfig();
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [selectedWay, setSelectedWay] = useState<string>('');
  
  // 懒加载选中的下载线路数据
  const currentWay = config?.children
    .find(app => app.id === selectedApp)
    ?.children.find(way => way.id === selectedWay);
  
  const isExternalWay = currentWay?.path?.startsWith('http') || false;
  const { data: wayData, processedData, apiVersion, loading: wayLoading, error: wayError } = useDownloadWay(
    currentWay?.path || '', 
    isExternalWay
  );

  // 处理应用选择
  const handleAppSelect = (app: string) => {
    setSelectedApp(app);
    // 重置选择的线路
    setSelectedWay('');
  };

  // 处理线路选择
  const handleWaySelect = (way: string) => {
    setSelectedWay(way);
  };

  // 获取应用显示名称
  const getAppDisplayName = (app: string): string => {
    const appConfig = config?.children.find(a => a.id === app);
    return appConfig?.name || app;
  };

  // 获取线路显示名称
  const getWayDisplayName = (wayId: string): string => {
    const wayConfig = config?.children
      .find(app => app.id === selectedApp)
      ?.children.find(way => way.id === wayId);
    return wayConfig?.name || wayId;
  };

  // 检查是否为简单列表格式（用于驱动和渲染器）
  const isSimpleListFormat = (data: any): data is SoftwareConfigFile[] => {
    return Array.isArray(data) && data.length > 0 && data[0].name && data[0].url;
  };

  // 检查是否为树状结构格式（用于FCL、ZL、ZL2）
  const isTreeStructureFormat = (data: any): data is DownloadWay => {
    return data && data.children && Array.isArray(data.children);
  };

  // 初始化选中的应用
  useEffect(() => {
    if (config && config.metadata.enabledSoftware.length > 0 && !selectedApp) {
      setSelectedApp(config.metadata.enabledSoftware[0]);
    }
  }, [config, selectedApp]);

  if (configLoading) {
    return (
      <main className="flex flex-col justify-center items-center gap-[32px] row-start-2 min-h-[60vh]">
        <h1 className="font-bold text-4xl text-center tracking-tight">
          下载页面
        </h1>
        <LoadingSpinner size="large" message="正在加载配置..." />
      </main>
    );
  }

  if (configError) {
    return (
      <main className="flex flex-col justify-center items-center gap-[32px] row-start-2 min-h-[60vh]">
        <h1 className="font-bold text-4xl text-center tracking-tight">
          下载页面
        </h1>
        <ErrorMessage message={`配置加载失败: ${configError}`} />
      </main>
    );
  }

  // 按照displayOrder排序应用
  const sortedApps = config?.metadata.displayOrder
    .filter(appId => config.metadata.enabledSoftware.includes(appId))
    .map(appId => config.children.find(app => app.id === appId))
    .filter(Boolean) as SoftwareConfigApp[] || [];

  const currentApp = config?.children.find(app => app.id === selectedApp);

  return (
    <main className="flex flex-col justify-center items-center gap-[32px] row-start-2 p-4 min-h-[60vh]">
      <h1 className="font-bold text-4xl text-center tracking-tight">
        下载页面
      </h1>
      
      {/* 应用选择器 */}
      <AppSelector 
        apps={sortedApps.map(app => ({ id: app.id, name: app.name }))}
        selectedApp={selectedApp}
        onAppSelect={handleAppSelect}
      />

      {/* 线路选择器 */}
      {currentApp && (
        <WaySelector 
          ways={currentApp.children.map(way => ({ 
            id: way.id, 
            name: way.name,
            provider: way.provider
          }))}
          selectedWay={selectedWay}
          onWaySelect={handleWaySelect}
        />
      )}

      {/* 线路加载状态 */}
      {selectedWay && wayLoading && (
        <div className="flex flex-col justify-center items-center w-full max-w-3xl">
          <LoadingSpinner message={`正在加载 ${getWayDisplayName(selectedWay)}...`} />
        </div>
      )}

      {/* 线路加载错误 */}
      {selectedWay && wayError && (
        <div className="w-full max-w-3xl">
          <ErrorMessage message={`加载失败: ${wayError}`} />
        </div>
      )}

      {/* 下载内容 - 树状结构格式 (FCL, ZL, ZL2) */}
      {selectedWay && wayData && isTreeStructureFormat(wayData) && (
        <TreeStructureView 
          appName={getAppDisplayName(selectedApp)}
          wayName={getWayDisplayName(selectedWay)}
          data={wayData}
          apiVersion={apiVersion}
          processedData={processedData}
        />
      )}

      {/* 下载内容 - 简单列表格式 (驱动, 渲染器) */}
      {selectedWay && wayData && isSimpleListFormat(wayData) && (
        <SimpleListView 
          appName={getAppDisplayName(selectedApp)}
          wayName={getWayDisplayName(selectedWay)}
          data={wayData}
        />
      )}
    </main>
  );
}