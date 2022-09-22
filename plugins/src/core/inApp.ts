export interface InAppInboxItem {
  id: number;
  title: string;
  subtitle: string;
  availableFrom: string | null; // Date?
  availableTo: string | null;
  dismissedAt: string | null;
  sentAt: string;
  data: JSON | null;
  isRead: boolean;
  imageUrl: string | null;
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
