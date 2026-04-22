import type { AxiosInstance } from 'axios'

declare module '#app' {
  interface NuxtApp {
    $api: {
      public: AxiosInstance
      auth: AxiosInstance
    }
  }
}

export {}
