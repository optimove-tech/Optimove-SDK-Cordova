var exec = require("cordova/exec");

var inAppInboxUpdatedHandler;
function noop() {}

var currentConfig = {
  pushReceivedHandler: noop, //function that receives one argument, a push message object
  pushOpenedHandler: noop, //function that receives one argument, a push message object
  inAppDeepLinkHandler: noop, //expect to be a function that receives one argument, a deepLink data object
};

document.addEventListener("deviceready", init, false);

function init() {
  setHandlersCallBackContext().then(success, (errorMessage) => {
    console.error(errorMessage);
  });
}

function isString(val) {
  return typeof val === "string";
}

function isNonEmptyString(val) {
  return val && isString(val);
}

function isFunction(param) {
  return typeof param === "function";
}
function isInAppConsentValid(consent) {
  validValues = ['explicit-by-user', 'auto-enroll', 'in-app-disabled'];
  return validValues.includes(consent);
}
function isInboxItemValid(inboxItem) {
  var mandatoryValues = ["id", "title", "subtitle", "sentAt"];
  for (const element of mandatoryValues) {
    if (!inboxItem[element]) {
      return false;
    }
  }
  return true;
  
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
    exec(resolve, reject, "OptimoveSDKPlugin", "checkIfPendingPushExists", []);
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
    inAppInboxUpdatedHandler();
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

  inAppUpdateConsent: function (consented) {
    return new Promise((resolve, reject) => {
      if (!isInAppConsentValid(consented)) {
        reject("Invalid inAppConsentStrategy");
        return;
      }
      exec(resolve, reject, "OptimoveSDKPlugin", "inAppUpdateConsent", [
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
        inAppInboxItem,
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
        inAppInboxItem,
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
        [inAppInboxItem]
      );
    });
  },

  setOnInboxUpdatedHandler: function (handler) {
    if (!isFunction(handler)) {
      console.error("Invalid handler");
      return;
    }
    inAppInboxUpdatedHandler = handler;
  },

  setPushOpenedHandler(pushOpenedHandler) {
    if (!isFunction(pushOpenedHandler)) {
      console.error("Invalid handler");
      return;
    }
    currentConfig["pushOpenedHandler"] = pushOpenedHandler;
    checkIfPendingPushExists();
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
    currentConfig["inAppDeepLinkHandler"] = inAppDeepLinkHandler;
  },
};
module.exports = Optimove;
