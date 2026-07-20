declare module "country-list" {
  export function getData(): {
    code: string;
    name: string;
  }[];
}