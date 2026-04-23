import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (message: string, params?: Record<string, unknown>) => string
    $router: Router
    $route: RouteLocationNormalizedLoaded
  }
}

export {}
