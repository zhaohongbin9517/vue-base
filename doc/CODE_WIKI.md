# vue-base Code Wiki

> 本文档为 `vue-base` 项目的结构化代码知识库，覆盖项目整体架构、模块职责、关键类与函数、依赖关系及运行方式。
> 项目业务名称：**计量配置管理**（计量管理系统中的配置子系统前端）。

---

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术栈与依赖](#2-技术栈与依赖)
- [3. 整体架构](#3-整体架构)
- [4. 目录结构](#4-目录结构)
- [5. 核心模块职责](#5-核心模块职责)
  - [5.1 应用入口与根组件](#51-应用入口与根组件)
  - [5.2 路由层（router）](#52-路由层router)
  - [5.3 API 层（src/api）](#53-api-层srcapi)
  - [5.4 工具层（src/utils）](#54-工具层srcutils)
  - [5.5 认证与权限模块](#55-认证与权限模块)
  - [5.6 视图组件层（src/components）](#56-视图组件层srccomponents)
- [6. 关键类与函数说明](#6-关键类与函数说明)
- [7. 路由与页面映射](#7-路由与页面映射)
- [8. 数据流与认证流程](#8-数据流与认证流程)
- [9. 后端接口依赖](#9-后端接口依赖)
- [10. 项目运行方式](#10-项目运行方式)
- [11. 开发约定与注意事项](#11-开发约定与注意事项)

---

## 1. 项目概述

`vue-base` 是一个基于 **Vue 3 + Element Plus** 的单页前端应用，用于管理计量系统的各类配置，并提供用户/角色/权限管理能力。它通过 HTTP/REST 与后端服务通信（开发期通过代理转发到 `http://127.0.0.1:8267`）。

主要业务能力：

- **通用配置**：计划表结构配置、结果表结构配置（Excel 导入/导出字段映射）。
- **计量配置**：计量站一览、配置一览、修改配置（含 18 个子配置模块）。
- **Web 配置**：WebSocket 配置、显示模板配置、变更日志/模板版本等外部页面跳转。
- **导航**：跳转到其它子系统的 Web 页面（计量监控、行为树、服务控制等），并通过 URL 透传认证信息。
- **用户中心**：用户管理、密码修改、用户授权、角色管理（基于角色的访问控制 RBAC）。

---

## 2. 技术栈与依赖

| 分类 | 依赖 | 版本 | 说明 |
|---|---|---|---|
| 框架 | `vue` | ^3.2.13 | Vue 3 组合式 API |
| 路由 | `vue-router` | ^4.6.4 | Hash 模式路由 |
| UI | `element-plus` | ^2.13.2 | 组件库 |
| UI 图标 | `@element-plus/icons-vue` | ^2.3.2 | 图标包 |
| HTTP | `axios` | ^1.13.6 | 用于用户中心 `/ac`、`/login` 请求 |
| HTTP | 原生 `fetch` | - | 用于配置 `/tmms_config`、`/meter_general` 请求 |
| 加密 | `js-md5` | ^0.8.3 | 密码 MD5 加密 |
| 编辑器 | `vue3-json-editor` | ^1.1.5 | JSON 配置在线编辑 |
| 构建 | `vite` | ^5.4.0 | Vite 构建工具链（已从 Vue CLI 迁移） |
| 构建 | `@vitejs/plugin-vue` | ^5.1.4 | Vite 的 Vue SFC 支持插件 |
| Lint | `eslint` + `eslint-plugin-vue` | ^7.32 / ^8.0.3 | 代码规范 |

> 注意：项目同时存在两套 HTTP 客户端——配置接口使用原生 `fetch` 封装（`configRequest.js`），用户/登录接口使用 `axios`（`userRequest.js`）。详见 [5.3](#53-api-层srcapi)。

构建产物输出到 `dist/`，静态资源目录 `static/`，构建目标 `es2015`。项目 `package.json` 已声明 `"type": "module"`，配置文件与源码均使用 ESM。

---

## 3. 整体架构

### 3.1 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                        视图层 (components)                    │
│  MainLayout / LoginView / MenuIndex / UserMenu / 各业务页面   │
│        ConfigVue/*  (计划/结果/计量/Web 配置)                  │
│        UserCenter/* (用户/角色/授权/改密)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │ 调用
┌───────────────────────────▼─────────────────────────────────┐
│                    API 层 (src/api)                          │
│  configUtils/ (fetch 封装)   login/   userUtils/ (axios 封装) │
└───────────────────────────┬─────────────────────────────────┘
                            │ 依赖
┌───────────────────────────▼─────────────────────────────────┐
│              认证 & 权限 & 工具层 (utils + userUtils/auth)    │
│  localStorage 会话 / 权限 key / access-control / 通用工具     │
└───────────────────────────┬─────────────────────────────────┘
                            │ 走代理
┌───────────────────────────▼─────────────────────────────────┐
│            后端服务 (127.0.0.1:8267)                          │
│  /tmms_config  /meter_general  /ac  /login                   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 运行时数据流

- **会话存储**：认证 token / 用户名 / 别名 / 权限 key 全部存于 `localStorage`（见 [5.5](#55-认证与权限模块)）。
- **请求鉴权**：每次请求由请求拦截器从 `localStorage` 读取 token，自动附加 `Authorization: Bearer <token>` 头。
- **401 处理**：响应拦截器捕获 401，清除会话并跳转 `#/login`。
- **跨子系统 SSO**：`MenuIndex.handleJumpHtml` 把 token+user+alias+permissionKeys 序列化为 `authInfo` 查询参数，拼到子系统 URL 上；子系统入口 `router/index.js` 调用 `handleAuthInfoFromUrl()` 解析并写入本地会话。

---

## 4. 目录结构

```
vue-base/
├── doc/
│   ├── api.md                # 后端接口文档（配置相关）
│   └── CODE_WIKI.md          # 本文档
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── api/
│   │   ├── configUtils/      # 配置接口（fetch 封装）
│   │   │   ├── cacheData.js  #   对象关系缓存
│   │   │   ├── config.js     #   配置接口定义
│   │   │   └── configRequest.js #  fetch 基础封装
│   │   ├── login/
│   │   │   └── auth.js       # 登录 & 权限 computed
│   │   └── userUtils/        # 用户/权限接口（axios 封装）
│   │       ├── access-control.js # 权限加载与首屏路径
│   │       ├── auth.js       #   会话 & 权限 key 存取
│   │       ├── index.js      #   通用工具函数集
│   │       ├── userCenter.js #   用户中心接口
│   │       └── userRequest.js#   axios 实例与拦截器
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── ConfigVue/        # 配置业务
│   │   │   ├── MenuIndex.vue          # 配置主菜单（二级路由容器）
│   │   │   └── MenuChile/             # 配置子页面
│   │   │       ├── AllMeterConfig.vue
│   │   │       ├── AllStationConfig.vue
│   │   │       ├── BlankConfig.vue
│   │   │       ├── MeterConfig.vue    # 计量配置（聚合 18 个子模块）
│   │   │       ├── PlanConfig.vue
│   │   │       ├── ResultConfig.vue
│   │   │       ├── VueTestTemp.vue
│   │   │       ├── WebTempConfig.vue
│   │   │       ├── WebWsConfig.vue
│   │   │       ├── AllStationConfigChild/
│   │   │       │   └── AllStationConfigEdit.vue
│   │   │       └── MeterConfigChild/  # 计量配置子组件
│   │   │           ├── Common/SaveConfigButton.vue
│   │   │           ├── MeterConfigAddConfig.vue
│   │   │           ├── MeterConfigChangeParamSetting.vue
│   │   │           ├── MeterConfigCheckMmanualStatusSetting.vue
│   │   │           ├── MeterConfigCheckResultSetting.vue
│   │   │           ├── MeterConfigDeviceStatusSetting.vue
│   │   │           ├── MeterConfigEmphasisPlanSetting.vue
│   │   │           ├── MeterConfigExtendConfigSetting.vue
│   │   │           ├── MeterConfigInitDeviceSetting.vue
│   │   │           ├── MeterConfigLongRangeSetting.vue
│   │   │           ├── MeterConfigLoopMeterSetting.vue
│   │   │           ├── MeterConfigMeterTongDaoSetting.vue
│   │   │           ├── MeterConfigPlanSetting.vue
│   │   │           ├── MeterConfigResultSetting.vue
│   │   │           └── MeterConfigStartStopSetting.vue
│   │   ├── UserCenter/      # 用户中心
│   │   │   ├── UserMenu.vue
│   │   │   └── MenuChile/
│   │   │       ├── UserAuth.vue
│   │   │       ├── UserChangePassword.vue
│   │   │       ├── UserManager.vue
│   │   │       └── UserRoles.vue
│   │   ├── ForbiddenView.vue
│   │   ├── LoginView.vue
│   │   └── MainLayout.vue
│   ├── router/
│   │   └── index.js          # 路由表（含 URL authInfo 解析）
│   ├── utils/
│   │   ├── authInfoProcessor.js # URL authInfo 解析
│   │   └── permission-utils.js  # 权限树工具
│   ├── App.vue               # 根组件（仅 router-view）
│   ├── main.js               # 入口（挂载 ElementPlus / router）
│   └── styles.css            # 全局样式
├── babel.config.js（已移除）
├── jsconfig.json             # @ -> src 路径别名（target: esnext）
├── vite.config.js            # Vite 配置（alias/devServer 代理/build）
├── index.html                # Vite 入口 HTML（根目录，引用 /src/main.js）
├── package.json              # type: module
└── README.md
```

---

## 5. 核心模块职责

### 5.1 应用入口与根组件

#### [src/main.js](file:///d:/work/vue/vue-base/src/main.js)

- 创建 Vue 应用实例，注册 `ElementPlus` 与 `router`。
- 重写 `console.warn`，统一屏蔽 Element Plus 的弃用警告（当前实现为全局静默 warn）。
- 挂载到 `#app`。

#### [src/App.vue](file:///d:/work/vue/vue-base/src/App.vue)

- 根组件，仅包含一个 `<router-view />`，所有页面通过路由切换。
- 定义全局基础样式（字体、reset）。

### 5.2 路由层（router）

#### [src/router/index.js](file:///d:/work/vue/vue-base/src/router/index.js)

- **历史模式**：`createWebHashHistory()`（Hash 路由）。
- **入口预处理**：模块加载时同步调用 `handleAuthInfoFromUrl()`，从 URL `?authInfo=` 解析跨子系统透传的会话信息写入 `localStorage`，并清除 URL 中的参数。
- **路由结构**（嵌套两级 `router-view`）：

  - `/login` → 登录页（独立，无布局）。
  - `/` → `MainLayout`（顶部栏 + 内容区），默认重定向 `/config`：
    - `/403` → 无权限页。
    - `/config` → `MenuIndex`（左侧菜单 + 内容区），默认重定向 `/config/plan`，含计划/结果/计量/计量站一览/配置一览/Web 配置等子路由。
    - `/custom-submenu` → `MenuIndex`（复用），导航子菜单（占位用 `BlankConfig`，实际跳转外部页面）。
    - `/user-center` → `UserMenu`（左侧菜单），含用户管理/改密/授权/角色。

> 注意：路由未使用全局守卫做鉴权，鉴权由各页面/菜单项通过 `hasAuthPermission` 控制可见性，并由登录后 `getFirstAuthorizedPath()` 决定首屏跳转目标。

### 5.3 API 层（src/api）

项目存在两套并行的 HTTP 客户端：

#### (1) 配置接口 —— `src/api/configUtils/`（基于 fetch）

| 文件 | 职责 |
|---|---|
| [configRequest.js](file:///d:/work/vue/vue-base/src/api/configUtils/configRequest.js) | 基于 `fetch` 的 `request` 基础函数；导出 `get/post/put/del` 及默认 `request`。自动注入 `Authorization`、解析 `{code,data,message}` 结构、401 跳登录。 |
| [config.js](file:///d:/work/vue/vue-base/src/api/configUtils/config.js) | 配置业务接口集合（`getTmmsConfig`、`getAllTableName`、`getTableColumn`、`updateTmmsConfigPlan/Result`、`getAllMeterConfig`、`updateMeterConfig`、`deleteMeterConfig`、`getWebWsConfig`、`getWebTempConfig` 等）。 |
| [cacheData.js](file:///d:/work/vue/vue-base/src/api/configUtils/cacheData.js) | 对象关系映射（`objectId_objectType` → `objectName/objectType`）的内存 Map + `localStorage` 缓存（10 分钟过期），用于把 stationId 翻译为可读站名。 |

#### (2) 用户/登录接口 —— `src/api/userUtils/` + `src/api/login/`（基于 axios）

| 文件 | 职责 |
|---|---|
| [userRequest.js](file:///d:/work/vue/vue-base/src/api/userUtils/userRequest.js) | `axios` 实例；请求拦截器把 POST 普通对象转为 `x-www-form-urlencoded`，并注入 `Authorization`（登录请求除外）；响应拦截器统一 `ElMessage` 报错、401 清会话跳登录。 |
| [userCenter.js](file:///d:/work/vue/vue-base/src/api/userUtils/userCenter.js) | 用户中心接口集合（`acGetAllUsers`、`acAddUser`、`acDelUser`、`acResetPasswd`、`acGetAllRoles`、`acGetFeatures`、`acGetUserAccess`、`acGetRoleAccess`、`acSetUserRole`、`acBatchGrantRole`、`acDeleteRole`、`acUpdatePasswd` 等）。 |
| [login/auth.js](file:///d:/work/vue/vue-base/src/api/login/auth.js) | `loginByPassword`（MD5 加密后 POST `/login`）、`getAuthPermission`（返回权限 computed ref）。 |

> **差异点提醒**：fetch 路径返回 `{code,data,message}`，拦截器只对 `code !== 0` 抛错并返回 `data`；axios 路径直接返回整个 `response.data`（含 `result/content` 字段），由业务层自行判断 `result === 'ok'`。

### 5.4 工具层（src/utils）

| 文件 | 职责 |
|---|---|
| [authInfoProcessor.js](file:///d:/work/vue/vue-base/src/utils/authInfoProcessor.js) | 解析 URL 中的 `authInfo` 查询参数（跨子系统 SSO 透传），写入会话与权限 key，并清除 URL 参数。导出 `processAuthInfoFromUrl` / `removeAuthInfoFromUrl` / `handleAuthInfoFromUrl`。 |
| [permission-utils.js](file:///d:/work/vue/vue-base/src/utils/permission-utils.js) | 权限树相关纯函数：`treeProps`（el-tree 配置）、`isOkResult`、`asArray`、`deepClone`、`accessItemsToCheckedKeys`（把后端 access 列表转为 el-tree 勾选 key `resource:action`）、`buildPermissionPayload`（把勾选 key 反向序列化为提交 payload）。 |

> 另有 `src/api/userUtils/index.js` 是一套通用工具函数集（`parseTime`、`formatTime`、`getQueryObject`、`debounce`、`deepClone`、`uniqueArr` 等，源自 PanJiaChen 模板），供 `authInfoProcessor` 等使用。

### 5.5 认证与权限模块

集中位于 [src/api/userUtils/auth.js](file:///d:/work/vue/vue-base/src/api/userUtils/auth.js) 与 [access-control.js](file:///d:/work/vue/vue-base/src/api/userUtils/access-control.js)。

**localStorage Key 约定**：

| Key | 内容 |
|---|---|
| `auth_token` | 登录 token（含或不含 `Bearer ` 前缀，请求拦截器统一补齐） |
| `auth_user` | 用户名 |
| `auth_alias` | 用户别名（用于显示） |
| `auth_permission_keys` | 权限 key 数组（JSON 字符串，形如 `["config:read","config:write","user_manage:read",...]`） |
| `remember_user` / `remember_flag` | 记住账号 |

**核心函数**：

- `setAuthSession` / `clearAuthSession` / `hasAuthSession` / `getDisplayName`
- `getAuthPermissionKeys` / `setAuthPermissionKeys`
- `hasAuthPermission(key)` / `hasAnyAuthPermission(keys)`
- `setRememberedUser` / `getRememberedUser`

**权限加载**（`access-control.js`）：

- `refreshAuthPermissions(force)`：调用 `acGetUserAccess`，把后端返回的 `{resource, access:[action]}` 列表归一化为 `resource:action` 形式存入 localStorage；带内存 Promise 防重入；`force=false` 且已有缓存时直接复用。
- `getFirstAuthorizedPath()`：根据权限决定登录后首屏路径——有 `license:read` → `/config/blank`；否则有 `user_manage:read` → `/user-center/users`；否则 → `/403`。

**权限 Key 规约**（业务使用）：

| Key | 含义 |
|---|---|
| `config:read` / `config:write` | 配置业务读/写 |
| `user_manage:read` / `user_manage:write` | 用户管理读/写 |
| `role:read` / `role:write` | 角色管理读/写 |
| `auth:read` / `auth:write` | 授权管理读/写 |
| `license:read` | 授权信息浏览权限（决定首屏） |

### 5.6 视图组件层（src/components）

#### 5.6.1 通用视图

| 组件 | 路径 | 职责 |
|---|---|---|
| `MainLayout` | [MainLayout.vue](file:///d:/work/vue/vue-base/src/components/MainLayout.vue) | 全局顶部栏：Logo + 标题 + 用户下拉菜单（用户管理入口、退出登录）；承载二级 `<router-view>`。 |
| `LoginView` | [LoginView.vue](file:///d:/work/vue/vue-base/src/components/LoginView.vue) | 登录页：账号密码表单、记住账号、登录后 `refreshAuthPermissions(true)` 并按 `getFirstAuthorizedPath()` 跳转；已登录用户直接跳首屏。 |
| `ForbiddenView` | [ForbiddenView.vue](file:///d:/work/vue/vue-base/src/components/ForbiddenView.vue) | 403 无权限页，提供"返回可访问页面"按钮。 |

#### 5.6.2 配置业务（ConfigVue）

| 组件 | 职责 |
|---|---|
| `MenuIndex` ([MenuIndex.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuIndex.vue)) | 配置主菜单容器。左侧 `el-menu` 分四组：通用配置 / 计量配置 / web配置 / 导航。加载 `getWebPort` 获取各子系统端口；`handleJumpHtml` 负责拼接认证信息并 `window.open` 跳转外部子系统。 |
| `PlanConfig` ([PlanConfig.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/PlanConfig.vue)) | 计划配置：选择计划表名、配置基础导入项（station_id/mainfold_num/date）、可选导入项（dbField/excelHeader/dataType/步长/区间校验），保存至 `updateTmmsConfigPlan`。 |
| `ResultConfig` ([ResultConfig.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/ResultConfig.vue)) | 结果配置：选择结果表名、配置导出列（dbField↔excelHeader 映射，支持上移/下移/删除），保存至 `updateTmmsConfigResult`。 |
| `MeterConfig` ([MeterConfig.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/MeterConfig.vue)) | **核心页面**：计量配置编辑器。聚合 18 个子配置模块（见 5.6.3），负责配置选择/新增/重置/保存，子模块数据通过 `initConfig()` 装配、通过 `updateConfig(name)` 回写 `baseData.config`。含快速导航锚点跳转。 |
| `AllMeterConfig` ([AllMeterConfig.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/AllMeterConfig.vue)) | 配置一览：表格展示全部计量配置，支持新增/删除/跳转编辑（`MeterEdit` 路由带 `:id`）。 |
| `AllStationConfig` ([AllStationConfig.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/AllStationConfig.vue)) | 计量站一览：列显示设置（动态勾选可见列）、表格展示，支持编辑（弹窗 `AllStationConfigEdit`）并保存至 `updateStationConfig`。 |
| `WebWsConfig` ([WebWsConfig.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/WebWsConfig.vue)) | WebSocket 配置：`vue3-json-editor` 加载/编辑/保存 ws 配置 JSON。 |
| `WebTempConfig` ([WebTempConfig.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/WebTempConfig.vue)) | 显示模板配置：加载/重置/修改模板文件名/编辑保存模板 JSON。 |
| `VueTestTemp` ([VueTestTemp.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/VueTestTemp.vue)) | 测试组件（结构与 WebTempConfig 类似，未挂权限控制）。 |
| `BlankConfig` ([BlankConfig.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/BlankConfig.vue)) | 空白占位页（3D 旋转立方体动画），用于未实装菜单项。 |
| `AllStationConfigEdit` ([AllStationConfigEdit.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/AllStationConfigChild/AllStationConfigEdit.vue)) | 计量站编辑弹窗：根据可见列动态生成表单，`is_valid` 用开关、`behavior_tree`/`config_id` 用下拉、其它用输入框。 |

#### 5.6.3 MeterConfig 子模块（MeterConfigChild）

`MeterConfig.vue` 通过 `:name` 标识把子组件的增删/保存事件统一路由到自身的 `addParameter/removeParameter/updateConfig/saveConfig`。各子组件职责：

| 子组件 | name 标识 | 配置项 |
|---|---|---|
| `MeterConfigStartStopSetting` | `startCode` / `checkStartCode` / `stopCode` / `checkStopCode` / `paramUncompress` | 启动/检查启动/停止/检查停止设备参数、参数解压（`code_id`+`value` 表格） |
| `MeterConfigDeviceStatusSetting` | `deviceStatusCode` | 设备状态枚举配置（`allParam`/`enums`/`statusEnumClassification`） |
| `MeterConfigMeterTongDaoSetting` | `wnChannelNumber` / `wmChannelNumber` | 当前/上次计量通道号 |
| `MeterConfigPlanSetting` | `planSetinfo` | 计划数据配置（表名/sql/通道列/字段映射） |
| `MeterConfigInitDeviceSetting` | `initDeviceSetting` | 初始化设备数据设置 |
| `MeterConfigResultSetting` | `resultSetting` | 计量结果配置（结果分组/表/列映射） |
| `MeterConfigCheckResultSetting` | `checkResultSetting` | 出结果判断（relation + condition） |
| `MeterConfigChangeParamSetting` | `changeParamSetting` | 可修改参数选择 |
| `MeterConfigEmphasisPlanSetting` | `emphasisPlanSetting` | 二次计量（plan/plan_time/plan_sort） |
| `MeterConfigExtendConfigSetting` | `extendConfigSetting` | 扩展信息（结果绑定/实时过滤模块） |
| `MeterConfigLoopMeterSetting` | `loopMeterSetting` | 循环计量信息 |
| `MeterConfigCheckMmanualStatusSetting` | `checkMeasureStatusSetting` | 计量井人工状态检查 |
| `MeterConfigLongRangeSetting` | `longRangeSetting` | 就地/远程组件配置 |
| `MeterConfigAddConfig` | - | 新增配置弹窗（生成 `config_<timestamp>` ID） |
| `Common/SaveConfigButton` | - | 通用"保存配置"按钮（受 `config:write` 控制） |

> 子组件统一模式：受控展示 + `emit('add-parameter', name)` / `emit('remove-parameter', name, index)` / `emit('save-config', name)` / `emit('update:xxx', value)`，由父组件统一处理数据装配与提交。

#### 5.6.4 用户中心（UserCenter）

| 组件 | 路径 | 职责 |
|---|---|---|
| `UserMenu` | [UserMenu.vue](file:///d:/work/vue/vue-base/src/components/UserCenter/UserMenu.vue) | 用户中心左侧菜单；通过 `hasAuthPermission` 控制菜单项可见性（`user_manage:read` / `role:read` / `auth:read`）。 |
| `UserManager` | [UserManager.vue](file:///d:/work/vue/vue-base/src/components/UserCenter/MenuChile/UserManager.vue) | 用户列表 + 新增/编辑/删除/重置密码（MD5）；`configtazh` 为系统用户禁用操作；受 `user_manage:write` 控制。 |
| `UserChangePassword` | [UserChangePassword.vue](file:///d:/work/vue/vue-base/src/components/UserCenter/MenuChile/UserChangePassword.vue) | 当前用户改密（老密码+新密码+确认，MD5）。 |
| `UserAuth` | [UserAuth.vue](file:///d:/work/vue/vue-base/src/components/UserCenter/MenuChile/UserAuth.vue) | 用户授权列表 + 角色分配（checkbox）+ 角色权限树/用户权限树查看；受 `auth:write` 控制。 |
| `UserRoles` | [UserRoles.vue](file:///d:/work/vue/vue-base/src/components/UserCenter/MenuChile/UserRoles.vue) | 角色列表 + 新增角色/角色授权（权限树勾选）/删除；`sys_admin` 为系统角色禁用操作；受 `role:write` 控制。 |

---

## 6. 关键类与函数说明

### 6.1 请求封装

#### `request(url, options)` — [configRequest.js](file:///d:/work/vue/vue-base/src/api/configUtils/configRequest.js)

```js
async function request(url, options = {})
```

- 基于 `fetch`；自动拼接 `Authorization: Bearer <token>`；
- `response.status === 401` → `clearAuthSession()` + 跳 `#/login`；
- 解析 JSON：`code !== 0` 抛错；否则返回 `data`（无 `data` 字段时返回整体）。
- 导出 `get(url, params)` / `post(url, data)` / `put` / `del`。

#### `service` (axios 实例) — [userRequest.js](file:///d:/work/vue/vue-base/src/api/userUtils/userRequest.js)

- `baseURL = import.meta.env.VITE_API_BASE_URL || ''`，`timeout: 50000`；
- 请求拦截：POST 普通对象 → `x-www-form-urlencoded`；非登录请求注入 `Authorization`；
- 响应拦截：`res.code !== 0` → `ElMessage.error` + reject；返回 `response.data`；401 清会话跳登录。

### 6.2 认证 & 权限

| 函数 | 位置 | 说明 |
|---|---|---|
| `setAuthSession({token,username,alias})` | auth.js | 写入 token/user/alias |
| `clearAuthSession()` | auth.js | 清除所有会话 key |
| `hasAuthSession()` | auth.js | token 与 user 均存在 |
| `getAuthPermissionKeys()` | auth.js | 读取权限 key 数组（容错） |
| `setAuthPermissionKeys(keys)` | auth.js | 去重存入 localStorage |
| `hasAuthPermission(key)` | auth.js | 空key 直接放行；否则判断包含 |
| `hasAnyAuthPermission(keys)` | auth.js | 任一命中即放行 |
| `refreshAuthPermissions(force)` | access-control.js | 拉取并归一化用户权限；带 Promise 防重入 |
| `getFirstAuthorizedPath()` | access-control.js | 决定登录后首屏 |
| `normalizePermissionKeys(items)` | access-control.js | `[{resource, access:[action]}]` → `["resource:action"]` |
| `handleAuthInfoFromUrl()` | authInfoProcessor.js | SSO：解析 URL authInfo → 写会话 → 清 URL 参数 |

### 6.3 权限树工具 — [permission-utils.js](file:///d:/work/vue/vue-base/src/utils/permission-utils.js)

| 函数 | 说明 |
|---|---|
| `accessItemsToCheckedKeys(items)` | 后端 `[{resource, access:[action]}]` → el-tree 勾选 key `["resource:action"]` |
| `buildPermissionPayload(features, checkedLeafKeys)` | 把勾选的叶子 key 反序列化为提交 payload `[{key:resourceKey, permission:[action,...]}]`（JSON 字符串） |
| `treeProps` | `{children:'permission', label:'name'}`，el-tree 配置 |
| `isOkResult(res)` / `asArray(v)` / `deepClone(v)` | 通用辅助 |

### 6.4 缓存 — [cacheData.js](file:///d:/work/vue/vue-base/src/api/configUtils/cacheData.js)

| 函数 | 说明 |
|---|---|
| `initObjectRelation()` | 拉取 `getObjectRelation`，递归构建 `objectId_objectType → {objectName, objectType}` Map，写 localStorage（10 分钟过期） |
| `getAllObjectInfoMap()` | 优先读本地缓存，过期/缺失则重新初始化；返回 Map |

### 6.5 MeterConfig 核心方法 — [MeterConfig.vue](file:///d:/work/vue/vue-base/src/components/ConfigVue/MenuChile/MeterConfig.vue)

| 方法 | 说明 |
|---|---|
| `init()` | 并发拉取全部计量配置/站列表/表名/扩展枚举/对象关系，装配选项；若路由带 `:id` 自动选中 |
| `handleConfigChange(configId)` | 切换配置：深拷贝 config 到 `baseData.config`，调用 `initConfig()` 装配子模块数据 |
| `initConfig()` | 把后端 config 结构映射到 18 个子模块的局部状态（含旧结构兼容，如 `device_status.code_id` 适配） |
| `updateConfig(name)` | 按 name 把子模块局部状态回写到 `baseData.config`；带必填校验，返回 `{result, error}` |
| `saveConfig(name)` | 单模块保存：先 `updateConfig` 再 `saveAllConfigApi` |
| `saveAllConfig()` | 遍历 18 个 name 逐一 `updateConfig`，全部通过后提交 |
| `saveAllConfigApi()` | 调用 `updateMeterConfig` 提交 `{config_id, name, config, meter_station_id}` |
| `addParameter(name)` / `removeParameter(name, index)` | 子模块行级增删分发 |
| `scrollToSection(id)` / `scrollToTop()` | 快速导航锚点滚动 |

---

## 7. 路由与页面映射

| 路径 | name | 组件 | 权限 |
|---|---|---|---|
| `/login` | Login | LoginView | 公开 |
| `/` | - | MainLayout（重定向 `/config`） | - |
| `/403` | Forbidden | ForbiddenView | - |
| `/config` | config | MenuIndex（重定向 `/config/plan`） | - |
| `/config/plan` | Plan | PlanConfig | `config:read/write` |
| `/config/result` | Result | ResultConfig | `config:read/write` |
| `/config/meter` | Meter | MeterConfig | `config:read/write` |
| `/config/meter/:id` | MeterEdit | MeterConfig（`props:true`） | `config:read/write` |
| `/config/all-meter` | AllMeter | AllMeterConfig | `config:read/write` |
| `/config/all-station` | AllStation | AllStationConfig | `config:read/write` |
| `/config/measure-web-ws` | MeasureWebWs | WebWsConfig | `config:read/write` |
| `/config/measure-web-temp` | MeasureWebTemp | WebTempConfig | `config:read/write` |
| `/config/changelog`、`/template-config*`、`/blank` | - | BlankConfig（或外部跳转） | - |
| `/custom-submenu/*` | - | MenuIndex + BlankConfig（实际 `handleJumpHtml` 外跳） | - |
| `/user-center` | UserCenterMenu | UserMenu（重定向 `/user-center/users`） | - |
| `/user-center/users` | UserManager | UserManager | `user_manage:read`，写需 `user_manage:write` |
| `/user-center/change-password` | UserChangePassword | UserChangePassword | 登录即可 |
| `/user-center/auth` | UserAuth | UserAuth | `auth:read`，写需 `auth:write` |
| `/user-center/roles` | UserRoles | UserRoles | `role:read`，写需 `role:write` |

---

## 8. 数据流与认证流程

### 8.1 登录流程

```
LoginView.submitLogin
  └─ loginByPassword({username, password: md5(password)})
        └─ POST /login (form-urlencoded)
  ├─ res.result === 'ok' ?
  │     是 → 取 content.token_type + content.token → setAuthSession
  │     否 → ElMessage 警告
  ├─ refreshAuthPermissions(true)   // 拉取并缓存权限 key
  ├─ setRememberedUser(account, remember)
  └─ router.replace( redirectPath 或 getFirstAuthorizedPath() )
```

### 8.2 会话鉴权流程

```
任意请求 → 拦截器读 getAuthToken()
         → 注入 Authorization: Bearer <token>
         → 后端校验
            ├─ 200 → 正常返回
            └─ 401 → clearAuthSession() + 跳 #/login
```

### 8.3 跨子系统 SSO 流程

```
子系统A (vue-base) MenuIndex.handleJumpHtml(pageName)
  ├─ 读取 token/user/alias/permissionKeys
  ├─ encodeURIComponent(JSON.stringify({...}))
  └─ window.open(`http://<ip>:<port>/#/<page>?authInfo=<encoded>`)

子系统B 入口 router/index.js (模块加载时)
  └─ handleAuthInfoFromUrl()
        ├─ processAuthInfoFromUrl()  // 解析 + setAuthSession + setAuthPermissionKeys
        └─ removeAuthInfoFromUrl()   // 清理 URL 参数
```

### 8.4 权限控制点

- **菜单可见性**：`UserMenu`、`MenuIndex` 通过 `hasAuthPermission` 控制。
- **按钮可见性**：各配置页 `PromiseWrite = getAuthPermission('config:write')`（computed ref）控制保存/新增按钮。
- **首屏路由**：`getFirstAuthorizedPath()` 根据权限决定。
- **页面级保护**：无全局路由守卫；未登录访问受保护页时，因 API 401 触发跳登录。

---

## 9. 后端接口依赖

开发期由 `vue.config.js` 的 `devServer.proxy` 转发到 `http://127.0.0.1:8267`。

| 前缀 | 用途 | 客户端 |
|---|---|---|
| `/tmms_config` | 计量/通用/Web 配置 | fetch |
| `/meter_general` | 对象关系（站名翻译） | fetch |
| `/ac` | 用户/角色/权限管理 | axios |
| `/login` | 登录 | axios |

### 9.1 主要接口清单

**配置类（fetch，返回 `{code,data,message}`，code=0 成功）**

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/tmms_config/get_tmms_config` | 获取计量通用配置 |
| GET | `/tmms_config/get_table_column?table_name=&type=` | 获取表列名 |
| GET | `/tmms_config/get_all_table_name` | 获取所有表名 |
| POST | `/tmms_config/update_tmms_config_plan` | 保存计划配置 |
| POST | `/tmms_config/update_tmms_config_result` | 保存结果配置 |
| GET | `/tmms_config/get_meter_config` | 获取全部计量配置 |
| GET | `/tmms_config/get_all_station_tag_key` | 获取已配参数的站 id |
| GET | `/tmms_config/get_station_code?station_id=` | 获取站参数枚举 |
| POST | `/tmms_config/update_meter_config` | 新增/更新计量配置 |
| GET | `/tmms_config/delete_meter_config?config_id=` | 删除计量配置 |
| GET | `/tmms_config/get_extend_config_enum` | 扩展参数枚举 |
| GET | `/tmms_config/get_web_port` | 各子系统 web 端口 |
| GET | `/tmms_config/get_station_config` | 全部站配置 |
| GET/POST | `/tmms_config/get_web_ws_config` / `update_web_ws_config` / `change_web_ws_config` | WebSocket 配置 |
| GET/POST | `/tmms_config/get_web_temp_config` / `reset_web_temp_config` / `change_web_temp_config` / `change_web_temp_filename` | 模板配置 |
| GET | `/meter_general/get_object_relation` | 对象关系树 |

**用户/权限类（axios，返回 `{result, content}`，`result==='ok'` 成功）**

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/login` | 登录（form-urlencoded, grant_type=password, password=md5） |
| GET | `/ac/get_all_users` | 全部用户 |
| POST | `/ac/add_user` / `/ac/del_user` / `/ac/update_user` | 用户增删改 |
| POST | `/ac/reset_passwd` / `/ac/update_passwd` | 重置/修改密码（md5） |
| GET | `/ac/get_all_user_role` | 用户-角色列表 |
| GET | `/ac/get_all_roles` | 全部角色 |
| POST | `/ac/set_user_role` | 设置用户角色 |
| POST | `/ac/batch_grant_role` | 角色批量授权 |
| POST | `/ac/del_role` | 删除角色 |
| GET | `/ac/get_features` | 权限功能树 |
| GET | `/ac/get_user_access?user_name=` | 用户权限 |
| GET | `/ac/get_role_access?role=` | 角色权限 |

> 完整请求/响应字段定义见 [doc/api.md](file:///d:/work/vue/vue-base/doc/api.md)。

---

## 10. 项目运行方式

### 10.1 环境要求

- Node.js 18+（项目使用 Vite 5，实际开发环境为 Node 24）
- npm

### 10.2 安装与启动

```bash
# 安装依赖
npm install

# 开发模式（Vite Dev Server，默认端口 8080，支持 HMR 热更新）
npm run serve
# 或
npm run dev

# 生产构建（输出至 dist/）
npm run build

# 代码检查
npm run lint
```

### 10.3 开发期代理

`vite.config.js` 已配置 `server.proxy`，将 `/tmms_config`、`/meter_general`、`/ac`、`/login` 转发至 `http://127.0.0.1:8267`。开发前请确保后端服务在该地址可用，或修改 `vite.config.js` 中的 `target`。

### 10.4 访问

- 开发：`http://localhost:8080/`（Hash 路由，默认跳转 `/#/config`，未登录会被 API 401 引导至 `/#/login`）。
- 跨子系统跳转：从 `MenuIndex` 的"导航"菜单进入，会带 `authInfo` 参数打开新窗口。

### 10.5 路径别名

`jsconfig.json` 与 `vite.config.js` 共同支持 `@` 指向 `src/`，例如 `import xxx from '@/api/userUtils/auth'`。

### 10.6 与原 Vue CLI 的主要差异

| 项 | Vue CLI（旧） | Vite（新） |
|---|---|---|
| 入口 HTML | `public/index.html`（含 EJS 模板） | 根目录 `index.html`（直接引用 `/src/main.js`） |
| 构建配置 | `vue.config.js` | `vite.config.js` |
| 转译 | Babel（`babel.config.js`） | esbuild（无需 Babel 配置） |
| 模块系统 | CJS/ESM 混合 | ESM（`package.json` 声明 `"type": "module"`） |
| 标题设置 | `pages.index.title` | `index.html` 中直接写 `<title>` |
| `.vue` 导入 | 可省略扩展名 | **必须显式写 `.vue`** |
| 环境变量 | `process.env` | `import.meta.env`（前缀 `VITE_`） |

---

## 11. 开发约定与注意事项

1. **两套 HTTP 客户端并存**：配置接口走 `fetch`（`configRequest.js`，返回 `data` 字段），用户接口走 `axios`（`userRequest.js`，返回完整 `response.data`，业务层判断 `result==='ok'`）。新增接口时请按业务域选择对应客户端，避免混用。
2. **密码加密**：所有密码相关接口（登录、改密、重置）均在前端 `md5` 后再传输，后端需配套 MD5 校验。
3. **权限控制是页面级而非路由级**：没有全局路由守卫，菜单/按钮可见性依赖 `hasAuthPermission`；未登录访问受保护页会因接口 401 跳登录。若需强化，可在 `router` 增加 `beforeEach` 守卫。
4. **`config:write` computed 时机**：`getAuthPermission(key)` 返回 `computed(() => hasAuthPermission(key))`，权限 key 在登录后或 SSO 注入后才存在；刷新页面时若权限未加载，按钮可能短暂不可见，需确保 `refreshAuthPermissions` 已执行。
5. **跨子系统 SSO 依赖 URL 透传**：`MenuIndex.handleJumpHtml` 把 token 等放入 URL，子系统必须调用 `handleAuthInfoFromUrl()` 解析；该方式会把 token 暴露在 URL/历史记录中，敏感场景需评估风险。
6. **MeterConfig 旧数据兼容**：`initConfig()` 对 `device_status.code_id`、`check_result`、`result` 等做了旧结构适配；修改字段结构时需同步维护兼容逻辑。
7. **localStorage 缓存**：对象关系 Map 缓存 10 分钟过期；权限 key 无过期机制，登出需主动 `clearAuthSession()`。
8. **`console.warn` 全局静默**：`main.js` 当前把 `isDeprecatedWarn` 硬编码为 `true`，会屏蔽所有 `console.warn`；调试时需注意。
9. **系统保留项**：用户 `configtazh` 与角色 `sys_admin` 不可编辑/删除（前端禁用，后端应同步保护）。
10. **构建标题**：`index.html` 中直接写 `<title>计量管理</title>`（Vite 入口 HTML 在根目录）。

---

> 文档基于源码静态分析生成，如有结构性改动请同步更新本 Wiki。
