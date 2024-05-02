declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
  declare const DEX_ABI: AbiItem;
  declare const STACKING_ABI: AbiItem;