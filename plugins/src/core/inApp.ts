export interface InAppInboxItem {
  id: number;
  title: string;
  subtitle: string;
  availableFrom: Date | null;
  availableTo: Date | null;
  dismissedAt: Date | null;
  sentAt: Date;
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

export interface InAppInboxItemRaw {
  id: number;
  title: string;
  subtitle: string;
  availableFrom: string | null;
  availableTo: string | null;
  dismissedAt: string | null;
  sentAt: string;
  data: JSON | null;
  isRead: boolean;
  imageUrl: string | null;
}