var exec = require("cordova/exec");

var inAppInboxUpdatedHandler;

var currentConfig = {
  pushReceivedHandler: pushReceivedHandler, //function that receives one argument, a push message object
  pushOpenedHandler: pushOpenedHandler, //function that receives one argument, a push message object
  inAppDeepLinkHandler: inAppDeepLinkHandler, //expect to be a function that receives one argument, a deepLink data object
};

/*document.addEventListener("deviceready", init, false);



function init() {  
  setHandlersCallBackContext().then(success, (errorMessage) => { console.error(errorMessage); });
  alert("got to init");
}
*/
setHandlersCallBackContext().then(success, (errorMessage) => {
  console.error(errorMessage);
});

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
  alert(message);
  if (!message || typeof message === "string") {
    return;
  }
  
  const handlerName = `${message.type}Handler`;
  alert(handlerName);
  alert(typeof inAppInboxUpdatedHandler);
  if (
    handlerName === "inAppInboxUpdatedHandler" &&
    typeof inAppInboxUpdatedHandler === "function"
  ) {
    inAppInboxUpdatedHandler();
    return;
  }

  if (typeof currentConfig[handlerName] === "function") {
    currentConfig[handlerName](message.data);
  } else {
    console.log(`Optimove: No handler defined for '${message.type}' event`);
  }
}

function success(message = "success!") {
  console.log(message);
}
function error(message = "error") {
  console.log(message);
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

  getCurrentUserIdentifier: function () {
    return new Promise((resolve, reject) => {
      exec(
        resolve,
        reject,
        "OptimoveSDKPlugin",
        "getCurrentUserIdentifier",
        []
      );
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
      exec(resolve, reject, "OptimoveSDKPlugin", "inAppPresentInboxMessage", [
        inAppInboxItem,
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
        [inAppInboxItem]
      );
    });
  },

  setOnInboxUpdatedHandler: function (handler) {
    inAppInboxUpdatedHandler = handler;
  },
  
  setPushOpenedHandler(pushOpenedHandler) {
    currentConfig["pushOpenedHandler"] = pushOpenedHandler;
    checkIfPendingPushExists().then(success,error); 
  },

  setPushReceivedHandler(pushReceivedHandler) {
    currentConfig["pushReceivedHandler"] = pushReceivedHandler;
  },

  setInAppDeepLinkHandler(inAppDeepLinkHandler) {
    currentConfig["inAppDeepLinkHandler"] = inAppDeepLinkHandler;
  }
};
module.exports = Optimove;
