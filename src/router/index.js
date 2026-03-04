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

// 用户中心路由
import UserCenterMenu from '../components/UserCenter/UserMenu.vue'
import UserManager from '../components/UserCenter/MenuChile/UserManager.vue'
import UserChangePassword from '../components/UserCenter/MenuChile/UserChangePassword.vue'
import UserAuth from '../components/UserCenter/MenuChile/UserAuth.vue'
import UserRoles from '../components/UserCenter/MenuChile/UserRoles.vue'


const routes = [
  {
    path: '/user-center',
    name: 'UserCenter',
    component: MainLayout,
    redirect: '/user-center/users',
    children: [
      {
        path: '',
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
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/config',
    children: [
      {
        path: 'config',
        name: 'config',
        component: MenuIndex,
        redirect: '/config/blank',
        children: [
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