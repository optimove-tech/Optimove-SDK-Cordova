export interface InAppInboxItem {
    id: number;
    title: string;
    subtitle: string;
    availableFrom: Date | null;
    availableTo: Date | null;
    dismissedAt: Date | null;
    sentAt: Date;
    data: Record<string, any> | null;
    isRead: boolean;
    imageUrl: string | null;
}
export interface InAppInboxSummary {
    totalCount: number;
    unreadCount: number;
}
export interface InAppButtonPress {
    deepLinkData: Record<string, any>;
    messageId: number;
    messageData: Record<string, any> | null;
}
export declare enum OptimoveInAppPresentationResult {
    FAILED = 0,
    EXPIRED = 1,
    PRESENTED = 2
}
export interface InAppInboxItemRaw {
    id: number;
    title: string;
    subtitle: string;
    availableFrom: string | null;
    availableTo: string | null;
    dismissedAt: string | null;
    sentAt: string;
    data: Record<string, any> | null;
    isRead: boolean;
    imageUrl: string | null;
}
