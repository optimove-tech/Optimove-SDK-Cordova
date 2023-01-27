import { DeepLinkHandler, InAppDeepLinkHandler, InAppInboxUpdatedHandler, PushNotificationHandler } from "./handlers";
import { InAppInboxItem, InAppInboxSummary } from "./inApp";
export interface OptimoveConfig {
    pushReceivedHandler: PushNotificationHandler | null;
    pushOpenedHandler: PushNotificationHandler | null;
    inAppDeepLinkHandler: InAppDeepLinkHandler | null;
    inAppInboxUpdatedHandler: InAppInboxUpdatedHandler | null;
    deepLinkHandler: DeepLinkHandler | null;
}
declare const Optimove: {
    /**
     * Sets the User ID of the current user.
     * Note: The user ID must be the same user ID that is passed to Optimove at the daily ETL
     * If you report both the user ID and the email, use {@link Optimove.registerUser(String, String)}
     *
     * @param userId The new userId to set
     */
    setUserId: (userId: string) => Promise<void>;
    /**
     * Attaches an email address to the current user.
     * If you report both the user ID and the email, use {@link Optimove.registerUser(String, String)}
     *
     * @param email the email address to attach
     */
    setUserEmail: (userEmail: string) => Promise<void>;
    /**
     * Reports a custom analytics event
     * @param {string} eventName - the custom event name
     * @param {Record<string,any>} eventParams - optional to add parameters of the event
     */
    reportEvent: (eventName: string, eventParams: Record<string, any> | null) => Promise<void>;
    /**
     * Reports a visit in a given screen
     * @param {string} screenName - the screen name
     * @param {string} screenCategory - optional to add a screen category
     */
    reportScreenVisit: (screenName: string, screenCategory?: string) => Promise<void>;
    /**
     * Method that performs both the {setUserId} and the {setUserEmail} flows from a single call.
     *
     * @param userId The new userId
     * @param email  the email address to attach
     * @see Optimove.setUserId(String)
     * @see Optimove.setUserEmail(String)
     */
    registerUser: (userId: string, userEmail: string) => Promise<void>;
    /**
     *  Returns the visitor id that is associated with the current Optimove installation record
     * @returns {string} visitorId
     */
    getVisitorId: () => Promise<string>;
    /**
     * Clears the user id, undoing the last setUserId call
     */
    signOutUser: () => Promise<void>;
    /**
     * Used to register the device installation with FCM to receive push notifications
     */
    pushRegister: () => Promise<void>;
    /**
     * Used to unregister the current installation from receiving push notifications
     */
    pushUnregister: () => Promise<void>;
    /**
     * Opts the user in or out of in-app messaging
     *
     * Note the configured consent strategy in SDK initialization must
     * be set to 'explicit-by-user' otherwise this method throws a runtime
     * exception.
     */
    inAppUpdateConsent: (consented: boolean) => Promise<void>;
    /**
     * Gets a list of available in-app messages sent to the user and stored in the inbox
     * @returns {Promise<InAppInboxItem[]>} the list of available in-app messages sent to the user and stored in the inbox
     */
    inAppGetInboxItems: () => Promise<InAppInboxItem[]>;
    /**
     * Marks all in-app inbox items as read
     */
    inAppMarkAllInboxItemsAsRead: () => Promise<void>;
    /**
     * Mark the specified inAppInboxItem as read
     * @param inAppInboxItem specified inAppInboxItem
     * @returns
     */
    inAppMarkAsRead: (inAppInboxItem: InAppInboxItem) => Promise<void>;
    /**
     * Gets in-app inbox summary, which includes counts for total and unread messages.
     * Promise is rejected if operation fails.
     */
    inAppGetInboxSummary: () => Promise<InAppInboxSummary>;
    /**
     * Presents the given in-app message to the user from the inbox
     * @param {InAppInboxItem} inAppInboxItem the item that holds the message that will be presented
     */
    inAppPresentInboxMessage: (inAppInboxItem: InAppInboxItem) => Promise<void>;
    /**
     * Deletes a specified inAppInboxItem from inbox
     * @param inAppInboxItem the item to be deleted
     */
    inAppDeleteMessageFromInbox: (inAppInboxItem: InAppInboxItem) => Promise<void>;
    /**
     * Sets inboxUpdated event handler
     * @param {InAppInboxUpdatedHandler} inboxUpdatedHandler - inbox updated event handler
     */
    setOnInboxUpdatedHandler: (inboxUpdatedHandler: InAppInboxUpdatedHandler) => void;
    /**
     * Sets push opened event handler
     * @param {PushNotificationHandler} pushOpenedHandler - push opened event handler
     */
    setPushOpenedHandler(pushOpenedHandler: PushNotificationHandler): void;
    /**
     * Sets push received event handler
     * @param {PushNotificationHandler} pushReceivedHandler - push received event handler
     */
    setPushReceivedHandler(pushReceivedHandler: PushNotificationHandler): void;
    /**
     * Sets in app deep link event handler
     * @param {InAppDeepLinkHandler} inAppDeepLinkHandler - in app deep link event handler
     */
    setInAppDeepLinkHandler(inAppDeepLinkHandler: InAppDeepLinkHandler): void;
    /**
     * Sets deep link event handler
     * @param {DeepLinkHandler} deepLinkHandler - deep link event handler
     */
    setDeepLinkHandler(deepLinkHandler: DeepLinkHandler): void;
};
export default Optimove;
