import { createRouter, createWebHashHistory } from 'vue-router'
import BlankConfig from '../components/BlankConfig.vue'
import PlanConfig from '../components/PlanConfig.vue'
import ResultConfig from '../components/ResultConfig.vue'
import MeterConfig from '../components/MeterConfig.vue'
import AllMeterConfig from '../components/AllMeterConfig.vue'
import AllStationConfig from '../components/AllStationConfig.vue'
import VueTestTemp from '../components/VueTestTemp.vue'

const routes = [
  {
    path: '/',
    redirect: '/blank'
  },
  {
    path: '/blank',
    name: 'Blank',
    component: BlankConfig
  },
  {
    path: '/plan',
    name: 'Plan',
    component: PlanConfig
  },
  {
    path: '/result',
    name: 'Result',
    component: ResultConfig
  },
  {
    path: '/meter',
    name: 'Meter',
    component: MeterConfig
  },
  {
    path: '/meter/:id',
    name: 'MeterEdit',
    component: MeterConfig,
    props: true
  },
  {
    path: '/all-meter',
    name: 'AllMeter',
    component: AllMeterConfig
  },
  {
    path: '/all-station',
    name: 'AllStation',
    component: AllStationConfig
  },
  {
    path: '/vue-test-temp',
    name: 'VueTestTemp',
    component: VueTestTemp
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router