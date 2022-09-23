export interface DeepLinkContent {
    title?: string;
    description?: string;
}
export interface DeepLinkData {
    data: Record<string, any>;
    content: DeepLinkContent;
    url: string;
}
export interface DeepLink {
    link: string;
    resolution: DeepLinkResolution;
    data: DeepLinkData;
}
export declare enum DeepLinkResolution {
    LOOKUP_FAILED = "LOOKUP_FAILED",
    LINK_NOT_FOUND = "LINK_NOT_FOUND",
    LINK_EXPIRED = "LINK_EXPIRED",
    LINK_LIMIT_EXCEEDED = "LINK_LIMIT_EXCEEDED",
    LINK_MATCHED = "LINK_MATCHED"
}
