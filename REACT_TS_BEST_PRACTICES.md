# React & TypeScript 项目开发注意事项

基于本次ESLint错误修复经验总结，帮助团队避免常见问题

## 📋 目录
- [类型安全规范](#类型安全规范)
- [代码组织规范](#代码组织规范)
- [组件开发规范](#组件开发规范)
- [测试代码规范](#测试代码规范)
- [工具配置规范](#工具配置规范)
- [代码审查流程](#代码审查流程)

## 🛡️ 类型安全规范

### 1. 禁止使用 `any` 类型

**❌ 错误示例：**
```typescript
// 避免使用 any
const handleData = (data: any) => { ... }
const result: any = await fetchData();
```

**✅ 正确做法：**
```typescript
// 使用具体类型
interface UserData {
  id: number;
  name: string;
}

const handleData = (data: UserData) => { ... }

// 使用 unknown 进行类型安全处理
const handleUnknownData = (data: unknown) => {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return String(data);
}

// 使用泛型
const fetchData = async <T>(): Promise<T> => { ... }
```

### 2. 精确的类型定义

**❌ 错误示例：**
```typescript
// 定义未使用的参数
interface ComponentProps {
  node?: unknown; // 未使用
  className?: string;
  children?: React.ReactNode;
}
```

**✅ 正确做法：**
```typescript
// 只定义实际使用的参数
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// 使用 Pick 或 Omit 精确选择属性
type ButtonProps = Pick<HTMLButtonElement, 'onClick' | 'disabled'> & {
  variant?: 'primary' | 'secondary';
};
```

## 📁 代码组织规范

### 1. 导入管理

**❌ 错误示例：**
```typescript
// 导入未使用的接口
import { 
  SoftwareConfig, 
  SoftwareConfigApp, // 未使用
  SoftwareConfigWay, // 未使用
  DownloadWay 
} from "@/types";
```

**✅ 正确做法：**
```typescript
// 只导入需要的接口
import { DownloadWay, SoftwareConfigApp } from "@/types";

// 使用 barrel exports 管理
import type { DownloadWay, SoftwareConfig } from "@/types";
```

### 2. 文件结构组织

```
src/
├── components/          # 组件目录
│   ├── common/         # 通用组件
│   ├── forms/         # 表单组件
│   └── layout/        # 布局组件
├── hooks/              # 自定义 Hooks
├── services/           # API 服务
├── types/              # 类型定义
├── utils/              # 工具函数
└── constants/          # 常量定义
```

## 🧩 组件开发规范

### 1. Props 接口设计

**❌ 错误示例：**
```typescript
// ReactMarkdown 组件参数冗余
const CodeComponent = ({ 
  node,        // 未使用
  inline, 
  className,   // 未使用
  children, 
  ...props 
}: CodeComponentProps) => {
  return <code {...props}>{children}</code>
}
```

**✅ 正确做法：**
```typescript
// 精简参数定义
interface CodeComponentProps {
  inline?: boolean;
  children?: React.ReactNode;
}

const CodeComponent = ({ 
  inline, 
  children, 
  ...props 
}: CodeComponentProps) => {
  return <code {...props}>{children}</code>
}
```

### 2. 组件复用性

```typescript
// 创建可复用的基础组件
interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...props
}) => {
  // 组件实现
}
```

## 🧪 测试代码规范

### 1. 测试类型安全

**❌ 错误示例：**
```typescript
// 测试中随意使用 any
it('should return expected result', () => {
  const result = processData(input as any);
  expect(result).toBe(expected as any);
});
```

**✅ 正确做法：**
```typescript
// 使用正确的类型
interface TestData {
  input: string;
  expected: number;
}

it('should return expected result', () => {
  const testData: TestData = {
    input: 'test',
    expected: 42
  };
  
  const result = processData(testData.input);
  expect(result).toBe(testData.expected);
});
```

### 2. 测试数据工厂

```typescript
// 创建测试数据工厂
const createTestUser = (overrides?: Partial<User>): User => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  ...overrides
});

it('should handle user data', () => {
  const user = createTestUser({ name: 'Custom User' });
  // 测试逻辑
});
```

## ⚙️ 工具配置规范

### 1. ESLint 配置

```javascript
// eslint.config.mjs
export default [
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-expressions': 'error'
    }
  }
];
```

### 2. TypeScript 配置

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 3. 开发工具配置

**VS Code 设置 (.vscode/settings.json):**
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["typescript", "typescriptreact"]
}
```

## 🔄 代码审查流程

### 1. 预提交检查

**package.json 脚本配置：**
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "pre-commit": "npm run lint:fix && npm run type-check && npm test",
    "prepare": "husky install"
  }
}
```

### 2. Git Hooks 配置

**使用 husky + lint-staged:**
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

### 3. CI/CD 集成

**.github/workflows/ci.yml:**
```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
```

## 🚀 最佳实践总结

### 立即行动项
1. ✅ 配置严格的 ESLint 规则
2. ✅ 启用 TypeScript 严格模式
3. ✅ 设置 IDE 自动格式化
4. ✅ 配置 Git 预提交钩子

### 团队规范
1. 📝 制定编码规范文档
2. 👥 建立代码审查流程
3. 🔄 定期进行代码质量审查
4. 📊 监控代码质量指标

### 持续改进
1. 🔍 定期运行代码分析工具
2. 📚 组织技术分享和学习
3. 🛠️ 更新开发工具和配置
4. 📈 跟踪和优化开发效率

---

**记住：** 预防胜于治疗。通过严格的规范和自动化工具，可以显著减少代码质量问题，提高开发效率和代码可维护性。