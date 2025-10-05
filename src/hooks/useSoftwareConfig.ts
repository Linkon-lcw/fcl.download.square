import { useState, useEffect, useMemo } from 'react';
import {
  SoftwareConfig,
  SoftwareConfigFile,
  DownloadWay,
} from '@/types';
import { processDownloadData, UnifiedItem, detectApiVersion } from '@/services/downloadUtils';

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
export function useDownloadWay(path: string, isExternal: boolean = false, nestedPath: string[] = []) {
  const [data, setData] = useState<DownloadWay | SoftwareConfigFile[] | null>(null);
  const [processedData, setProcessedData] = useState<UnifiedItem[] | null>(null);
  const [apiVersion, setApiVersion] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 使用useMemo来稳定nestedPath的引用，避免无限循环
  const stableNestedPath = useMemo(() => nestedPath, [JSON.stringify(nestedPath)]);

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
        // 只显示前10行JSON数据，避免DevTools显示过多内容
        const limitedJsonData = JSON.stringify(jsonData, null, 2).split('\n').slice(0, 10).join('\n');
        console.log('📥 原始API数据 (前10行):', limitedJsonData);
        setData(jsonData);
        
        // 处理数据，检测API版本并转换为统一格式，并应用嵌套路径
        console.log('🔍 开始处理数据，嵌套路径:', stableNestedPath);
        const processed = processDownloadData(jsonData, stableNestedPath);
        // 只显示前10行处理后的数据
        const limitedProcessedData = JSON.stringify(processed, null, 2).split('\n').slice(0, 10).join('\n');
        console.log('📤 处理后的数据 (前10行):', limitedProcessedData);
        setProcessedData(processed);
        
        // 检测API版本
        const version = detectApiVersion(jsonData);
        console.log('🔢 检测到的API版本:', version);
        setApiVersion(version);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [path, isExternal, stableNestedPath]);

  return { data, processedData, apiVersion, loading, error, refetch: () => {} };
}