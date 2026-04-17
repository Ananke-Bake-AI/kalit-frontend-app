declare module "color4bg" {
  export class AestheticFluidBg {
    constructor(params?: Record<string, unknown>)
    destroy(): void
    resize?(): void
    update?(option: string, val: number | string): void
  }

  export class BlurGradientBg {
    constructor(params?: Record<string, unknown>)
    destroy(): void
    resize?(): void
    update?(option: string, val: number | string): void
  }
}
