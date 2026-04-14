declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (message: string, params?: Record<string, unknown>) => string
  }
}

export {}
