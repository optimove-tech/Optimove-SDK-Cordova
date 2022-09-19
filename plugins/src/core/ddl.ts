interface DeepLinkContent {
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
  resolution: string;
  data: DeepLinkData;
}
