import { handleAuthInfoFromUrl } from '@/utils/authInfoProcessor'
handleAuthInfoFromUrl()

import { createRouter, createWebHashHistory } from 'vue-router'

import MainLayout from '../components/MainLayout.vue'

// 配置路由
import MenuIndex from '../components/ConfigVue/MenuIndex.vue'
import BlankConfig from '../components/ConfigVue/MenuChile/BlankConfig.vue'
import PlanConfig from '../components/ConfigVue/MenuChile/PlanConfig.vue'
import ResultConfig from '../components/ConfigVue/MenuChile/ResultConfig.vue'
import MeterConfig from '../components/ConfigVue/MenuChile/MeterConfig.vue'
import AllMeterConfig from '../components/ConfigVue/MenuChile/AllMeterConfig.vue'
import AllStationConfig from '../components/ConfigVue/MenuChile/AllStationConfig.vue'
import VueTestTemp from '../components/ConfigVue/MenuChile/VueTestTemp.vue'
import WebWsConfig from '../components/ConfigVue/MenuChile/WebWsConfig.vue'
import WebTempConfig from '../components/ConfigVue/MenuChile/WebTempConfig.vue'
import LogConfig from '../components/ConfigVue/MenuChile/LogConfig.vue'

// 用户中心路由
import UserCenterMenu from '../components/UserCenter/UserMenu.vue'
import UserManager from '../components/UserCenter/MenuChile/UserManager.vue'
import UserChangePassword from '../components/UserCenter/MenuChile/UserChangePassword.vue'
import UserAuth from '../components/UserCenter/MenuChile/UserAuth.vue'
import UserRoles from '../components/UserCenter/MenuChile/UserRoles.vue'

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
    redirect: '/config',
    children: [
      {
        path: '403',
        name: 'Forbidden',
        component: ForbiddenView,
        meta: { title: '无权限' }
      },
      {
        path: 'config',
        name: 'config',
        component: MenuIndex,
        redirect: '/config/plan',
        children: [
          {
            path: 'changelog',
            name: 'Changelog',
            component: BlankConfig
          },
          {
            path: 'template-config',
            name: 'TemplateConfig',
            component: BlankConfig
          },
          {
            path: 'template-config-versions',
            name: 'TemplateConfigVersions',
            component: BlankConfig
          },
          {
            path: 'blank',
            name: 'Blank',
            component: BlankConfig
          },
          {
            path: 'plan',
            name: 'Plan',
            component: PlanConfig
          },
          {
            path: 'result',
            name: 'Result',
            component: ResultConfig
          },
          {
            path: 'meter',
            name: 'Meter',
            component: MeterConfig
          },
          {
            path: 'meter/:id',
            name: 'MeterEdit',
            component: MeterConfig,
            props: true
          },
          {
            path: 'all-meter',
            name: 'AllMeter',
            component: AllMeterConfig
          },
          {
            path: 'all-station',
            name: 'AllStation',
            component: AllStationConfig
          },
          {
            path: 'vue-test-temp',
            name: 'VueTestTemp',
            component: VueTestTemp
          },
          {
            path: 'measure-web-ws',
            name: 'MeasureWebWs',
            component: WebWsConfig
          },
          {
            path: 'measure-web-temp',
            name: 'MeasureWebTemp',
            component: WebTempConfig
          },
          {
            path: 'logs',
            name: 'Logs',
            component: LogConfig
          }
        ]
      },
      {
        path: 'custom-submenu',
        name: 'CustomSubmenu',
        component: MenuIndex,
        redirect: '/custom-submenu/measure-manage',
        children: [
          {
            path: 'measure-manage',
            name: 'MeasureManage',
            component: BlankConfig
          },
          {
            path: 'batch-operator',
            name: 'BatchOperator',
            component: BlankConfig
          },
          {
            path: 'measure-control',
            name: 'MeasureControl',
            component: BlankConfig
          },
          {
            path: 'history-data-splitpanes',
            name: 'HistoryDataSplitpanes',
            component: BlankConfig
          },
          {
            path: 'behavior-tree-manage',
            name: 'BehaviorTreeManage',
            component: BlankConfig
          },
          {
            path: 'server-control',
            name: 'ServerControl',
            component: BlankConfig
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