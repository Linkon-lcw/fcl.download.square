/**
 * 下载线路处理工具模块
 * 支持API 1.0和API 2.0两种格式
 * 兼容nestedPath功能
 */

// 移除未使用的导入

// API 1.0 格式接口
interface Api1Format {
  latest: string;
  children: Api1Child[];
}

interface Api1Child {
  version: string;
  name: string;
  type: 'directory' | 'file';
  download_link?: string;  // 添加文件下载链接属性
  arch?: string;           // 添加架构属性
  children?: Api1Child[];  // 修改为Api1Child[]以支持嵌套目录
}

// 移除未使用的Api1File接口

// API 2.0 格式接口
interface Api2Format {
  api_version: number;
  name?: string;
  url?: string;
  description?: string;
  latest?: string;
  children: Api2Child[];
}

interface Api2Child {
  version?: string;
  name: string;
  type: 'directory' | 'file';
  children?: Api2File[];
  download_link?: string;
  arch?: string;
}

interface Api2File {
  version?: string;
  name?: string;
  type: 'file';
  download_link: string;
  arch: string;
}

// 统一的文件结构接口
export interface UnifiedFile {
  version?: string;
  name: string;
  type: 'file';
  download_link: string;
  arch: string;
}

// 统一的目录结构接口
export interface UnifiedDirectory {
  version?: string;
  name: string;
  type: 'directory';
  children: UnifiedItem[];
}

export type UnifiedItem = UnifiedFile | UnifiedDirectory;

/**
 * 检测API版本
 * @param data 下载线路数据
 * @returns API版本号 (1 或 2)
 */
export function detectApiVersion(data: unknown): number {
  // 如果存在api_version字段且为2，则为API 2.0
  if (data && typeof data === 'object' && 'api_version' in data && (data as Record<string, unknown>).api_version === 2) {
    return 2;
  }
  // 否则默认为API 1.0
  return 1;
}

/**
 * 处理API 1.0格式数据
 * @param data API 1.0格式的下载线路数据
 * @returns 统一格式的数据
 */
export function processApi1Data(data: Api1Format): UnifiedItem[] {
  const result: UnifiedItem[] = [];
  
  // 处理根级别的children
  if (data.children && Array.isArray(data.children)) {
    for (const child of data.children) {
      if (child.type === 'file') {
        // API 1.0中根级别不应该有file类型，但为了兼容性仍处理
        result.push({
          name: child.name,
          type: 'file',
          download_link: child.download_link || '',
          arch: child.arch || ''
        });
      } else if (child.type === 'directory' && child.children) {
        // 处理目录
        const directory: UnifiedDirectory = {
          name: child.name,
          type: 'directory',
          children: []
        };
        
        // 处理目录下的子项
        for (const item of child.children) {
          if (item.type === 'file') {
            // 处理文件
            directory.children.push({
              version: item.version,
              name: item.name || '未知文件', // API 1.0中name是必需的，但为了防止数据问题提供默认值
              type: 'file',
              download_link: item.download_link || '', // 提供默认值
              arch: item.arch || '' // 提供默认值
            });
          } else if (item.type === 'directory' && item.children) {
            // 处理嵌套目录
            const nestedDirectory: UnifiedDirectory = {
              version: item.version,
              name: item.name,
              type: 'directory',
              children: []
            };
            
            // 处理嵌套目录下的文件
            for (const file of item.children) {
              if (file.type === 'file') {
                nestedDirectory.children.push({
                  version: file.version,
                  name: file.name || '未知文件',
                  type: 'file',
                  download_link: file.download_link || '', // 提供默认值
                  arch: file.arch || '' // 提供默认值
                });
              }
            }
            
            directory.children.push(nestedDirectory);
          }
        }
        
        result.push(directory);
      }
    }
  }
  
  return result;
}

/**
 * 处理API 2.0格式数据
 * @param data API 2.0格式的下载线路数据
 * @returns 统一格式的数据
 */
export function processApi2Data(data: Api2Format): UnifiedItem[] {
  const result: UnifiedItem[] = [];
  
  // 处理根级别的children
  if (data.children && Array.isArray(data.children)) {
    for (const child of data.children) {
      if (child.type === 'file') {
        // API 2.0中根级别不应该有file类型，但为了兼容性仍处理
        result.push({
          name: child.name,
          type: 'file',
          download_link: child.download_link || '',
          arch: child.arch || ''
        });
      } else if (child.type === 'directory' && child.children) {
        // 处理目录
        const directory: UnifiedDirectory = {
          version: child.version,
          name: child.name,
          type: 'directory',
          children: []
        };
        
        // 处理目录下的文件
        for (const file of child.children) {
          directory.children.push({
            version: file.version,
            name: file.name || file.version || '未知文件', // API 2.0中name可选，使用version作为备选，如果没有则使用默认值
            type: 'file',
            download_link: file.download_link,
            arch: file.arch
          });
        }
        
        result.push(directory);
      }
    }
  }
  
  return result;
}

/**
 * 处理嵌套路径
 * @param items 统一格式的数据
 * @param nestedPath 嵌套路径数组
 * @returns 处理后的数据
 */
export function processNestedPath(items: UnifiedItem[], nestedPath: string[]): UnifiedItem[] {
  // 如果没有嵌套路径，直接返回原数据
  if (!nestedPath || nestedPath.length === 0) {
    return items;
  }
  
  // 不修改原数据，使用引用进行查找
  let result: UnifiedItem[] = items;
  
  // 根据嵌套路径逐级深入
  for (const path of nestedPath) {
    let found = false;
    for (const item of result) {
      if (item.type === 'directory' && item.name === path) {
        result = item.children;
        found = true;
        break;
      }
    }
    
    // 如果在当前级别没有找到匹配的目录，返回空数组
    if (!found) {
      return [];
    }
  }
  
  return result;
}

/**
 * 主处理函数，根据API版本选择相应的处理方法
 * @param data 下载线路数据
 * @param nestedPath 嵌套路径（可选）
 * @returns 统一格式的数据
 */
export function processDownloadData(data: unknown, nestedPath?: string[]): UnifiedItem[] {
  const apiVersion = detectApiVersion(data);
  let result: UnifiedItem[];
  
  if (apiVersion === 2) {
    result = processApi2Data(data as Api2Format);
  } else {
    result = processApi1Data(data as Api1Format);
  }
  
  // 如果提供了嵌套路径，处理嵌套路径
  if (nestedPath && nestedPath.length > 0) {
    result = processNestedPath(result, nestedPath);
  }
  
  return result;
}