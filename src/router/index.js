import { handleAuthInfoFromUrl } from '@/utils/authInfoProcessor'
handleAuthInfoFromUrl()

import { createRouter, createWebHashHistory } from 'vue-router'

import MainLayout from '../components/MainLayout.vue'


// 用户中心路由
import UserCenterMenu from '../components/UserCenter/UserMenu.vue'
import UserManager from '../components/UserCenter/MenuChile/UserManager.vue'
import UserChangePassword from '../components/UserCenter/MenuChile/UserChangePassword.vue'
import UserAuth from '../components/UserCenter/MenuChile/UserAuth.vue'
import UserRoles from '../components/UserCenter/MenuChile/UserRoles.vue'

// 任务管理路由
import TaskManagerMenu from '../components/TaskManager/TaskMenu.vue'
import BlankConfig from '../components/BlankConfig.vue'
import TaskManager from '../components/TaskManager/TaskChild/TaskManager.vue'
import ConfigManager from '../components/TaskManager/TaskChild/ConfigManager.vue'
import FileManager from '../components/TaskManager/TaskChild/FileManager.vue'
// 系统说明路由
import SystemDescriptionMenu from '../components/TaskManager/SystemDescription/SystemDescriptionMenu.vue'



//登录路由
import Login from '../components/LoginView.vue'

// 无权限路由
import ForbiddenView from '../components/ForbiddenView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/task-manager',
    children: [
      {
        path: '403',
        name: 'Forbidden',
        component: ForbiddenView,
        meta: { title: '无权限' }
      },
      {
        path: 'task-manager',
        name: 'TaskManagerMenu',
        component: TaskManagerMenu,
        redirect: '/task-manager/taskManager',
        children: [
          {
            path: 'taskManager',
            name: 'TaskManager',
            component: TaskManager
          },
          {
            path: 'configManager',
            name: 'ConfigManager',
            component: ConfigManager
          },
          {
            path: 'fileManager',
            name: 'FileManager',
            component: FileManager
          },
          {
            path: 'pluginManager',
            name: 'PluginManager',
            component: BlankConfig
          },
        ]
      },
      {
        path: 'system-description',
        name: 'SystemDescriptionMenu',
        component: TaskManagerMenu,
        redirect: '/system-description/systemDescription',
        children: [
          {
            path: 'systemDescription',
            name: 'SystemDescription',
            component: SystemDescriptionMenu
          },
        ]
      },
      {
        path: 'user-center',
        name: 'UserCenterMenu',
        component: UserCenterMenu,
        redirect: '/user-center/users',
        children: [
          {
            path: 'users',
            name: 'UserManager',
            component: UserManager
          },
          {
            path: 'change-password',
            name: 'UserChangePassword',
            component: UserChangePassword
          },
          {
            path: 'auth',
            name: 'UserAuth',
            component: UserAuth
          },
          {
            path: 'roles',
            name: 'UserRoles',
            component: UserRoles
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router