
var currentConfig = {
  pushReceivedHandler: null, //function that receives one argument, a push message object
  pushOpenedHandler: null, //function that receives one argument, a push message object
  inAppDeepLinkHandler: null, //expect to be a function that receives one argument, a deepLink data object
  inAppInboxUpdatedHandler: null,
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
    exec(resolve, reject, "OptimoveSDKPlugin", "clearContext", []);
  });
}

function setHandlersCallBackContext() {
  return new Promise((resolve, reject) => {
    exec(
      nativeMessageHandler,
      reject,
      "OptimoveSDKPlugin",
      "setHandlersCallBackContext",
      []
    );
  });
}

function checkIfPendingPushExists() {
  return new Promise((resolve, reject) => {
    exec(
      nativeMessageHandler,
      reject,
      "OptimoveSDKPlugin",
      "checkIfPendingPushExists",
      []
    );
  });
}

function nativeMessageHandler(message) {
  if (!message || typeof message === "string") {
    return;
  }

  const handlerName = `${message.type}Handler`;
  if (
    handlerName === "inAppInboxUpdatedHandler" &&
    typeof inAppInboxUpdatedHandler === "function"
  ) {
    currentConfig[handlerName]();
    return;
  }

  if (isFunction(currentConfig[handlerName])) {
    currentConfig[handlerName](message.data);
  } else {
    console.log(`Optimove: No handler defined for '${message.type}' event`);
  }
}

const Optimove = {
    setUserId: function (userId) {
        return new Promise((resolve, reject) => {
            if (!isNonEmptyString(userId)) {
                reject("Invalid user id");
                return;
            }
            exec(resolve, reject, "OptimoveSDKPlugin", "setUserId", [userId]);
        });
    },

    setUserEmail: function (userEmail) {
        return new Promise((resolve, reject) => {
            if (!isNonEmptyString(userEmail)) {
                reject("Invalid user email");
                return;
            }
            exec(resolve, reject, "OptimoveSDKPlugin", "setUserEmail", [userEmail]);
        });
    },

    /* eventParams is nullable*/
    reportEvent: function (eventName, eventParams) {
        return new Promise((resolve, reject) => {
            if (!isNonEmptyString(eventName)) {
                reject("Invalid event name");
                return;
            }
            exec(resolve, reject, "OptimoveSDKPlugin", "reportEvent", [
                eventName,
                eventParams,
            ]);
        });
    },

    /* screenCategory parameter is nullable*/
    reportScreenVisit: function (screenName, screenCategory) {
        return new Promise((resolve, reject) => {
            if (!isNonEmptyString(screenName)) {
                reject("Invalid screen name");
                return;
            }
            exec(resolve, reject, "OptimoveSDKPlugin", "reportScreenVisit", [
                screenName,
                screenCategory,
            ]);
        });
    },

    registerUser: function (userId, userEmail) {
        return new Promise((resolve, reject) => {
            var invalidRegister = false;
            if (!isNonEmptyString(userId)) {
                reject("Invalid user id");
                invalidRegister = true;
            }
            if (!isNonEmptyString(userEmail)) {
                reject("Invalid user email");
                invalidRegister = true;
            }
            if (invalidRegister) {
                return;
            }

            exec(resolve, reject, "OptimoveSDKPlugin", "registerUser", [
                userId,
                userEmail,
            ]);
        });
    },

    getVisitorId: function () {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, "OptimoveSDKPlugin", "getVisitorId", []);
        });
    },

    pushRegister: function () {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, "OptimoveSDKPlugin", "pushRegister", []);
        });
    },

    updateConsentForUser: function (consented) {
        return new Promise((resolve, reject) => {
            if (typeof consented !== "boolean") {
                reject("Invalid Consent value");
                return;
            }
            exec(resolve, reject, "OptimoveSDKPlugin", "updateConsentForUser", [
                consented,
            ]);
        });
    },

    inAppGetInboxItems: function () {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, "OptimoveSDKPlugin", "inAppGetInboxItems", []);
        });
    },
    inAppMarkAllInboxItemsAsRead: function () {
        return new Promise((resolve, reject) => {
            exec(
                resolve,
                reject,
                "OptimoveSDKPlugin",
                "inAppMarkAllInboxItemsAsRead",
                []
            );
        });
    },
    inAppMarkAsRead: function (inAppInboxItem) {
        return new Promise((resolve, reject) => {
            if (!isInboxItemValid(inAppInboxItem)) {
                reject("Invalid in app inbox item");
                return;
            }
            exec(resolve, reject, "OptimoveSDKPlugin", "inAppMarkAsRead", [
                inAppInboxItem.id,
            ]);
        });
    },
    inAppGetInboxSummary: function () {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, "OptimoveSDKPlugin", "inAppGetInboxSummary", []);
        });
    },
    inAppPresentInboxMessage: function (inAppInboxItem) {
        return new Promise((resolve, reject) => {
            if (!isInboxItemValid(inAppInboxItem)) {
                reject("Invalid in app inbox item");
                return;
            }
            exec(resolve, reject, "OptimoveSDKPlugin", "inAppPresentInboxMessage", [
                inAppInboxItem.id,
            ]);
        });
    },
    inAppDeleteMessageFromInbox: function (inAppInboxItem) {
        return new Promise((resolve, reject) => {
            if (!isInboxItemValid(inAppInboxItem)) {
                reject("Invalid in app inbox item");
                return;
            }
            exec(
                resolve,
                reject,
                "OptimoveSDKPlugin",
                "inAppDeleteMessageFromInbox",
                [inAppInboxItem.id]
            );
        });
    },

    setOnInboxUpdatedHandler: function (handler) {
        if (!isFunction(handler)) {
            console.error("Invalid handler");
            return;
        }
        currentConfig["inAppInboxUpdatedHandler"] = handler;
    },

    setPushOpenedHandler(pushOpenedHandler) {
        if (!isFunction(pushOpenedHandler)) {
            console.error("Invalid handler");
            return;
        }
        currentConfig["pushOpenedHandler"] = pushOpenedHandler;
        if (pushOpenedHandler != null) {
            checkIfPendingPushExists();
        }
    },

    setPushReceivedHandler(pushReceivedHandler) {
        if (!isFunction(pushReceivedHandler)) {
            console.error("Invalid handler");
            return;
        }
        currentConfig["pushReceivedHandler"] = pushReceivedHandler;
    },

    setInAppDeepLinkHandler(inAppDeepLinkHandler) {
        if (!isFunction(inAppDeepLinkHandler)) {
            console.error("Invalid handler");
            return;
        }
    }
}
module.exports = Optimove;