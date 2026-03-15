declare module "*.png" {
  const value: string | { src: string; height: number; width: number };
  export default value;
}

declare module "*.jpg" {
  const value: { src: string; height: number; width: number };
  export default value;
}

declare module "*.jpeg" {
  const value: { src: string; height: number; width: number };
  export default value;
}

declare module "*.webp" {
  const value: { src: string; height: number; width: number };
  export default value;
}
