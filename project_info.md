# FCL 下载站项目信息

## 网站介绍

FCL 下载站是一个为 Fold Craft Launcher (FCL) 和 Zalith Launcher (ZL) 社区搭建的现代化、高性能下载站。它由玩家社区维护，提供 FCL 和 ZL 启动器及其相关资源（如渲染器、驱动、Java 等）的快速下载。

该项目是对原有 FCL 下载站的全面升级重构。原项目基于 MDUI 框架搭建，在代码和性能方面存在提升空间，例如代码稍显陈旧、性能优化还可进一步完善等。

## 功能

*   **多线路下载**: 提供多个下载源，确保下载的稳定性和速度。
*   **智能线路选择**: 自动检测各下载线路的延迟，并选择最快的一条作为默认下载源。
*   **设备架构检测**: 自动识别用户设备的 CPU 架构，方便用户下载对应的版本。
*   **响应式设计**: 适配桌面端和移动端，提供良好的用户体验。
*   **现代化 UI**: 使用 Tailwind CSS 和 FontAwesome 构建，界面简洁美观，原生兼容深色模式和亮色模式。
*   **软件分类**: 支持多种软件分类（FCL、ZL、ZL2、渲染器、驱动）的嵌套结构。
*   **线路管理**: 支持外部线路（通过链接访问）和内部线路（本地文件）的统一管理。

## 下载线路

### Fold Craft Launcher (FCL)

1. **FCL线1** - 本地文件
   - 特点：已开学
   - 提供者：站长提供

2. **FCL线2** - 外部线路
   - 链接：https://frostlynx.work/external/fcl/file_tree.json
   - 特点：更新快
   - 提供者：哈哈66623332提供
   - 嵌套："fcl"

3. **FCL线3** - 本地文件
   - 特点：全版本
   - 提供者：fishcpy提供

4. **FCL线4** - 本地文件
   - 特点：速度快
   - 提供者：八蓝米提供

5. **FCL线5** - 外部线路
   - 链接：https://fcl.switch.api.072211.xyz/?from=foldcraftlauncher&isDev=1
   - 特点：更新快
   - 提供者：Linkong提供

6. **FCL线6** - 外部线路
   - 链接：https://bbs.xn--rhqx00c95nv9a.club/mirror.json
   - 特点：更新快
   - 提供者：广告哥提供

7. **FCL线8** - 外部线路
   - 链接：https://api.cxsjmc.cn/api/FCL/filelist.json
   - 特点：高防御
   - 提供者：LANt提供

### Zalith Launcher (ZL)

1. **ZL线1** - 本地文件
   - 提供者：站长提供

2. **ZL线3** - 本地文件
   - 提供者：fishcpy提供

### Zalith Launcher 2 (ZL2)

1. **ZL2线1** - 本地文件
   - 提供者：站长提供

2. **ZL2线2** - 外部线路
   - 链接：https://frostlynx.work/external/zl2/file_tree.json
   - 提供者：哈哈66623332提供

### 渲染器

1. **渲染器线1** - 本地文件
   - 提供者：站长提供

2. **渲染器线3** - 本地文件
   - 提供者：fishcpy提供

### 驱动

1. **驱动线1** - 本地文件
   - 提供者：站长提供

2. **驱动线8** - 本地文件
   - 提供者：MLFKWMC提供

## 文件格式

### 下载线路格式 (树状结构)

用于FCL、ZL、ZL2等启动器的下载线路数据，采用树状结构格式，每个版本api使用不同函数读取：

```json
{
  "api_version": 2,// api2.0接口，可以空缺,如果空缺就按照api1.0读取
  "name": "线路名称，api2.0接口，可以空缺",
  "url": "线路本身链接，api2.0接口，如果是api1.0可以空缺",
  "description": "线路描述，api2.0接口，可以空缺",
  "latest": "版本号，api1.0接口，必须向下兼容",// 如果是api2.0接口，默认查找最靠前的版本，api2.0修改
  "children": [
    {
      "version": "版本号，api2.0接口，如果是api1.0可以空缺",
      "name": "版本号，api1.0接口，不可以空缺，在2.0为展示名",// 如果是api1.0接口，必须有一项与latest相同
      "type": "directory",
      "children": [
        {  
          "version": "版本号，api2.0接口，如果是api1.0可以空缺",
          "name": "版本号",// api2.0接口，可以空缺 
          "type": "file",
          "download_link": "下载链接",
          "arch": "架构类型 (如 all, arm64-v8a, armeabi-v7a, x86, x86_64)"
        }
      ]
    }
  ]
}
```

### 驱动渲染器线路格式 (简单列表)

用于渲染器和驱动的下载线路数据，采用简单列表格式：

```json
[
  {
    "name": "文件名称",
    "url": "下载链接"
  }
]
```

## 配置文件

### software-config.json

该文件是整个下载站的核心配置文件，采用简化结构，按照软件→线路层次组织，移除版本分层，以支持多种软件分类的灵活管理。该配置文件包含了以下关键信息：

以下是一个完整的software-config.json配置示例，展示了上述配置结构的具体实现：

```json
{
  "//": "软件分类配置文件示例 - 基于project_info.md中的配置结构描述",
  "version": "2.1.0",
  "lastUpdated": "2025-10-02",
  "metadata": {
    "displayOrder": ["fcl", "zl", "zl2", "renderer", "driver"],
    "enabledSoftware": ["fcl", "zl", "zl2", "renderer", "driver"]
  },
  "children": [
    {
      "id": "fcl",
      "name": "Fold Craft Launcher",
      "description": "FCL启动器下载线路",
      "type": "directory",
      "children": [
        {
          "id": "F1", //必须
          "name": "FCL线1", // 必须
          "type": "file"  // 必须
          "path": "/fcl/fclDownWay1.json", //必须
          "description": "已开学", //必须
          "provider": "站长提供"
        },
        {
          "id": "F2",
          "name": "FCL线2",
          "type": "file"
          "path": "https://example.org",
          "nestedPath": ["fcl"],// 嵌套路径
          "description": "更新快",
          "provider": "哈哈66623332提供",
        },
        {
            "id": "F-other",
            "name": "FCL其他线路",
            "type": "directory"
            "children": [
                       {
            "id": "F7",
            "name": "FCL线7-已禁用", 
             "type": "file"  
             "path": "/fcl/other/example.json", 
             "description": "服务器资金不足"
              }
          ]
        }
      ]
    }
  ]
}
```

#### 作用和功能

- **统一配置管理**: 集中管理所有软件和下载线路的信息，便于维护
- **动态加载**: 网站根据此配置文件动态生成下载界面和功能
- **可视化控制**: 通过displayOrder和enabledSoftware字段控制软件的显示顺序和是否显示
- **图标映射**: 通过featureMapping和providerMapping实现在界面上显示相应图标
- **灵活扩展**: 可以通过简单地修改此配置文件添加新软件或下载线路，无需修改代码
- **加载函数选择**: 通过loadFunction字段为不同类型的线路指定不同的数据处理方式

#### 特殊处理

- **外部线路**: 配置中的path字段可以是外部API链接，用于实时获取下载文件列表
- **本地线路**: 配置中的path字段也可以是本地JSON文件路径，用于提供固定的下载文件列表
- **加载函数**: 根据线路的特点选择合适的加载函数（如loadFclDownWay或loadFileListDownWay）

