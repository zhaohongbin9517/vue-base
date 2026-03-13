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

//登录路由
import Login from '../components/LoginView.vue'

// 无权限路由
import ForbiddenView from '../components/ForbiddenView.vue'

// 行为树路由
import BehaviorTreeMenu from '../components/BehaviorTree/BehaviorTreeMenu.vue'
import Snapshot from '../components/BehaviorTree/BTChild/Snapshot.vue'
// import VueTestTemp from '../components/BehaviorTree/BTChild/VueTestTemp.vue'
import NodeManager from '../components/BehaviorTree/BTChild/NodeManager.vue'
import BehaviorTreeManager from '../components/BehaviorTree/BTChild/BehaviorTreeManager.vue'
import BehaviorTreeEdit from '../components/BehaviorTree/BehaviorTreeEdit.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/user-center',
    children: [
      {
        path: '403',
        name: 'Forbidden',
        component: ForbiddenView,
        meta: { title: '无权限' }
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
      },
      // 行为树路由
      {
        path: 'behavior-tree',
        name: 'BehaviorTreeMenu',
        component: BehaviorTreeMenu,
        redirect: '/behavior-tree/node-manager',
        children: [
          {
            path: 'node-manager',
            name: 'NodeManager',
            component: NodeManager
          },
          {
            path: 'tree-manager',
            name: 'BehaviorTreeManager',
            component: BehaviorTreeManager
          },
          {
            path: 'edit-tree',
            name: 'BehaviorTreeEdit',
            component: BehaviorTreeEdit
          },
          {
            path: 'Snapshot',
            name: 'Snapshot',
            component: Snapshot
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