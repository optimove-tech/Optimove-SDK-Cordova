import { PushNotification } from "./push";
import { DeepLink } from "./ddl";
import { InAppButtonPress } from "./inApp";
export interface PushNotificationHandler {
    (notification: PushNotification): void;
}
export interface InAppDeepLinkHandler {
    (data: InAppButtonPress): void;
}
export interface InAppInboxUpdatedHandler {
    (): void;
}
export interface DeepLinkHandler {
    (deepLink: DeepLink): void;
}
