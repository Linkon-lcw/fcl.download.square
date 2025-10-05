/**
 * 下载线路处理工具模块
 * 支持API 1.0和API 2.0两种格式
 * 兼容nestedPath功能
 */

// 移除未使用的导入

// API 1.0 格式接口 - 支持传统和新型数据结构
interface Api1Format {
  // 传统API 1.0字段
  latest?: string;
  children?: Api1Child[];
  
  // 新型API 1.0字段（线路2使用）
  name?: string;
  path?: string;
  type?: 'directory' | 'file';
  download_link?: string;
  arch?: string;
}

interface Api1Child {
  version?: string;
  name: string;
  type: 'directory' | 'file';
  download_link?: string;  // 添加文件下载链接属性
  arch?: string;           // 添加架构属性
  children?: Api1Child[];  // 修改为Api1Child[]以支持嵌套目录
  
  // 新型API 1.0字段
  path?: string;
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
  children?: Api2Child[];
  download_link?: string;
  arch?: string;
}

interface Api2File {
  version?: string;
  name: string;
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
 * 递归处理API 1.0格式的目录和文件
 * @param items API 1.0格式的子项数组
 * @returns 统一格式的数据
 */
function processApi1Items(items: Api1Child[]): UnifiedItem[] {
  const result: UnifiedItem[] = [];
  
  for (const item of items) {
    if (item.type === 'file') {
      // 处理文件
      result.push({
        version: item.version,
        name: item.name || '未知文件',
        type: 'file',
        download_link: item.download_link || '',
        arch: item.arch || ''
      });
    } else if (item.type === 'directory') {
      // 处理目录（支持无限嵌套）
      const directory: UnifiedDirectory = {
        version: item.version,
        name: item.name,
        type: 'directory',
        children: item.children ? processApi1Items(item.children) : []
      };
      result.push(directory);
    }
  }
  
  return result;
}

/**
 * 处理API 1.0格式数据
 * @param data API 1.0格式的下载线路数据
 * @returns 统一格式的数据
 */
export function processApi1Data(data: Api1Format): UnifiedItem[] {
  console.log('🔍 processApi1Data开始处理，数据结构:', {
    hasLatest: !!data.latest,
    hasChildren: !!data.children,
    hasName: !!data.name,
    hasPath: !!data.path,
    hasType: !!data.type
  });
  
  // 处理新型API 1.0格式（线路2使用）
  if (data.type === 'directory' && data.children && Array.isArray(data.children)) {
    console.log('🔄 检测到新型API 1.0格式（目录类型），处理children');
    return processApi1Items(data.children);
  }
  
  // 处理传统API 1.0格式
  if (data.children && Array.isArray(data.children)) {
    console.log('🔄 检测到传统API 1.0格式，处理children');
    return processApi1Items(data.children);
  }
  
  // 处理单个文件的新型API 1.0格式
  if (data.type === 'file') {
    console.log('🔄 检测到新型API 1.0格式（文件类型），处理单个文件');
    return [{
      version: data.latest,
      name: data.name || '未知文件',
      type: 'file',
      download_link: data.download_link || '',
      arch: data.arch || ''
    }];
  }
  
  console.log('❌ 无法识别的API 1.0格式，返回空数组');
  return [];
}

/**
 * 递归处理API 2.0格式的目录和文件
 * @param items API 2.0格式的子项数组
 * @returns 统一格式的数据
 */
function processApi2Items(items: Api2Child[]): UnifiedItem[] {
  const result: UnifiedItem[] = [];
  
  for (const item of items) {
    if (item.type === 'file') {
      // 处理文件
      result.push({
        version: item.version,
        name: item.name || item.version || '未知文件',
        type: 'file',
        download_link: item.download_link || '',
        arch: item.arch || ''
      });
    } else if (item.type === 'directory') {
      // 处理目录（支持无限嵌套）
      const directory: UnifiedDirectory = {
        version: item.version,
        name: item.name,
        type: 'directory',
        children: item.children ? processApi2Items(item.children) : []
      };
      result.push(directory);
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
  // 处理根级别的children
  if (data.children && Array.isArray(data.children)) {
    return processApi2Items(data.children);
  }
  
  return [];
}



/**
 * 处理嵌套路径
 * @param items 统一格式的数据
 * @param nestedPath 嵌套路径数组
 * @returns 处理后的数据
 */
export function processNestedPath(items: UnifiedItem[], nestedPath: string[]): UnifiedItem[] {
  console.log('🔍 processNestedPath开始，输入items数量:', items.length, '嵌套路径:', nestedPath);
  
  // 如果没有嵌套路径，直接返回原数据
  if (!nestedPath || nestedPath.length === 0) {
    console.log('📝 无嵌套路径，直接返回原数据');
    return items;
  }
  
  // 不修改原数据，使用引用进行查找
  let result: UnifiedItem[] = items;
  
  // 根据嵌套路径逐级深入
  for (const path of nestedPath) {
    console.log('🔍 查找路径:', path, '当前级别项目数:', result.length);
    let found = false;
    for (const item of result) {
      console.log('📋 检查项目:', item.name, '类型:', item.type);
      if (item.type === 'directory' && item.name === path) {
        console.log('✅ 找到匹配目录:', item.name);
        result = item.children;
        found = true;
        break;
      }
    }
    
    // 如果在当前级别没有找到匹配的目录，返回空数组
    if (!found) {
      console.log('❌ 未找到路径:', path, '返回空数组');
      return [];
    }
  }
  
  console.log('✅ processNestedPath完成，最终结果数量:', result.length);
  return result;
}

/**
 * 主处理函数，根据API版本选择相应的处理方法
 * @param data 下载线路数据
 * @param nestedPath 嵌套路径（可选）
 * @returns 统一格式的数据
 */
export function processDownloadData(data: unknown, nestedPath?: string[]): UnifiedItem[] {
  console.log('🔍 processDownloadData开始，输入数据:', typeof data);
  const apiVersion = detectApiVersion(data);
  console.log('🔢 API版本检测结果:', apiVersion);
  let result: UnifiedItem[];
  
  if (apiVersion === 2) {
    console.log('🔄 使用API 2.0处理');
    result = processApi2Data(data as Api2Format);
  } else {
    console.log('🔄 使用API 1.0处理');
    result = processApi1Data(data as Api1Format);
  }
  
  // 只显示前10行基础处理结果，避免DevTools显示过多内容
  const limitedBaseResult = JSON.stringify(result, null, 2).split('\n').slice(0, 10).join('\n');
  console.log('📊 基础处理结果 (前10行):', limitedBaseResult);
  
  // 如果提供了嵌套路径，处理嵌套路径
  if (nestedPath && nestedPath.length > 0) {
    console.log('🗂️ 开始处理嵌套路径:', nestedPath);
    result = processNestedPath(result, nestedPath);
    // 只显示前10行嵌套路径处理结果
    const limitedNestedResult = JSON.stringify(result, null, 2).split('\n').slice(0, 10).join('\n');
    console.log('📂 嵌套路径处理结果 (前10行):', limitedNestedResult);
  }
  
  // 只显示前10行最终结果
  const limitedFinalResult = JSON.stringify(result, null, 2).split('\n').slice(0, 10).join('\n');
  console.log('✅ processDownloadData完成，最终结果 (前10行):', limitedFinalResult);
  return result;
}