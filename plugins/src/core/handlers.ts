import { PushNotification } from './push'
import { DeepLink } from './ddl';
export interface PushNotificationHandler {
    (notification: PushNotification): void;
}

export interface InAppDeepLinkHandler { 
    (data: { [key: string]: any }): void;
}

export interface InAppInboxUpdatedHandler {
    (): void;
}
 
export interface DeepLinkHandler {
    (deepLink: DeepLink) : void
 }