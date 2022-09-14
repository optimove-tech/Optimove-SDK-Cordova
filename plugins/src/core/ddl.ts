
interface DeepLinkContent { 
    title?: string;
    description?: string;
}

export interface DeepLink { 
    content: DeepLinkContent;
    data: any;
    url: string;
}