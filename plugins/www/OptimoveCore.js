/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/index.ts":
/*!***************************!*\
  !*** ./src/core/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var cordova__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cordova */ \"cordova\");\n/* harmony import */ var cordova__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cordova__WEBPACK_IMPORTED_MODULE_0__);\n\r\nlet currentConfig = {\r\n    pushReceivedHandler: null,\r\n    pushOpenedHandler: null,\r\n    inAppDeepLinkHandler: null,\r\n    inAppInboxUpdatedHandler: null,\r\n    deepLinkHandler: null,\r\n};\r\ndocument.addEventListener(\"deviceready\", init, false);\r\ndocument.addEventListener(\"resume\", resume, false);\r\ndocument.addEventListener(\"pause\", pause, false);\r\nfunction init() {\r\n    setContext();\r\n}\r\nfunction resume() {\r\n    setContext();\r\n}\r\nfunction pause() {\r\n    clearContext();\r\n}\r\nfunction setContext() {\r\n    setHandlersCallBackContext().then((successMessage) => {\r\n        console.log(successMessage);\r\n    }, (errorMessage) => {\r\n        console.error(errorMessage);\r\n    });\r\n}\r\nfunction clearContext() {\r\n    return new Promise((resolve, reject) => {\r\n        cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"clearContext\", []);\r\n    });\r\n}\r\nfunction setHandlersCallBackContext() {\r\n    return new Promise((resolve, reject) => {\r\n        cordova__WEBPACK_IMPORTED_MODULE_0__.exec(nativeMessageHandler, reject, \"OptimoveSDKPlugin\", \"setHandlersCallBackContext\", []);\r\n    });\r\n}\r\nfunction checkIfPendingDDLExists() {\r\n    return new Promise((resolve, reject) => {\r\n        cordova__WEBPACK_IMPORTED_MODULE_0__.exec(nativeMessageHandler, reject, \"OptimoveSDKPlugin\", \"checkIfPendingDDLExists\", []);\r\n    });\r\n}\r\nfunction checkIfPendingPushExists() {\r\n    return new Promise((resolve, reject) => {\r\n        cordova__WEBPACK_IMPORTED_MODULE_0__.exec(nativeMessageHandler, reject, \"OptimoveSDKPlugin\", \"checkIfPendingPushExists\", []);\r\n    });\r\n}\r\nfunction nativeMessageHandler(message) {\r\n    var _a;\r\n    if (!message || typeof message === \"string\") {\r\n        return;\r\n    }\r\n    const handlerName = `${message.type}Handler`;\r\n    if (handlerName === \"inAppInboxUpdatedHandler\" &&\r\n        typeof currentConfig[handlerName] === \"function\") {\r\n        (_a = currentConfig[handlerName]) === null || _a === void 0 ? void 0 : _a.call(currentConfig);\r\n        return;\r\n    }\r\n    if (typeof currentConfig[handlerName] === \"function\") {\r\n        currentConfig[handlerName](message.data);\r\n    }\r\n    else {\r\n        console.log(`Optimove: No handler defined for '${message.type}' event`);\r\n    }\r\n}\r\nconst Optimove = {\r\n    /**\r\n     * Sets the User ID of the current user and starts the {@code Visitor} to {@code Customer} conversion flow.<br>\r\n     * Note: The user ID must be the same user ID that is passed to Optimove at the daily ETL\r\n     * If you report both the user ID and the email, use {@link Optimove.registerUser(String, String)}\r\n     *\r\n     * @param userId The new userId to set\r\n     */\r\n    setUserId: (userId) => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"setUserId\", [userId]);\r\n        });\r\n    },\r\n    /**\r\n     * Attaches an email address to the current user.\r\n     * If you report both the user ID and the email, use {@link Optimove.registerUser(String, String)}\r\n     *\r\n     * @param email the <i>email address</i> to attach\r\n     */\r\n    setUserEmail: (userEmail) => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"setUserEmail\", [\r\n                userEmail,\r\n            ]);\r\n        });\r\n    },\r\n    /**\r\n     * Reports a custom analytics event\r\n     * @param {string} eventName - the custom event name\r\n     * @param {EventParams} eventParams - optional to add parameters of the event\r\n     */\r\n    reportEvent: (eventName, eventParams) => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"reportEvent\", [\r\n                eventName,\r\n                eventParams,\r\n            ]);\r\n        });\r\n    },\r\n    /**\r\n     * Reports a visit in a given screen\r\n     * @param {string} screenName - the screen name\r\n     * @param {string} screenCategory - optional to add a screen category\r\n     */\r\n    reportScreenVisit: (screenName, screenCategory) => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"reportScreenVisit\", [\r\n                screenName,\r\n                screenCategory,\r\n            ]);\r\n        });\r\n    },\r\n    /**\r\n     * Method that performs both the {@code setUserId} and the {@code setUserEmail} flows from a single call.\r\n     *\r\n     * @param userId The new userId\r\n     * @param email  the email address to attach\r\n     * @see Optimove.setUserId(String)\r\n     * @see Optimove.setUserEmail(String)\r\n     */\r\n    registerUser: (userId, userEmail) => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"registerUser\", [\r\n                userId,\r\n                userEmail,\r\n            ]);\r\n        });\r\n    },\r\n    /**\r\n     *  Returns the visitor id that is associated with the current Optimove installation record\r\n     * @returns {string} visitorId\r\n     */\r\n    getVisitorId: () => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"getVisitorId\", []);\r\n        });\r\n    },\r\n    /**\r\n     * Used to register the device installation with FCM to receive push notifications\r\n     */\r\n    pushRegister: () => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"pushRegister\", []);\r\n        });\r\n    },\r\n    /**\r\n     * Opts the user in or out of in-app messaging\r\n     *\r\n     * Note the configured consent strategy in SDK initialization must\r\n     * be set to 'explicit-by-user' otherwise this method throws a runtime\r\n     * exception.\r\n     */\r\n    inAppUpdateConsent: (consented) => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"inAppUpdateConsent\", [\r\n                consented,\r\n            ]);\r\n        });\r\n    },\r\n    /**\r\n     * Gets a list of available in-app messages sent to the user and stored in the inbox\r\n     * @returns {Promise<InAppInboxItem[]>} the list of available in-app messages sent to the user and stored in the inbox\r\n     */\r\n    inAppGetInboxItems: () => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"inAppGetInboxItems\", []);\r\n        });\r\n    },\r\n    /**\r\n     * Marks all in-app inbox items as read\r\n     */\r\n    inAppMarkAllInboxItemsAsRead: () => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"inAppMarkAllInboxItemsAsRead\", []);\r\n        });\r\n    },\r\n    /**\r\n     * Mark the specified inAppInboxItem as read\r\n     * @param inAppInboxItem specified inAppInboxItem\r\n     * @returns\r\n     */\r\n    inAppMarkAsRead: (inAppInboxItem) => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"inAppMarkAsRead\", [\r\n                inAppInboxItem.id,\r\n            ]);\r\n        });\r\n    },\r\n    /**\r\n     * Gets in-app inbox summary, which includes counts for total and unread messages.\r\n     * Promise is rejected if operation fails.\r\n     */\r\n    inAppGetInboxSummary: () => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"inAppGetInboxSummary\", []);\r\n        });\r\n    },\r\n    /**\r\n     * Presents the given in-app message to the user from the inbox\r\n     * @param {InAppInboxItem} inAppInboxItem the item that holds the message that will be presented\r\n     */\r\n    inAppPresentInboxMessage: (inAppInboxItem) => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"inAppPresentInboxMessage\", [inAppInboxItem.id]);\r\n        });\r\n    },\r\n    /**\r\n     * Deletes a specified inAppInboxItem from inbox\r\n     * @param inAppInboxItem the item to that will be deleted\r\n     */\r\n    inAppDeleteMessageFromInbox: (inAppInboxItem) => {\r\n        return new Promise((resolve, reject) => {\r\n            cordova__WEBPACK_IMPORTED_MODULE_0__.exec(resolve, reject, \"OptimoveSDKPlugin\", \"inAppDeleteMessageFromInbox\", [inAppInboxItem.id]);\r\n        });\r\n    },\r\n    /**\r\n     * Sets inboxUpdated event handler\r\n     * @param {InAppInboxUpdatedHandler} inboxUpdatedHandler - inbox updated event handler\r\n     */\r\n    setOnInboxUpdatedHandler: (inboxUpdatedHandler) => {\r\n        currentConfig[\"inAppInboxUpdatedHandler\"] = inboxUpdatedHandler;\r\n    },\r\n    /**\r\n     * Sets push opened event handler\r\n     * @param {PushNotificationHandler} pushOpenedHandler - push opened event handler\r\n     */\r\n    setPushOpenedHandler(pushOpenedHandler) {\r\n        currentConfig[\"pushOpenedHandler\"] = pushOpenedHandler;\r\n        if (pushOpenedHandler != null) {\r\n            checkIfPendingPushExists();\r\n        }\r\n    },\r\n    /**\r\n     * Sets push received event handler\r\n     * @param {PushNotificationHandler} pushReceivedHandler - push received event handler\r\n     */\r\n    setPushReceivedHandler(pushReceivedHandler) {\r\n        currentConfig[\"pushReceivedHandler\"] = pushReceivedHandler;\r\n    },\r\n    /**\r\n     * Sets in app deep link event handler\r\n     * @param {InAppDeepLinkHandler} inAppDeepLinkHandler - in app deep link event handler\r\n     */\r\n    setInAppDeepLinkHandler(inAppDeepLinkHandler) {\r\n        currentConfig[\"inAppDeepLinkHandler\"] = inAppDeepLinkHandler;\r\n    },\r\n    /**\r\n     * Sets deep link event handler\r\n     * @param {DeepLinkHandler} deepLinkHandler - deep link event handler\r\n     */\r\n    setDeepLinkHandler(deepLinkHandler) {\r\n        currentConfig[\"deepLinkHandler\"] = deepLinkHandler;\r\n        checkIfPendingDDLExists();\r\n    },\r\n};\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Optimove);\r\n\n\n//# sourceURL=webpack://optimove-cordova-plugin/./src/core/index.ts?");

/***/ }),

/***/ "cordova":
/*!**************************!*\
  !*** external "cordova" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("cordova");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/core/index.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;