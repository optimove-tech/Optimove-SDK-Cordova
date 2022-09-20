export interface InAppInboxItem {
    id: number;
    title: string;
    subtitle: String;
    availableFrom: string | null;
    availableTo: string | null;
    dismissedAt: string | null;
    readAt: string | null;
    sentAt: string;
    data: JSON | null;
    imagePath: string | null;
    isRead: boolean;
}
export interface InAppInboxSummary {
    totalCount: number;
    unreadCount: number;
}
export interface InAppButtonPress {
    deepLinkData: JSON;
    messageId: number;
    messageData: JSON | null;
}
