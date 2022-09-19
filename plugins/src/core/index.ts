import * as cordova from "cordova";
import {
  PushNotificationHandler,
  InAppDeepLinkHandler,
  InAppInboxUpdatedHandler,
  DeepLinkHandler,
} from "./handlers";

export interface OptimoveConfig{
  pushReceivedHandler: PushNotificationHandler | null;
  pushOpenedHandler: PushNotificationHandler | null;
  inAppDeepLinkHandler: InAppDeepLinkHandler | null;
  inAppInboxUpdatedHandler: InAppInboxUpdatedHandler | null;
  deepLinkHandler: DeepLinkHandler | null;
}

let currentConfig: OptimoveConfig = {
  pushReceivedHandler: null,
  pushOpenedHandler: null,
  inAppDeepLinkHandler: null,
  inAppInboxUpdatedHandler: null,
  deepLinkHandler: null,
};
document.addEventListener("deviceready", init, false);
document.addEventListener("resume", resume, false);
document.addEventListener("pause", pause, false);

function init() {
  setContext();
}

function resume() {
  setContext();
}

function pause() {
  clearContext();
}

function setContext() {
  setHandlersCallBackContext().then(
    (successMessage) => {
      console.log(successMessage);
    },
    (errorMessage) => {
      console.error(errorMessage);
    }
  );
}
function clearContext() {
  return new Promise((resolve, reject) => {
    cordova.exec(resolve, reject, "OptimoveSDKPlugin", "clearContext", []);
  });
}

function setHandlersCallBackContext() {
  return new Promise((resolve, reject) => {
    cordova.exec(
      nativeMessageHandler,
      reject,
      "OptimoveSDKPlugin",
      "setHandlersCallBackContext",
      []
    );
  });
}
function checkIfPendingDDLExists() {
  return new Promise((resolve, reject) => {
    cordova.exec(
      nativeMessageHandler,
      reject,
      "OptimoveSDKPlugin",
      "checkIfPendingDDLExists",
      []
    );
  });
}

function checkIfPendingPushExists() {
  return new Promise((resolve, reject) => {
    cordova.exec(
      nativeMessageHandler,
      reject,
      "OptimoveSDKPlugin",
      "checkIfPendingPushExists",
      []
    );
  });
}

function nativeMessageHandler(message: handlerMessage) {
  if (!message) {
    return;
  }

  const handlerName = `${message.type}Handler`;
  if (
    handlerName === "inAppInboxUpdatedHandler" &&
    typeof currentConfig[handlerName] === "function"
  ) {
    currentConfig[handlerName]?.();

    return;
  }

  if (typeof currentConfig[handlerName] === "function") {
    currentConfig[handlerName](message.data);
  } else {
    console.log(`Optimove: No handler defined for '${message.type}' event`);
  }
}

interface InAppInboxItem {
 
    id: number;
    title: string ;
    subtitle:String ;
    availableFrom: string | null;
    availableTo: string | null;
    dismissedAt: string | null;
    readAt: string | null ;
    sentAt: string ;
    data: JSON | null;
    imagePath: string | null;
    isRead: boolean;
}
interface EventParams {
  [key: string]: any;
}
interface InAppInboxSummary {
  totalCount: number;
  unreadCount: number;
}
interface handlerMessage {
  type: string;
  data: JSON;
 }
const Optimove = {
  /**
   * Sets the User ID of the current user and starts the {@code Visitor} to {@code Customer} conversion flow.
   * Note: The user ID must be the same user ID that is passed to Optimove at the daily ETL
   * If you report both the user ID and the email, use {@link Optimove.registerUser(String, String)}
   *
   * @param userId The new userId to set
   */
  setUserId: (userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "setUserId", [userId]);
    });
  },

  /**
   * Attaches an email address to the current user.
   * If you report both the user ID and the email, use {@link Optimove.registerUser(String, String)}
   *
   * @param email the email address to attach
   */
  setUserEmail: (userEmail: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "setUserEmail", [
        userEmail,
      ]);
    });
  },

  /**
   * Reports a custom analytics event
   * @param {string} eventName - the custom event name
   * @param {EventParams} eventParams - optional to add parameters of the event
   */
  reportEvent: (eventName: string, eventParams: EventParams): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "reportEvent", [
        eventName,
        eventParams,
      ]);
    });
  },
  /**
   * Reports a visit in a given screen
   * @param {string} screenName - the screen name
   * @param {string} screenCategory - optional to add a screen category
   */
  reportScreenVisit: (
    screenName: string,
    screenCategory: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "reportScreenVisit", [
        screenName,
        screenCategory,
      ]);
    });
  },
  /**
   * Method that performs both the {@code setUserId} and the {@code setUserEmail} flows from a single call.
   *
   * @param userId The new userId
   * @param email  the email address to attach
   * @see Optimove.setUserId(String)
   * @see Optimove.setUserEmail(String)
   */
  registerUser: (userId: string, userEmail: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "registerUser", [
        userId,
        userEmail,
      ]);
    });
  },
  /**
   *  Returns the visitor id that is associated with the current Optimove installation record
   * @returns {string} visitorId
   */
  getVisitorId: (): Promise<string> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "getVisitorId", []);
    });
  },

  /**
   * Used to register the device installation with FCM to receive push notifications
   */
  pushRegister: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "pushRegister", []);
    });
  },
  /**
   * Opts the user in or out of in-app messaging
   *
   * Note the configured consent strategy in SDK initialization must
   * be set to 'explicit-by-user' otherwise this method throws a runtime
   * exception.
   */
  inAppUpdateConsent: (consented: boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "inAppUpdateConsent", [
        consented,
      ]);
    });
  },
  /**
   * Gets a list of available in-app messages sent to the user and stored in the inbox
   * @returns {Promise<InAppInboxItem[]>} the list of available in-app messages sent to the user and stored in the inbox
   */
  inAppGetInboxItems: (): Promise<InAppInboxItem[]> => {
    return new Promise((resolve, reject) => {
      cordova.exec(
        resolve,
        reject,
        "OptimoveSDKPlugin",
        "inAppGetInboxItems",
        []
      );
    });
  },

  /**
   * Marks all in-app inbox items as read
   */
  inAppMarkAllInboxItemsAsRead: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(
        resolve,
        reject,
        "OptimoveSDKPlugin",
        "inAppMarkAllInboxItemsAsRead",
        []
      );
    });
  },
  /**
   * Mark the specified inAppInboxItem as read
   * @param inAppInboxItem specified inAppInboxItem
   * @returns
   */
  inAppMarkAsRead: (inAppInboxItem: InAppInboxItem): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "inAppMarkAsRead", [
        inAppInboxItem.id,
      ]);
    });
  },
  /**
   * Gets in-app inbox summary, which includes counts for total and unread messages.
   * Promise is rejected if operation fails.
   */
  inAppGetInboxSummary: (): Promise<InAppInboxSummary> => {
    return new Promise((resolve, reject) => {
      cordova.exec(
        resolve,
        reject,
        "OptimoveSDKPlugin",
        "inAppGetInboxSummary",
        []
      );
    });
  },
  /**
   * Presents the given in-app message to the user from the inbox
   * @param {InAppInboxItem} inAppInboxItem the item that holds the message that will be presented
   */
  inAppPresentInboxMessage: (inAppInboxItem: InAppInboxItem): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(
        resolve,
        reject,
        "OptimoveSDKPlugin",
        "inAppPresentInboxMessage",
        [inAppInboxItem.id]
      );
    });
  },
  /**
   * Deletes a specified inAppInboxItem from inbox
   * @param inAppInboxItem the item to be deleted
   */
  inAppDeleteMessageFromInbox: (
    inAppInboxItem: InAppInboxItem
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(
        resolve,
        reject,
        "OptimoveSDKPlugin",
        "inAppDeleteMessageFromInbox",
        [inAppInboxItem.id]
      );
    });
  },
  /**
   * Sets inboxUpdated event handler
   * @param {InAppInboxUpdatedHandler} inboxUpdatedHandler - inbox updated event handler
   */
  setOnInboxUpdatedHandler: (
    inboxUpdatedHandler: InAppInboxUpdatedHandler
  ): void => {
    currentConfig["inAppInboxUpdatedHandler"] = inboxUpdatedHandler;
  },
  /**
   * Sets push opened event handler
   * @param {PushNotificationHandler} pushOpenedHandler - push opened event handler
   */
  setPushOpenedHandler(pushOpenedHandler: PushNotificationHandler) {
    currentConfig["pushOpenedHandler"] = pushOpenedHandler;
    if (pushOpenedHandler != null) {
      checkIfPendingPushExists();
    }
  },
  /**
   * Sets push received event handler
   * @param {PushNotificationHandler} pushReceivedHandler - push received event handler
   */
  setPushReceivedHandler(pushReceivedHandler: PushNotificationHandler) {
    currentConfig["pushReceivedHandler"] = pushReceivedHandler;
  },
  /**
   * Sets in app deep link event handler
   * @param {InAppDeepLinkHandler} inAppDeepLinkHandler - in app deep link event handler
   */
  setInAppDeepLinkHandler(inAppDeepLinkHandler: InAppDeepLinkHandler) {
    currentConfig["inAppDeepLinkHandler"] = inAppDeepLinkHandler;
  },
  /**
   * Sets deep link event handler
   * @param {DeepLinkHandler} deepLinkHandler - deep link event handler
   */
  setDeepLinkHandler(deepLinkHandler: DeepLinkHandler) {
    currentConfig["deepLinkHandler"] = deepLinkHandler;
    checkIfPendingDDLExists();
  },
};
export default Optimove;