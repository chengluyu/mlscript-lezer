declare module "*.grammar" {
  import { LRParser } from "lezer";
  export const parser: LRParser;
}