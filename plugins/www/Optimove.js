var exec = require("cordova/exec");

const Optimove = {
  initBaseSdk: function () {
    return new Promise((resolve, reject) => {
      exec(resolve, reject, "OptimoveSDKPlugin", "initBaseSdk", []);
    });
  },

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
  inAppMarkAsRead: function (inAppInboxItemId) {
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
  inAppPresentInboxMessage: function (inAppInboxItemId) {
    return new Promise((resolve, reject) => {
      exec(resolve, reject, "OptimoveSDKPlugin", "inAppPresentInboxMessage", [
        inAppInboxItemId,
      ]);
    });
  },
};
module.exports = Optimove;
