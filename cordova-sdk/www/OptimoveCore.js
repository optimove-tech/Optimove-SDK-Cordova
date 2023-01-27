(()=>{"use strict";var e={n:n=>{var i=n&&n.__esModule?()=>n.default:()=>n;return e.d(i,{a:i}),i},d:(n,i)=>{for(var t in i)e.o(i,t)&&!e.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:i[t]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>a});const i=require("cordova");var t=e.n(i);let r={pushReceivedHandler:null,pushOpenedHandler:null,inAppDeepLinkHandler:null,inAppInboxUpdatedHandler:null,deepLinkHandler:null};function l(){(function(){let e=null!==r.pushOpenedHandler,n=null!==r.deepLinkHandler;return new Promise(((i,r)=>{t().exec(o,r,"OptimoveSDKPlugin","setHandlersCallBackContext",[e,n])}))})().then((e=>{console.log(e)}),(e=>{console.error(e)}))}function o(e){var n;if(!e||"string"==typeof e)return;const i=`${e.type}Handler`;"inAppInboxUpdatedHandler"!==i?null!==r[i]?r[i](e.data):console.log(`Optimove: No handler defined for '${e.type}' event`):null===(n=r[i])||void 0===n||n.call(r)}function s(e){return"string"==typeof e&&""!==e}document.addEventListener("deviceready",(function(){l()}),!1),document.addEventListener("resume",(function(){l()}),!1),document.addEventListener("pause",(function(){new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","clearContext",[])}))}),!1);const a={setUserId:e=>new Promise(((n,i)=>{s(e)?t().exec(n,i,"OptimoveSDKPlugin","setUserId",[e]):i("Invalid user id")})),setUserEmail:e=>new Promise(((n,i)=>{s(e)?t().exec(n,i,"OptimoveSDKPlugin","setUserEmail",[e]):i("Invalid user email")})),reportEvent:(e,n)=>new Promise(((i,r)=>{s(e)?t().exec(i,r,"OptimoveSDKPlugin","reportEvent",[e,n]):r("Invalid event name")})),reportScreenVisit:(e,n)=>new Promise(((i,r)=>{s(e)?void 0===n||s(e)?t().exec(i,r,"OptimoveSDKPlugin","reportScreenVisit",[e,n]):r("Invalid screen category"):r("Invalid screen name")})),registerUser:(e,n)=>new Promise(((i,r)=>{s(e)?s(n)?t().exec(i,r,"OptimoveSDKPlugin","registerUser",[e,n]):r("Invalid user user email"):r("Invalid user id")})),getVisitorId:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","getVisitorId",[])})),signOutUser:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","signOutUser",[])})),pushRequestDeviceToken:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","pushRequestDeviceToken",[])})),pushUnregister:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","pushUnregister",[])})),inAppUpdateConsent:e=>new Promise(((n,i)=>{t().exec(n,i,"OptimoveSDKPlugin","inAppUpdateConsent",[e])})),inAppGetInboxItems:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","inAppGetInboxItems",[])})).then((e=>e.map((e=>({id:e.id,title:e.title,subtitle:e.subtitle,availableFrom:null===e.availableFrom?null:new Date(e.availableFrom),availableTo:null===e.availableFrom?null:new Date(e.availableTo),dismissedAt:null===e.availableFrom?null:new Date(e.dismissedAt),sentAt:new Date(e.sentAt),data:e.data,isRead:e.isRead,imageUrl:e.imageUrl}))))),inAppMarkAllInboxItemsAsRead:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","inAppMarkAllInboxItemsAsRead",[])})),inAppMarkAsRead:e=>new Promise(((n,i)=>{t().exec(n,i,"OptimoveSDKPlugin","inAppMarkAsRead",[e.id])})),inAppGetInboxSummary:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","inAppGetInboxSummary",[])})),inAppPresentInboxMessage:e=>new Promise(((n,i)=>{t().exec(n,i,"OptimoveSDKPlugin","inAppPresentInboxMessage",[e.id])})),inAppDeleteMessageFromInbox:e=>new Promise(((n,i)=>{t().exec(n,i,"OptimoveSDKPlugin","inAppDeleteMessageFromInbox",[e.id])})),setOnInboxUpdatedHandler:e=>{r.inAppInboxUpdatedHandler=e},setPushOpenedHandler(e){r.pushOpenedHandler=e,null!=e&&new Promise(((e,n)=>{t().exec(o,n,"OptimoveSDKPlugin","checkIfPendingPushExists",[])}))},setPushReceivedHandler(e){r.pushReceivedHandler=e},setInAppDeepLinkHandler(e){r.inAppDeepLinkHandler=e},setDeepLinkHandler(e){r.deepLinkHandler=e,new Promise(((e,n)=>{t().exec(o,n,"OptimoveSDKPlugin","checkIfPendingDDLExists",[])}))}};module.exports=n})();