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
export declare enum DeepLinkResolution {
    LOOKUP_FAILED = 0,
    LINK_NOT_FOUND = 1,
    LINK_EXPIRED = 2,
    LINK_LIMIT_EXCEEDED = 3,
    LINK_MATCHED = 4
}
