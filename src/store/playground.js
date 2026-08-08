import { defineStore } from 'pinia'


export const usePlaygroundStore = defineStore('playgroundStore', {
  state: () => ({
    currentType: 'root',
  }),
  getters: {
    a_currentType: (state) => state.currentType,
  },
  actions: {
    setCurrentType(type) {
      this.currentType = type
    },
    getCurrentType() {
      return this.currentType
    }
  },
})
