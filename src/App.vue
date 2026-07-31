<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="editorial-page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>


<style>
#app {
  font-family: var(--font-serif);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--ink-2);
}

/* —— 页面切换过渡 —— */
.editorial-page-enter-active,
.editorial-page-leave-active {
  transition: opacity 320ms var(--ease), transform 320ms var(--ease);
}
.editorial-page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.editorial-page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
