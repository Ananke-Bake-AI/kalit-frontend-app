declare module "*.module.scss" {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare const process: {
  readonly env: Record<string, string | undefined>
}
