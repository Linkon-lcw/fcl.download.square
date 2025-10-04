import { useState, useEffect } from 'react';
import {
  SoftwareConfig,
  SoftwareConfigApp,
  SoftwareConfigWay,
  SoftwareConfigFile,
  DownloadWay,
} from '@/types';
import { processDownloadData, UnifiedItem } from '@/services/downloadUtils';

// 懒加载软件配置的Hook
export function useSoftwareConfig() {
  const [config, setConfig] = useState<SoftwareConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch('/software-config.json', {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        console.error('Error loading software config:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
}

// 懒加载下载线路数据的Hook
export function useDownloadWay(path: string, isExternal: boolean = false) {
  const [data, setData] = useState<DownloadWay | SoftwareConfigFile[] | null>(null);
  const [processedData, setProcessedData] = useState<UnifiedItem[] | null>(null);
  const [apiVersion, setApiVersion] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (isExternal || path.startsWith('http')) {
          // 外部链接
          response = await fetch(path);
        } else {
          // 本地文件
          response = await fetch(path);
        }
        
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status}`);
        }
        
        const jsonData = await response.json();
        setData(jsonData);
        
        // 处理数据，检测API版本并转换为统一格式
        const processed = processDownloadData(jsonData);
        setProcessedData(processed);
        
        // 检测API版本
        const version = jsonData.api_version === 2 ? 2 : 1;
        setApiVersion(version);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [path, isExternal]);

  return { data, processedData, apiVersion, loading, error, refetch: () => {} };
}