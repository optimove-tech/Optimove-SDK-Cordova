export interface InAppInboxItem {
  id: number;
  title: string;
  subtitle: string;
  availableFrom: Date | null;
  availableTo: Date | null;
  dismissedAt: Date | null;
  sentAt: Date;
  data: { [key: string]: any } | null;
  isRead: boolean;
  imageUrl: string | null;
}

export interface InAppInboxSummary {
  totalCount: number;
  unreadCount: number;
}

export interface InAppButtonPress {
  deepLinkData: { [key: string]: any };
  messageId: number;
  messageData: { [key: string]: any } | null;
}

export interface InAppInboxItemRaw {
  id: number;
  title: string;
  subtitle: string;
  availableFrom: string | null;
  availableTo: string | null;
  dismissedAt: string | null;
  sentAt: string;
  data: { [key: string]: any } | null;
  isRead: boolean;
  imageUrl: string | null;
}