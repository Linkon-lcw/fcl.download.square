/**
 * 下载线路处理工具模块测试文件
 */

import { detectApiVersion, processApi1Data, processApi2Data, processNestedPath, processDownloadData, UnifiedItem } from './downloadUtils';
import { SoftwareConfig, SoftwareConfigApp, SoftwareConfigWay, SoftwareConfigFile } from "@/types";

// 简单的测试函数
function test(description: string, testFn: () => void) {
  try {
    testFn();
    console.log(`✓ ${description}`);
  } catch (error) {
    console.error(`✗ ${description}`);
    console.error(error);
  }
}

// 简单的断言函数
interface ExpectResult {
  toBe: (expected: any) => ExpectResult;
  toHaveLength: (expected: number) => ExpectResult;
  toHaveProperty: (prop: string, expected?: any) => ExpectResult;
}

function expect<T>(actual: T): ExpectResult {
  const self: ExpectResult = {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
      return self;
    },
    toHaveLength: (expected: number) => {
      if (Array.isArray(actual) && actual.length !== expected) {
        throw new Error(`Expected length ${expected}, but got ${actual.length}`);
      }
      return self;
    },
    toHaveProperty: (prop: string, expected?: any) => {
      if (typeof actual === 'object' && actual !== null) {
        const value = (actual as any)[prop];
        if (value === undefined) {
          throw new Error(`Expected object to have property ${prop}`);
        }
        if (expected !== undefined && value !== expected) {
          throw new Error(`Expected property ${prop} to be ${expected}, but got ${value}`);
        }
      } else {
        throw new Error(`Expected object, but got ${typeof actual}`);
      }
      return self;
    }
  };
  
  return self;
}

// 测试套件
function describe(suiteName: string, tests: () => void) {
  console.log(`\n=== ${suiteName} ===`);
  tests();
}

// 测试API 1.0数据
const api1TestData = {
  latest: "1.0.0",
  children: [
    {
      version: "1.0.0",
      name: "v1.0.0",
      type: "directory" as const,
      children: [
        {
          version: "1.0.0",
          name: "fcl-v1.0.0-arm64-v8a.apk",
          type: "file" as const,
          download_link: "/downloads/fcl-v1.0.0-arm64-v8a.apk",
          arch: "arm64-v8a"
        },
        {
          version: "1.0.0",
          name: "fcl-v1.0.0-armeabi-v7a.apk",
          type: "file" as const,
          download_link: "/downloads/fcl-v1.0.0-armeabi-v7a.apk",
          arch: "armeabi-v7a"
        }
      ]
    }
  ]
};

// 测试API 2.0数据
const api2TestData = {
  api_version: 2,
  name: "FCL下载线路",
  url: "https://example.com/fcl/file_tree.json",
  description: "FCL官方下载线路",
  latest: "2.0.0",
  children: [
    {
      version: "2.0.0",
      name: "v2.0.0",
      type: "directory" as const,
      children: [
        {
          version: "2.0.0",
          name: "fcl-v2.0.0-arm64-v8a.apk",
          type: "file" as const,
          download_link: "/downloads/fcl-v2.0.0-arm64-v8a.apk",
          arch: "arm64-v8a"
        },
        {
          version: "2.0.0",
          // name字段省略，测试API 2.0的可选字段
          type: "file" as const,
          download_link: "/downloads/fcl-v2.0.0-armeabi-v7a.apk",
          arch: "armeabi-v7a"
        }
      ]
    }
  ]
};

// 测试嵌套路径数据
const nestedPathTestData: UnifiedItem[] = [
  {
    name: "fcl",
    type: "directory" as const,
    children: [
      {
        name: "versions",
        type: "directory" as const,
        children: [
          {
            name: "1.0.0",
            type: "directory" as const,
            children: [
              {
                name: "fcl-v1.0.0-arm64-v8a.apk",
                type: "file" as const,
                download_link: "/downloads/fcl-v1.0.0-arm64-v8a.apk",
                arch: "arm64-v8a"
              }
            ]
          }
        ]
      }
    ]
  }
];

describe('下载线路处理工具模块测试', () => {
  test('检测API版本', () => {
    expect(detectApiVersion(api1TestData)).toBe(1);
    expect(detectApiVersion(api2TestData)).toBe(2);
  });

  test('处理API 1.0数据', () => {
    const result = processApi1Data(api1TestData);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('type', 'directory');
    expect((result[0] as any).children).toHaveLength(2);
    expect((result[0] as any).children[0]).toHaveProperty('name', 'fcl-v1.0.0-arm64-v8a.apk');
  });

  test('处理API 2.0数据', () => {
    const result = processApi2Data(api2TestData);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('type', 'directory');
    expect((result[0] as any).children).toHaveLength(2);
    // 测试name字段省略的情况
    expect((result[0] as any).children[1]).toHaveProperty('name', '2.0.0');
  });

  test('处理嵌套路径', () => {
    // 测试存在的路径
    const result1 = processNestedPath(nestedPathTestData, ['fcl', 'versions']);
    expect(result1).toHaveLength(1);
    expect(result1[0]).toHaveProperty('name', '1.0.0');
    
    // 测试不存在的路径
    const result2 = processNestedPath(nestedPathTestData, ['fcl', 'nonexistent']);
    expect(result2).toHaveLength(0);
  });

  test('主处理函数', () => {
    // 测试API 1.0处理
    const result1 = processDownloadData(api1TestData);
    expect(result1).toHaveLength(1);
    expect(result1[0]).toHaveProperty('type', 'directory');
    
    // 测试API 2.0处理
    const result2 = processDownloadData(api2TestData);
    expect(result2).toHaveLength(1);
    expect(result2[0]).toHaveProperty('type', 'directory');
    
    // 测试带嵌套路径的处理
    // 构造一个适合测试嵌套路径的数据
    const nestedTestData = {
      latest: "1.0.0",
      children: [
        {
          version: "1.0.0",
          name: "fcl",
          type: "directory" as const,
          children: [
            {
              version: "1.0.0",
              name: "versions",
              type: "directory" as const,
              children: [
                {
                  version: "1.0.0",
                  name: "fcl-v1.0.0-arm64-v8a.apk",
                  type: "file" as const,
                  download_link: "/downloads/fcl-v1.0.0-arm64-v8a.apk",
                  arch: "arm64-v8a"
                }
              ]
            }
          ]
        }
      ]
    };
    
    const result3 = processDownloadData(nestedTestData, ['fcl', 'versions']);
    expect(result3).toHaveLength(1);
    expect(result3[0]).toHaveProperty('type', 'file');
  });
});