import {
  DeepLinkHandler,
  InAppDeepLinkHandler,
  InAppInboxUpdatedHandler,
  PushNotificationHandler,
} from "./handlers";
import { InAppInboxItem, InAppInboxItemRaw, InAppInboxSummary, OptimoveInAppPresentationResult } from "./inApp";

import cordova from "cordova";

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
  let checkForPendingPush: boolean = currentConfig["pushOpenedHandler"] !== null;
  let checkForPendingDDL: boolean = currentConfig["deepLinkHandler"] !== null;

  return new Promise((resolve, reject) => {
    cordova.exec(
      nativeMessageHandler,
      reject,
      "OptimoveSDKPlugin",
      "setHandlersCallBackContext",
      [checkForPendingPush, checkForPendingDDL]
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

function nativeMessageHandler(message : HandlerMessage | string) {
  if (!message || typeof message === 'string') {
    return;
  }
  const handlerName = `${message.type}Handler`;
  if (
    handlerName === "inAppInboxUpdatedHandler") {
    currentConfig[handlerName]?.();
    return;
  }

  if (currentConfig[handlerName] !== null) {
    currentConfig[handlerName](message.data);
  } else {
    console.log(`Optimove: No handler defined for '${message.type}' event`);
  }
}

function isNonEmptyString(val: string) {
  return typeof val === "string" && val !== "";
}

interface HandlerMessage {
  type: string;
  data: Record<string,any>
 }
const Optimove = {
  /**
   * Used in case a delayed initialization is needed
   * @param optimoveCredentials Optimove credentials
   * @param optimobileCredentials Optimobile credentials
   */
  setCredentials: (optimoveCredentials?: string, optimobileCredentials?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isNonEmptyString(optimoveCredentials) && !isNonEmptyString(optimobileCredentials)) {
        reject("Invalid credentials");
        return;
      }

      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "setCredentials", [
        optimoveCredentials,
        optimobileCredentials
      ]);
    });
  },
  /**
   * Sets the User ID of the current user.
   * Note: The user ID must be the same user ID that is passed to Optimove at the daily ETL
   * If you report both the user ID and the email, use {@link Optimove.registerUser(String, String)}
   *
   * @param userId The new userId to set
   */
  setUserId: (userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isNonEmptyString(userId)){
        reject("Invalid user id");
        return;
      }
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
      if (!isNonEmptyString(userEmail)) {
        reject("Invalid user email");
        return;
      }

      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "setUserEmail", [
        userEmail,
      ]);
    });
  },

  /**
   * Reports a custom analytics event
   * @param {string} eventName - the custom event name
   * @param {Record<string,any>} eventParams - optional to add parameters of the event
   */
  reportEvent: (eventName: string, eventParams: Record<string,any> | null): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isNonEmptyString(eventName)) {
        reject("Invalid event name");
        return;
      }

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
    screenCategory?: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isNonEmptyString(screenName)) {
        reject("Invalid screen name");
        return;
      }

      if (screenCategory !== undefined && !isNonEmptyString(screenName)){
        reject("Invalid screen category");
        return;
      }

      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "reportScreenVisit", [
        screenName,
        screenCategory,
      ]);
    });
  },
  /**
   * Method that performs both the {setUserId} and the {setUserEmail} flows from a single call.
   *
   * @param userId The new userId
   * @param email  the email address to attach
   * @see Optimove.setUserId(String)
   * @see Optimove.setUserEmail(String)
   */
  registerUser: (userId: string, userEmail: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isNonEmptyString(userId)) {
        reject("Invalid user id");
        return;
      }

      if (!isNonEmptyString(userEmail)) {
        reject("Invalid user user email");
        return;
      }

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
   * Clears the user id, undoing the last setUserId call
   */
  signOutUser: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "signOutUser", []);
    });
  },

  /**
   * Used to register the device installation with FCM to receive push notifications. Prompts a notification permission request
   */
  pushRequestDeviceToken: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "pushRequestDeviceToken", []);
    });
  },

  /**
   * Used to unregister the current installation from receiving push notifications
   */
  pushUnregister: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, "OptimoveSDKPlugin", "pushUnregister", []);
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
    }).then((rawItems: InAppInboxItemRaw[]) =>
        rawItems.map((rawItem: InAppInboxItemRaw) => (
          {
            id: rawItem.id,
            title: rawItem.title,
            subtitle: rawItem.subtitle,
            availableFrom: rawItem.availableFrom === null ? null : new Date(rawItem.availableFrom),
            availableTo: rawItem.availableFrom === null ? null : new Date(rawItem.availableTo),
            dismissedAt: rawItem.availableFrom === null ? null : new Date(rawItem.dismissedAt),
            sentAt: new Date(rawItem.sentAt),
            data: rawItem.data,
            isRead: rawItem.isRead,
            imageUrl: rawItem.imageUrl,
          })
        )
    );

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
  inAppPresentInboxMessage: (inAppInboxItem: InAppInboxItem): Promise<OptimoveInAppPresentationResult> => {
    return new Promise((resolve, reject) => {
      cordova.exec(
        resolve,
        reject,
        "OptimoveSDKPlugin",
        "inAppPresentInboxMessage",
        [inAppInboxItem.id]
      );
    })
    .then((result: number) => {
      const convertedResult: OptimoveInAppPresentationResult = result;
      switch(convertedResult){
        case OptimoveInAppPresentationResult.PRESENTED:
        case OptimoveInAppPresentationResult.EXPIRED:
        case OptimoveInAppPresentationResult.FAILED:
          return result;
        default:
          console.error("Unknown presentation result");
          return OptimoveInAppPresentationResult.FAILED;
      }
    })

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