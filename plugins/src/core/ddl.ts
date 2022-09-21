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
  LOOKUP_FAILED,
  LINK_NOT_FOUND,
  LINK_EXPIRED,
  LINK_LIMIT_EXCEEDED,
  LINK_MATCHED,
}