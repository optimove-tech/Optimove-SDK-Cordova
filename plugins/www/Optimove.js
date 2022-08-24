var exec = require("cordova/exec");

var currentConfig = {
  pushReceivedHandler: null, //function that receives one argument, a push message object
  pushOpenedHandler: null, //function that receives one argument, a push message object
  inAppDeepLinkHandler: null, //expect to be a function that receives one argument, a deepLink data object
  inAppInboxUpdatedHandler : null
};

document.addEventListener("deviceready", init, false);

function init() {  
  setHandlersCallBackContext().then(success, (errorMessage) => { console.error(errorMessage); });
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
    currentConfig[handlerName]();
    return;
  }

  if (typeof currentConfig[handlerName] === "function") {
    currentConfig[handlerName](message.data);
  } else {
    console.log(`Optimove: No handler defined for '${message.type}' event`);
  }
}

const Optimove = {
  setUserId: function (userId) {
    return new Promise((resolve, reject) => {
      exec(resolve, reject, "OptimoveSDKPlugin", "setUserId", [userId]);
    });
  },

  setUserEmail: function (userEmail) {
    return new Promise((resolve, reject) => {
      exec(resolve, reject, "OptimoveSDKPlugin", "setUserEmail", [userEmail]);
    });
  },

  /* eventParams is nullable*/
  reportEvent: function (eventName, eventParams) {
    return new Promise((resolve, reject) => {
      exec(resolve, reject, "OptimoveSDKPlugin", "reportEvent", [
        eventName,
        eventParams,
      ]);
    });
  },

  /* screenCategory parameter is nullable*/
  reportScreenVisit: function (screenName, screenCategory) {
    return new Promise((resolve, reject) => {
      exec(resolve, reject, "OptimoveSDKPlugin", "reportScreenVisit", [
        screenName,
        screenCategory,
      ]);
    });
  },

  registerUser: function (userId, userEmail) {
    return new Promise((resolve, reject) => {
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
      exec(resolve, reject, "OptimoveSDKPlugin", "inAppPresentInboxMessage", [
        inAppInboxItem.id,
      ]);
    });
  },
  inAppDeleteMessageFromInbox: function (inAppInboxItem) {
    return new Promise((resolve, reject) => {
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
      inAppInboxUpdatedHandler = handler;
  },
  
  setPushOpenedHandler(pushOpenedHandler) {
    currentConfig["pushOpenedHandler"] = pushOpenedHandler;
    checkIfPendingPushExists(); 
  },

  setPushReceivedHandler(pushReceivedHandler) {
    currentConfig["pushReceivedHandler"] = pushReceivedHandler;
  },

  setInAppDeepLinkHandler(inAppDeepLinkHandler) {
    currentConfig["inAppDeepLinkHandler"] = inAppDeepLinkHandler;
  }
};
module.exports = Optimove;
