# vue-base Code Wiki

> 行为树管理系统 — 基于 Vue 3 + Element Plus 的可视化行为树编辑与用户权限管理平台

---

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术栈](#2-技术栈)
- [3. 项目整体架构](#3-项目整体架构)
- [4. 目录结构](#4-目录结构)
- [5. 核心模块职责](#5-核心模块职责)
  - [5.1 入口与根组件](#51-入口与根组件)
  - [5.2 路由系统](#52-路由系统)
  - [5.3 状态管理 (Store)](#53-状态管理-store)
  - [5.4 API 层](#54-api-层)
  - [5.5 工具函数 (Utils)](#55-工具函数-utils)
  - [5.6 布局与导航](#56-布局与导航)
  - [5.7 用户中心模块](#57-用户中心模块)
  - [5.8 行为树模块](#58-行为树模块)
  - [5.9 认证与权限](#59-认证与权限)
- [6. 关键类与函数说明](#6-关键类与函数说明)
- [7. 依赖关系](#7-依赖关系)
- [8. 项目运行方式](#8-项目运行方式)
- [9. 开发约定与注意事项](#9-开发约定与注意事项)

---

## 1. 项目概述

**vue-base** 是一个行为树（Behavior Tree）可视化管理系统，主要功能包括：

1. **行为树可视化编辑**：通过拖拽方式在画布上组装行为树节点，支持节点的增删、折叠/展开、参数编辑、左移/右移排序、连线类型切换等操作。
2. **行为树数据管理**：管理行为节点分组、自定义节点定义（模块/函数/参数），行为树的创建/编辑/删除/构建下载。
3. **运行监控**：通过 WebSocket 实时订阅行为树运行日志，在画布上动态展示节点执行结果（成功/失败）。
4. **快照管理**：生成、上传、下载、还原、删除行为树数据快照。
5. **用户中心**：用户管理（增删改查、重置密码）、角色管理（增删、授权）、用户授权（角色分配、权限树查看）、密码修改。
6. **认证与权限控制**：基于 Token 的登录认证，基于 RBAC 的权限校验（前端按钮/菜单级别控制）。

---

## 2. 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | Vue 3 | ^3.2.13 | 使用 Options API 与 Composition API 混合模式 |
| UI 组件库 | Element Plus | ^2.13.5 | 表单、表格、对话框、菜单等 |
| 路由 | Vue Router | ^5.0.3 | Hash 模式路由 |
| 状态管理 | Pinia | ^3.0.4 | 轻量级 store |
| 图可视化 | Vue Flow | ^1.48.2 | 行为树画布渲染（节点/边/缩略图/背景） |
| 图可视化辅助 | @vue-flow/background, controls, minimap | ^1.x | 画布背景、控制面板、缩略图 |
| 图可视化(备用) | @antv/x6, @antv/x6-vue-shape | ^3.1.6 | X6 图编辑（项目中未实际使用） |
| HTTP 请求 | Axios | ^1.13.6 | 用户中心 API 请求 |
| HTTP 请求(原生) | Fetch API | - | 行为树 API 请求 |
| 密码加密 | js-md5 | ^0.8.3 | 登录与密码操作的 MD5 加密 |
| CSS 框架 | Tailwind CSS | ^3.4.19 | 原子化 CSS |
| 构建工具 | Vue CLI 5 | ~5.0.0 | vue-cli-service |
| 代码规范 | ESLint + eslint-plugin-vue | ^7.32.0 | Vue 3 essential 规则集 |
| 路径别名 | jsconfig.json | - | `@/` 映射到 `src/` |

---

## 3. 项目整体架构

```
┌──────────────────────────────────────────────────────────────┐
│                        浏览器 (Hash 路由)                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              App.vue (#app > router-view)              │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │              MainLayout.vue (顶栏导航)             │  │  │
│  │  │  ┌────────────┬───────────────────────────────┐  │  │  │
│  │  │  │  侧边菜单   │         内容区 (router-view)    │  │  │  │
│  │  │  │  (子菜单)   │  ┌─────────┬─────────┬─────┐  │  │  │  │
│  │  │  │            │  │行为树管理│用户中心 │快照 │  │  │  │  │
│  │  │  │            │  │  模块   │  模块   │管理 │  │  │  │  │
│  │  │  │            │  └─────────┴─────────┴─────┘  │  │  │  │
│  │  │  └────────────┴───────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  API 层     │  │  Store 层     │  │  Utils 工具层          │  │
│  │  (axios/    │  │  (Pinia)      │  │  (auth/permission/     │  │
│  │   fetch)    │  │              │  │   time/index)         │  │
│  └──────┬──────┘  └──────────────┘  └───────────────────────┘  │
│         │                                                      │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ▼
  ┌───────────────────────────────────────┐
  │           后端服务 (代理)               │
  │  /ac/*        → 127.0.0.1:8267 (用户)  │
  │  /login       → 127.0.0.1:8267 (登录)  │
  │  /behavior/*  → 127.0.0.1:8426 (行为树)│
  │  /snapshot/*  → 127.0.0.1:8426         │
  │  /behavior_file/* → 127.0.0.1:8426     │
  │  /behavior_tree/* → 127.0.0.1:8426     │
  │  WebSocket: ws://192.168.1.192:8426   │
  └───────────────────────────────────────┘
```

**架构特点**：
- **双 API 客户端**：用户中心使用 Axios（`userRequest.js`），行为树使用原生 Fetch（`behaviorRequest.js`），各自独立处理拦截器与认证头。
- **组件化设计**：行为树节点为独立 Vue 组件，通过 Vue Flow 的 `#node-xxx` 插槽注册。
- **前端权限控制**：基于 localStorage 中的 `auth_permission_keys`，通过 `hasAuthPermission()` 控制 UI 元素的显示/隐藏。
- **Hash 路由模式**：使用 `createWebHashHistory()`，适配无服务端路由配置的部署环境。

---

## 4. 目录结构

```
vue-base/
├── public/
│   ├── index.html              # HTML 模板
│   └── favicon.ico
├── src/
│   ├── main.js                 # 应用入口
│   ├── App.vue                 # 根组件
│   ├── styles.css              # 全局样式 (Tailwind 入口)
│   ├── assets/
│   │   ├── css/main.css        # 主样式 (Vue Flow 节点/边定制)
│   │   ├── json/baseData.json  # 基础行为树/分组静态数据
│   │   └── logo.png
│   ├── router/
│   │   └── index.js            # 路由配置
│   ├── store/
│   │   ├── node.js             # 行为树节点定义与映射
│   │   └── playground.js       # 画布状态 store
│   ├── api/
│   │   ├── login/
│   │   │   └── auth.js         # 登录 API
│   │   ├── userUtils/
│   │   │   ├── index.js        # 通用工具函数 (URL 解析/深拷贝等)
│   │   │   ├── auth.js         # 认证信息 localStorage 管理
│   │   │   ├── access-control.js # 权限加载与校验
│   │   │   ├── userCenter.js   # 用户中心 API 封装
│   │   │   └── userRequest.js  # Axios 实例与拦截器
│   │   └── behavior/
│   │       ├── behaviorRequest.js # Fetch 封装
│   │       └── behavior.js     # 行为树 API 封装
│   ├── utils/
│   │   ├── authInfoProcessor.js # URL 认证信息解析
│   │   ├── permission-utils.js  # 权限工具函数
│   │   └── timeLib.js          # 时间格式化
│   └── components/
│       ├── MainLayout.vue      # 主布局 (顶栏导航)
│       ├── LoginView.vue       # 登录页
│       ├── ForbiddenView.vue   # 403 无权限页
│       ├── UserCenter/
│       │   ├── UserMenu.vue    # 用户中心侧边菜单
│       │   └── MenuChile/
│       │       ├── UserManager.vue       # 用户管理
│       │       ├── UserRoles.vue        # 角色管理
│       │       ├── UserAuth.vue         # 授权管理
│       │       └── UserChangePassword.vue # 密码修改
│       └── BehaviorTree/
│           ├── BehaviorTreeMenu.vue     # 行为树侧边菜单
│           ├── BTChild/
│           │   ├── NodeManager.vue      # 节点管理
│           │   ├── BehaviorTreeManager.vue # 行为树管理
│           │   └── Snapshot.vue         # 快照管理
│           ├── BehaviorTreeEdit/
│           │   ├── BehaviorTreeEdit.vue # 行为树编辑画布
│           │   ├── BehaviorNodePanel.vue # 节点拖拽面板
│           │   └── BehaviorTreeEditChile/
│           │       ├── NodeSelectInfo.vue    # 节点信息面板
│           │       ├── InteractionControls.vue # Vue Flow 交互控制(调试用)
│           │       └── nodes/
│           │           ├── root.vue          # 根节点
│           │           ├── AlwaysTrueNode.vue # 永真节点
│           │           ├── IfElseNode.vue    # ifelse 节点
│           │           ├── LoopBoolNode.vue   # 循环节点(布尔)
│           │           ├── LoopNumNode.vue   # 循环节点(次数)
│           │           ├── SelectorNode.vue  # 选择节点
│           │           ├── SequenceNode.vue  # 顺序节点
│           │           ├── NegationNode.vue  # 取反节点
│           │           ├── ParallelNode.vue  # 并行节点
│           │           ├── LeafNode.vue      # 叶节点
│           │           ├── NullNode.vue      # 空节点(占位)
│           │           └── NodePublicTemp/
│           │               └── NodeActionButtons.vue # 节点操作按钮
│           └── BehaviorTreeLog/
│               ├── BehaviorTreeLog.vue      # 运行日志监控画布
│               └── LogNodeSelectInfo.vue     # 日志节点信息面板
├── vue.config.js               # Vue CLI 配置 (代理/入口/输出)
├── tailwind.config.js          # Tailwind 配置
├── postcss.config.js          # PostCSS 配置
├── babel.config.js            # Babel 配置
├── jsconfig.json              # 路径别名配置
├── package.json
└── README.md
```

---

## 5. 核心模块职责

### 5.1 入口与根组件

#### [main.js](file:///d:/work/vue/vue-base/src/main.js)

应用入口文件，职责：
- 创建 Vue 应用实例
- 注册 Element Plus（全局组件库）
- 注册 Vue Router
- 引入全局样式（Element Plus CSS、Tailwind CSS、main.css、Vue Flow CSS）
- 重写 `console.warn` 过滤 Element Plus 弃用警告

#### [App.vue](file:///d:/work/vue/vue-base/src/App.vue)

根组件，仅包含 `<router-view />`，所有页面通过路由渲染。定义全局重置样式（margin/padding/box-sizing）。

---

### 5.2 路由系统

#### [router/index.js](file:///d:/work/vue/vue-base/src/router/index.js)

使用 `createWebHashHistory()` 的 Hash 路由。在路由文件顶部执行 `handleAuthInfoFromUrl()` 处理 URL 中携带的认证信息。

**路由结构**：

| 路径 | 组件 | 说明 |
|------|------|------|
| `/login` | LoginView | 登录页（独立，无布局） |
| `/` → redirect `/behavior-tree/node-manager` | MainLayout | 主布局，子路由在此内渲染 |
| `/403` | ForbiddenView | 无权限页 |
| `/user-center` → redirect `/user-center/users` | UserMenu | 用户中心子菜单 |
| `/user-center/users` | UserManager | 用户管理 |
| `/user-center/change-password` | UserChangePassword | 密码修改 |
| `/user-center/auth` | UserAuth | 授权管理 |
| `/user-center/roles` | UserRoles | 角色管理 |
| `/edit-tree` | BehaviorTreeEdit | 行为树编辑器（query 参数 `id`） |
| `/monitor` | BehaviorTreeLog | 运行监控 |
| `/behavior-tree` → redirect `/behavior-tree/node-manager` | BehaviorTreeMenu | 行为树子菜单 |
| `/behavior-tree/node-manager` | NodeManager | 节点管理 |
| `/behavior-tree/tree-manager` | BehaviorTreeManager | 行为树管理 |
| `/behavior-tree/Snapshot` | Snapshot | 快照管理 |

---

### 5.3 状态管理 (Store)

#### [store/node.js](file:///d:/work/vue/vue-base/src/store/node.js)

行为树节点的核心数据定义模块，不使用 Pinia，而是纯 JS 导出的常量与函数。

**核心数据**：
- `nodeinfo`：所有节点类型的树结构模板（root/always_true/ifelse/loop_bool/loop_num/selector/sequence/negation/parallel/leaf/null）
- `treeNodeTypeToVueFlowNodeType`：后端节点类型到 Vue Flow 节点类型的映射
- `baseGroupBehavior`：基础分组行为节点列表（9 种控制节点）

**导出函数**：

| 函数 | 说明 |
|------|------|
| `getBaseGroupBehavior()` | 获取基础分组行为数据（深拷贝） |
| `getNodeInfo(nodeType, behavior)` | 根据节点类型生成树结构模板，叶节点使用 behavior 的 id/args |
| `getTreeNodeTypeToVueFlowNodeType()` | 获取节点类型映射表 |
| `getBaseNodeInfo()` | 获取基础节点信息 Map（node_type → {name, behavior_id, description}） |

#### [store/playground.js](file:///d:/work/vue/vue-base/src/store/playground.js)

Pinia store，管理画布当前选中的节点类型（`currentType`）。当前项目中实际使用较少。

---

### 5.4 API 层

项目有 **两套独立的 HTTP 客户端**：

#### 用户中心 API — [api/userUtils/userRequest.js](file:///d:/work/vue/vue-base/src/api/userUtils/userRequest.js)

基于 **Axios**，服务于用户管理/角色/权限/登录等接口。

- `baseURL`：`import.meta.env.VITE_API_BASE_URL || ''`（空，走代理）
- `timeout`：50000ms
- **请求拦截器**：
  - POST + 普通对象 → 自动转为 `application/x-www-form-urlencoded`
  - 非 login 请求 → 自动附加 `Authorization: Bearer <token>` 头
- **响应拦截器**：
  - `code !== 0` → 弹出 ElMessage 错误提示并 reject
  - 401 → 清除认证 session 并跳转登录页
  - 其他错误 → 弹出错误提示

#### 用户中心 API 封装 — [api/userUtils/userCenter.js](file:///d:/work/vue/vue-base/src/api/userUtils/userCenter.js)

| 函数 | 方法 | 路径 | 说明 |
|------|------|------|------|
| `acGetAllUserRole()` | GET | `/ac/get_all_user_role` | 获取所有用户及角色 |
| `acGetFeatures()` | GET | `/ac/get_features` | 获取功能权限树 |
| `acGetAllRoles()` | GET | `/ac/get_all_roles` | 获取所有角色 |
| `acSetUserRole(data)` | POST | `/ac/set_user_role` | 设置用户角色 |
| `acGetUserAccess(params)` | GET | `/ac/get_user_access` | 获取用户权限 |
| `acGetRoleAccess(params)` | GET | `/ac/get_role_access` | 获取角色权限 |
| `acDeleteRole(data)` | POST | `/ac/del_role` | 删除角色 |
| `acUpdatePasswd(data)` | POST | `/ac/update_passwd` | 修改密码 |
| `acBatchGrantRole(data)` | POST | `/ac/batch_grant_role` | 批量授权角色 |
| `acGetAllUsers()` | GET | `/ac/get_all_users` | 获取所有用户 |
| `acDelUser(data)` | POST | `/ac/del_user` | 删除用户 |
| `acAddUser(data)` | POST | `/ac/add_user` | 添加用户 |
| `acResetPasswd(data)` | POST | `/ac/reset_passwd` | 重置密码 |
| `acUpdateUser(data)` | POST | `/ac/update_user` | 更新用户信息 |

#### 行为树 API — [api/behavior/behaviorRequest.js](file:///d:/work/vue/vue-base/src/api/behavior/behaviorRequest.js)

基于原生 **Fetch API**，服务于行为树/节点/快照等接口。

- 自动附加 `Authorization: Bearer <token>` 头
- 401 → 清除 session 并跳转登录页
- `code !== 0 && code !== 200` → 抛出错误
- 支持 JSON 与 FormData 两种请求体

**导出函数**：`get(url, params)`, `post(url, data)`, `put(url, data)`, `del(url)`, `request(url, options)`

#### 行为树 API 封装 — [api/behavior/behavior.js](file:///d:/work/vue/vue-base/src/api/behavior/behavior.js)

| 函数 | 方法 | 路径 | 说明 |
|------|------|------|------|
| `getSnapshot()` | GET | `/behavior_file/get_snapshot` | 获取快照列表 |
| `restoreSnapshot(data)` | POST | `/behavior_file/restore_snapshot` | 还原快照 |
| `generateSnapshot()` | POST | `/behavior_file/generate_snapshot` | 生成快照 |
| `snapshotUpload(Data)` | POST | `/behavior_file/upload` | 上传快照 |
| `delSnapshot(fileName)` | DELETE | `/behavior_file/delete_snapshot` | 删除快照 |
| `getAllBehavior()` | GET | `/behavior/get_all_behavior` | 获取所有行为节点 |
| `getAllBehaviorTree()` | GET | `/behavior/get_all_behavior_tree` | 获取所有行为树 |
| `getBehaviorTree(treeId)` | GET | `/behavior/get_behavior_tree` | 获取单棵行为树 |
| `addBehaviorGroup(data)` | POST | `/behavior/add_behavior_group` | 添加行为分组 |
| `updateBehaviorGroup(data)` | POST | `/behavior/update_behavior_group` | 更新行为分组 |
| `addBehavior(data)` | POST | `/behavior/add_behavior` | 添加行为节点 |
| `updateBehavior(data)` | POST | `/behavior/update_behavior` | 更新行为节点 |
| `addBehaviorTree(data)` | POST | `/behavior/add_behavior_tree` | 添加行为树 |
| `updateBehaviorTree(data)` | POST | `/behavior/update_behavior_tree` | 更新行为树 |
| `builderExecutableTree(data)` | POST | `/behavior/builder_executable_tree` | 构建可执行行为树 |
| `deleteBehaviorGroup(groupId)` | DELETE | `/behavior/delete_behavior_group` | 删除行为分组 |
| `deleteBehavior(behaviorId)` | DELETE | `/behavior/delete_behavior` | 删除行为节点 |
| `deleteBehaviorTree(treeId)` | DELETE | `/behavior/delete_behavior_tree` | 删除行为树 |
| `getBehaviorMFA(behaviorId)` | GET | `/behavior/get_behavior_mfa` | 获取行为模块-函数-参数(MFA)信息 |

#### 登录 API — [api/login/auth.js](file:///d:/work/vue/vue-base/src/api/login/auth.js)

| 函数 | 说明 |
|------|------|
| `loginByPassword({username, password})` | 密码登录（MD5 加密后发送 POST `/login`） |
| `getAuthPermission(permission)` | 返回 `computed(() => hasAuthPermission(permission))` |

---

### 5.5 工具函数 (Utils)

#### [utils/authInfoProcessor.js](file:///d:/work/vue/vue-base/src/utils/authInfoProcessor.js)

处理 URL 中携带的 `authInfo` 参数（用于外部系统免登录跳转）。

| 函数 | 说明 |
|------|------|
| `processAuthInfoFromUrl()` | 解析 URL 中的 `authInfo` JSON，提取 token/user/alias/permissionKeys 存入 localStorage |
| `removeAuthInfoFromUrl()` | 从 URL 中移除 `authInfo` 参数（保持 URL 干净） |
| `handleAuthInfoFromUrl()` | 完整流程：解析 + 存储 + 移除 URL 参数 |

#### [utils/permission-utils.js](file:///d:/work/vue/vue-base/src/utils/permission-utils.js)

权限相关工具函数。

| 函数 | 说明 |
|------|------|
| `isOkResult(res)` | 判断 API 返回 `result === 'ok'` |
| `asArray(value)` | 安全转数组 |
| `deepClone(value)` | 深拷贝（JSON 方式） |
| `accessItemsToCheckedKeys(items)` | 将权限项列表转换为 el-tree 的 checkedKeys（`resource:action` 格式） |
| `buildPermissionPayload(features, checkedLeafKeys)` | 将功能树和选中的叶子节点 key 构建为权限提交 payload（JSON 字符串） |

#### [utils/timeLib.js](file:///d:/work/vue/vue-base/src/utils/timeLib.js)

| 函数 | 说明 |
|------|------|
| `formatTimestamp(timestamp)` | 时间戳转 `YYYY-MM-DD HH:mm:ss`（自动识别秒级/毫秒级） |

#### [api/userUtils/index.js](file:///d:/work/vue/vue-base/src/api/userUtils/index.js)

通用工具函数集（源自 PanJiaChen 的开源项目），包含：

| 函数 | 说明 |
|------|------|
| `parseTime(time, cFormat)` | 时间格式化（支持对象/字符串/数字） |
| `formatTime(time, option)` | 相对时间格式化（刚刚/N分钟前/N小时前等） |
| `getQueryObject(url)` | 解析 URL 查询参数为对象 |
| `byteLength(str)` | 计算 UTF-8 字符串字节长度 |
| `cleanArray(actual)` | 过滤数组 falsy 值 |
| `param(json)` | 对象转 URL 查询字符串 |
| `param2Obj(url)` | URL 查询字符串转对象 |
| `html2Text(val)` | HTML 转纯文本 |
| `objectMerge(target, source)` | 深度合并对象 |
| `debounce(func, wait, immediate)` | 防抖函数 |
| `deepClone(source)` | 深拷贝（递归方式） |
| `uniqueArr(arr)` | 数组去重 |
| `createUniqueString()` | 生成唯一字符串 |
| `hasClass/addClass/removeClass` | DOM 类名操作 |

---

### 5.6 布局与导航

#### [MainLayout.vue](file:///d:/work/vue/vue-base/src/components/MainLayout.vue)

应用主框架，包含：
- **顶栏**：Logo + 标题、中间导航菜单（行为树/用户设置下拉菜单）、右上角用户名 + 退出登录
- **内容区**：`<router-view />` 渲染子路由

导航菜单通过 `el-dropdown` 实现，命令分发：
- `BTManager` → `/behavior-tree/node-manager`
- `BTdataManager` → `/behavior-tree/snapshot`
- `userManager` → `/user-center/users`
- `roleManager` → `/user-center/roles`
- `authManager` → `/user-center/auth`
- `logout` → 清除 session 并跳转登录

#### [BehaviorTreeMenu.vue](file:///d:/work/vue/vue-base/src/components/BehaviorTree/BehaviorTreeMenu.vue)

行为树模块的侧边菜单（el-aside + el-menu），包含：
- 行为树管理 → 节点管理、行为树管理
- 数据管理 → 运行监控、数据备份、操作日志

#### [UserMenu.vue](file:///d:/work/vue/vue-base/src/components/UserCenter/UserMenu.vue)

用户中心模块的侧边菜单，基于权限控制菜单项显示：
- 用户管理 (`user_manage:read`)
- 密码修改（无权限限制）
- 角色管理 (`role:read`)
- 授权管理 (`auth:read`)

---

### 5.7 用户中心模块

#### [UserManager.vue](file:///d:/work/vue/vue-base/src/components/UserCenter/MenuChile/UserManager.vue)

用户管理页面（`<script setup>` Composition API）。
- 权限控制：`user_manage:write` 控制新增/编辑/删除/重置密码按钮
- 功能：用户列表表格、新增用户弹窗、编辑用户弹窗、重置密码弹窗、删除用户
- 系统用户 `configtazh` 不可编辑/删除

#### [UserRoles.vue](file:///d:/work/vue/vue-base/src/components/UserCenter/MenuChile/UserRoles.vue)

角色管理页面。
- 权限控制：`role:write` 控制新增/授权/删除按钮
- 功能：角色列表、新增角色弹窗（含权限树 el-tree）、角色授权弹窗、删除角色
- 系统角色 `sys_admin` 不可编辑/删除
- 角色名只能由英文字母、数字和下划线组成

#### [UserAuth.vue](file:///d:/work/vue/vue-base/src/components/UserCenter/MenuChile/UserAuth.vue)

用户授权管理页面。
- 权限控制：`auth:write` 控制授权按钮
- 功能：用户授权列表（展示用户名/别名/角色标签）、授权弹窗（checkbox 选择角色）、角色权限查看弹窗（el-tree）、用户权限查看弹窗（el-tree）

#### [UserChangePassword.vue](file:///d:/work/vue/vue-base/src/components/UserCenter/MenuChile/UserChangePassword.vue)

密码修改页面。
- 功能：老密码 + 新密码 + 确认密码表单，MD5 加密后提交
- 校验：两次密码必须一致

---

### 5.8 行为树模块

#### [NodeManager.vue](file:///d:/work/vue/vue-base/src/components/BehaviorTree/BTChild/NodeManager.vue)

行为节点管理页面。
- 功能：
  - 分组列表（基础分组 + 自定义分组）
  - 添加/编辑/删除分组
  - 添加/编辑/查看/删除行为节点
  - 节点参数定义（参数类型：int/string/atom）
  - 模块/函数选择（从 `getBehaviorMFA` 获取后端模块-函数列表）

#### [BehaviorTreeManager.vue](file:///d:/work/vue/vue-base/src/components/BehaviorTree/BTChild/BehaviorTreeManager.vue)

行为树管理页面。
- 功能：
  - 行为树卡片列表（网格布局）
  - 添加行为树弹窗（可选模板）
  - 编辑/设计行为树 → 跳转 `/edit-tree?id=<treeId>`
  - 构建可执行行为树 → 下载文件
  - 删除行为树

#### [Snapshot.vue](file:///d:/work/vue/vue-base/src/components/BehaviorTree/BTChild/Snapshot.vue)

快照管理页面。
- 功能：快照列表表格、生成快照、上传快照（文件选择）、下载快照、还原快照、删除快照

#### [BehaviorTreeEdit.vue](file:///d:/work/vue/vue-base/src/components/BehaviorTree/BehaviorTreeEdit/BehaviorTreeEdit.vue)

**行为树可视化编辑器** — 项目最核心组件（764 行）。

使用 Vue Flow 画布渲染行为树，支持：

- **画布渲染**：递归遍历树数据结构（`traverseTree`），生成 Vue Flow 节点与边
- **节点类型**：通过 `#node-xxx` 插槽注册 11 种节点组件（root/alwaysTrue/ifelse/loopBool/loopNum/selector/sequence/negation/parallel/leaf/null）
- **节点拖拽添加**：从 `BehaviorNodePanel` 拖拽行为节点到画布空节点位置（`onDrop` → `findNearestInRange` → `addBehaviorNode`）
- **节点操作**：选中节点（`nodeClick`）、删除节点（`deleteNode`）、折叠/展开（`collapseExpand`）、左移/右移排序
- **参数编辑**：叶节点参数（int/string/atom/bool）、循环节点参数（次数/布尔值）
- **边线类型切换**：smoothstep/step/bezier/straight + 动画
- **画布控制**：展开全部/收起全部、视图居中、保存行为树
- **数据映射**：`nodeMap` 缓存 Vue Flow 节点 ID 到原始树节点的映射

**核心方法**：

| 方法 | 说明 |
|------|------|
| `getTreeInfo()` | 从后端获取行为树数据与行为节点列表 |
| `init()` | 初始化画布，调用 `traverseTree` |
| `traverseTree(treeNode, level, startX, path, parentId, idx)` | 递归遍历树生成 Vue Flow 节点和边 |
| `addIsUnfoldToTree(node, bool)` | 递归设置所有节点的展开状态 |
| `collapseExpand(NodeId)` | 折叠/展开指定节点 |
| `deleteNode(NodeId)` | 删除节点（替换为 null_node） |
| `leftMove/rightMove(NodeId)` | 子节点排序调整 |
| `addBehaviorNode(BehaviorId, parentId, idx)` | 在空节点位置添加行为节点 |
| `findNearestInRange(list, target, range)` | 查找拖放位置最近的空节点 |
| `resetInit()` | 重置画布并重新渲染 |
| `saveTreee()` | 清理 `isUnfold` 字段后保存到后端 |

#### [BehaviorNodePanel.vue](file:///d:/work/vue/vue-base/src/components/BehaviorTree/BehaviorTreeEdit/BehaviorNodePanel.vue)

节点拖拽面板（固定在画布左侧）。
- 功能：分组折叠/展开、节点搜索、节点拖拽（`dragstart` 设置 `dataTransfer`）
- 行为节点可拖拽到画布空节点位置

#### [NodeSelectInfo.vue](file:///d:/work/vue/vue-base/src/components/BehaviorTree/BehaviorTreeEdit/BehaviorTreeEditChile/NodeSelectInfo.vue)

节点信息面板（固定在画布右侧）。
- 显示选中节点的 ID、类型、描述、模块、函数、参数
- 参数编辑：int → el-input-number、string → el-input、atom → el-input、bool → el-switch
- 操作按钮：左移、右移、展开/收起、删除

#### 节点组件 (nodes/*.vue)

每个节点类型对应一个 Vue 组件，共同特点：
- 使用 Tailwind CSS 样式
- 使用 Vue Flow 的 `Handle` 组件定义连线手柄
- 嵌入 `NodeActionButtons.vue` 提供删除/折叠/参数编辑按钮
- 通过 `$emit` 向父组件传递操作事件

#### [BehaviorTreeLog.vue](file:///d:/work/vue/vue-base/src/components/BehaviorTree/BehaviorTreeLog/BehaviorTreeLog.vue)

**运行日志监控画布** — 与 BehaviorTreeEdit 结构类似，但增加了 WebSocket 实时日志功能。

- **WebSocket 连接**：`ws://192.168.1.192:8426/ws_monitor_logs`
  - `subscribe()`：创建连接，发送注册命令（`{cmd: "register", content: {object_id}}`)
  - 心跳机制：每 30 秒发送 `heartbeat`
  - 自动重连：连接失败 3 秒后重连
  - 消息缓存：循环队列，超过 `msgCacheLength` 时移除最早消息
- **日志展示**：在节点上渲染运行结果（success → 绿色、fail → 红色）
- **日志浏览**：上一条/下一条切换

---

### 5.9 认证与权限

#### [api/userUtils/auth.js](file:///d:/work/vue/vue-base/src/api/userUtils/auth.js)

认证信息的 localStorage 管理层。

| 函数 | 说明 |
|------|------|
| `getAuthToken()` | 获取 token |
| `getAuthUser()` | 获取用户名 |
| `getAuthAlias()` | 获取别名 |
| `setAuthSession({token, username, alias})` | 存储认证信息 |
| `clearAuthSession()` | 清除所有认证信息 |
| `hasAuthSession()` | 判断是否已登录 |
| `getDisplayName()` | 获取显示名（优先别名） |
| `getAuthPermissionKeys()` | 获取权限 key 列表 |
| `setAuthPermissionKeys(keys)` | 存储权限 key 列表（去重） |
| `hasAuthPermission(permissionKey)` | 判断是否拥有某权限 |
| `hasAnyAuthPermission(permissionKeys)` | 判断是否拥有任一权限 |
| `setRememberedUser(username, enabled)` | 记住用户名 |
| `getRememberedUser()` | 获取记住的用户名 |

**localStorage 键名**：
- `auth_token` — 认证 token
- `auth_user` — 用户名
- `auth_alias` — 别名
- `auth_permission_keys` — 权限 key 列表（JSON 数组）
- `remember_user` — 记住的用户名
- `remember_flag` — 记住登录状态标志

#### [api/userUtils/access-control.js](file:///d:/work/vue/vue-base/src/api/userUtils/access-control.js)

权限加载与路由守卫层。

| 函数 | 说明 |
|------|------|
| `getFirstAuthorizedPath()` | 获取用户首个可访问路径（当前固定返回 `/behavior-tree/node-manager`） |
| `refreshAuthPermissions(force)` | 从后端加载用户权限并缓存，`force=true` 强制刷新 |

权限加载流程：
1. 获取当前用户名（无则返回空权限）
2. 检查缓存（非强制且有缓存 → 直接返回）
3. 调用 `acGetUserAccess` 获取用户权限
4. 通过 `normalizePermissionKeys` 标准化为 `resource:action` 格式
5. 存入 localStorage

#### [LoginView.vue](file:///d:/work/vue/vue-base/src/components/LoginView.vue)

登录页面（`<script setup>` Composition API）。
- 表单：账号 + 密码 + 记住账号
- 登录流程：`loginByPassword` → 提取 token → `setAuthSession` → `refreshAuthPermissions(true)` → 跳转
- 已登录用户访问登录页 → 自动跳转 `getFirstAuthorizedPath()`
- 支持 `?redirect=/path` 参数跳转

---

## 6. 关键类与函数说明

### 6.1 行为树节点类型

| 节点类型 | 组件 | 树结构字段 | 说明 |
|---------|------|-----------|------|
| `root` | root.vue | `node` | 根节点，单子节点 |
| `always_true_node` | AlwaysTrueNode.vue | `node` | 永真节点，子节点结果不影响本节点返回 success |
| `ifelse_node` | IfElseNode.vue | `check/success/fail/unknown` | 条件分支，4 个子节点 |
| `loop_bool_node` | LoopBoolNode.vue | `bool, node` | 循环直到结果匹配设定值 |
| `loop_num_node` | LoopNumNode.vue | `num, node` | 循环指定次数 |
| `selector_node` | SelectorNode.vue | `nodes[]` | 选择节点，第一个 success 即停止 |
| `sequence_node` | SequenceNode.vue | `nodes[]` | 顺序节点，第一个 fail 即停止 |
| `negation_node` | NegationNode.vue | `node` | 取反节点 |
| `parallel_node` | ParallelNode.vue | `nodes[]` | 并行节点，最后子节点结果作为返回 |
| `leaf` | LeafNode.vue | `behavior_id, args[]` | 叶节点（行为节点） |
| `null_node` | NullNode.vue | - | 空占位节点 |

### 6.2 核心算法

#### 树遍历算法 (`traverseTree`)

```
输入: treeNode (树节点), level (层级), startX (起始X坐标), path (路径), parentId (父节点ID), idx (子节点索引)
输出: { node: VueFlow节点, nextX: 下一个节点的X坐标 }

流程:
1. 生成唯一 nodeId
2. 根据 isUnfold 决定是否展开子节点
3. 获取子节点列表 (node / nodes[] / ifelse的4个子节点)
4. 如果无子节点 → 创建叶子节点，返回
5. 如果有子节点 → 递归遍历每个子节点，生成边
6. 创建当前节点，X 坐标取子节点范围的中点
7. 缓存到 nodeMap
8. 返回 { node, nextX }
```

#### 拖放添加节点算法 (`onDrop` → `findNearestInRange`)

```
流程:
1. 从 dataTransfer 获取 behavior_id
2. 获取容器偏移量，计算相对坐标
3. 通过 flowMethods.project 转换为画布坐标
4. 在 allNullNode 中查找最近的空节点（范围 50px）
5. 调用 addBehaviorNode 替换空节点为实际节点
```

#### 权限标准化 (`normalizePermissionKeys`)

```
输入: [{resource: "user_manage", access: ["read", "write"]}, ...]
输出: ["user_manage:read", "user_manage:write", ...]

兼容字段: resource/key + access/permission
```

---

## 7. 依赖关系

### 7.1 NPM 依赖树

```
vue@^3.2.13
├── vue-router@^5.0.3
├── pinia@^3.0.4
├── element-plus@^2.13.5
├── @vue-flow/core@^1.48.2
│   ├── @vue-flow/background@^1.3.2
│   ├── @vue-flow/controls@^1.1.3
│   ├── @vue-flow/minimap@^1.5.4
│   └── @vue-flow/additional-components@^1.3.3
├── axios@^1.13.6          (用户中心 API)
├── js-md5@^0.8.3          (密码加密)
├── @antv/x6@^3.1.6        (未使用)
├── @antv/x6-vue-shape@^3.0.2 (未使用)
├── jsplumb@^2.15.6        (未使用)
├── core-js@^3.8.3
tailwindcss@^3.4.19 (dev)
├── postcss@^8.5.8 (dev)
├── autoprefixer@^10.4.27 (dev)
@vue/cli-service@~5.0.0 (dev)
├── @vue/cli-plugin-babel@~5.0.0 (dev)
├── @vue/cli-plugin-eslint@~5.0.0 (dev)
├── eslint@^7.32.0 (dev)
└── eslint-plugin-vue@^8.0.3 (dev)
```

### 7.2 模块依赖关系

```
main.js
  ├── App.vue → router-view
  ├── router/index.js → 所有页面组件
  │   └── utils/authInfoProcessor.js → api/userUtils/index.js + auth.js
  ├── store/node.js (被 BehaviorTreeEdit/Log 引用)
  ├── api/userUtils/userRequest.js (Axios 实例)
  │   └── api/userUtils/auth.js (token 管理)
  ├── api/behavior/behaviorRequest.js (Fetch 封装)
  │   └── api/userUtils/auth.js (token 管理)
  ├── api/behavior/behavior.js → behaviorRequest.js
  ├── api/userUtils/userCenter.js → userRequest.js
  ├── api/userUtils/access-control.js → userCenter.js + auth.js
  ├── api/login/auth.js → userRequest.js + auth.js
  └── utils/permission-utils.js (权限工具)

组件依赖:
  BehaviorTreeEdit.vue
    ├── @vue-flow/core, background, minimap
    ├── store/node.js (节点定义)
    ├── api/behavior/behavior.js (API)
    ├── nodes/*.vue (11 种节点组件)
    │   └── NodeActionButtons.vue
    ├── NodeSelectInfo.vue (节点信息面板)
    └── BehaviorNodePanel.vue (节点拖拽面板)
  
  BehaviorTreeLog.vue
    ├── @vue-flow/core, background
    ├── store/node.js
    ├── api/behavior/behavior.js
    ├── nodes/*.vue (复用编辑器的节点组件)
    └── LogNodeSelectInfo.vue (日志节点信息面板)
  
  UserMenu.vue → api/userUtils/auth.js (权限校验)
  UserManager.vue → api/userUtils/userCenter.js + auth.js + js-md5
  UserRoles.vue → api/userUtils/userCenter.js + utils/permission-utils.js
  UserAuth.vue → api/userUtils/userCenter.js + utils/permission-utils.js
  UserChangePassword.vue → api/userUtils/userCenter.js + auth.js + js-md5
  LoginView.vue → api/login/auth.js + auth.js + access-control.js
```

---

## 8. 项目运行方式

### 8.1 环境要求

- Node.js (推荐 16+)
- npm 或 yarn

### 8.2 安装依赖

```bash
npm install
```

### 8.3 开发模式启动

```bash
npm run serve
```

开发服务器默认运行在 `http://localhost:8080`，使用 Vue CLI 的 devServer 代理将 API 请求转发到后端：

| 代理路径 | 目标 | 用途 |
|---------|------|------|
| `/ac` | `http://127.0.0.1:8267` | 用户中心 API |
| `/login` | `http://127.0.0.1:8267` | 登录 API |
| `/behavior_file` | `http://127.0.0.1:8426` | 快照文件 API |
| `/snapshot` | `http://127.0.0.1:8426` | 快照下载 |
| `/behavior` | `http://127.0.0.1:8426` | 行为节点/树 API |
| `/behavior_tree` | `http://127.0.0.1:8426` | 行为树文件下载 |

**WebSocket 连接**（运行监控）：`ws://192.168.1.192:8426/ws_monitor_logs`（硬编码在 `BehaviorTreeLog.vue` 中）

### 8.4 生产构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录（`outputDir: 'dist'`，`assetsDir: 'static'`）。

### 8.5 代码检查

```bash
npm run lint
```

### 8.6 后端服务依赖

项目需要两个后端服务同时运行：

1. **用户中心服务**（端口 8267）：处理登录、用户/角色/权限管理
2. **行为树服务**（端口 8426）：处理行为节点/树/快照管理，以及 WebSocket 日志推送

---

## 9. 开发约定与注意事项

### 9.1 工程约定

1. **路径别名**：使用 `@/` 映射到 `src/`（配置在 `jsconfig.json`）
2. **组件导入**：Vue CLI 项目中 `.vue` 扩展名可省略；若迁移到 Vite 需显式写出 `.vue`
3. **响应式对象克隆**：Reactive Proxy 对象不能使用 `structuredClone()`，应使用 `JSON.parse(JSON.stringify())`；项目在 `store/node.js` 中统一使用后者
4. **表单布尔字段**：基于数据类型渲染为 `el-switch`
5. **密码加密**：所有密码操作（登录/重置/修改）均在前端 MD5 加密后传输
6. **POST 数据格式**：用户中心 API 使用 `application/x-www-form-urlencoded`（Axios 拦截器自动转换）；行为树 API 使用 `application/json`

### 9.2 已知注意事项

1. **console.warn 被全局拦截**：`main.js` 中重写了 `console.warn`，当前会拦截所有警告（`isDeprecatedWarn` 硬编码为 `true`）
2. **WebSocket 地址硬编码**：`BehaviorTreeLog.vue` 中 WebSocket 地址 `ws://192.168.1.192:8426/ws_monitor_logs` 为硬编码，部署时需修改
3. **未使用的依赖**：`@antv/x6`、`@antv/x6-vue-shape`、`jsplumb` 在 package.json 中声明但源码中未实际使用
4. **权限路由守卫缺失**：路由未配置 `beforeEach` 守卫，权限控制依赖组件内 `hasAuthPermission` 控制 UI 元素显示，直接输入 URL 可绕过前端权限
5. **getFirstAuthorizedPath() 硬编码**：当前固定返回 `/behavior-tree/node-manager`，未实现基于权限的动态路由
6. **NodeSelectInfo.vue 有重复字段**：模板中"节点描述"和"模块"有重复展示（非致命）

### 9.3 编码风格

- **混合 API 风格**：部分组件使用 Options API（BehaviorTreeEdit、MainLayout、NodeManager 等），部分使用 Composition API（LoginView、UserManager、UserRoles 等）
- **中文 UI 文本**：所有界面文本为中文
- **代码注释**：中文注释为主
- **CSS**：Tailwind CSS（节点组件）+ Scoped CSS（页面组件）混合使用
