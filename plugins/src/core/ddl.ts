export interface DeepLinkContent {
  title?: string;
  description?: string;
}
export interface DeepLinkData {
  data: JSON;
  content: DeepLinkContent;
  url: string;
}
 
export interface DeepLink {
  link: string;
  resolution: DeepLinkResolution;
  data: DeepLinkData;
}

export enum DeepLinkResolution {
  LOOKUP_FAILED = "lookup failed",
  LINK_NOT_FOUND = "link not found",
  LINK_EXPIRED = "link expired",
  LINK_LIMIT_EXCEEDED = "link limit exceeded",
  LINK_MATCHED = "link matched",
}