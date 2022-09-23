(()=>{"use strict";var e={n:n=>{var i=n&&n.__esModule?()=>n.default:()=>n;return e.d(i,{a:i}),i},d:(n,i)=>{for(var t in i)e.o(i,t)&&!e.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:i[t]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>s});const i=require("cordova");var t=e.n(i);let r={pushReceivedHandler:null,pushOpenedHandler:null,inAppDeepLinkHandler:null,inAppInboxUpdatedHandler:null,deepLinkHandler:null};function o(){(function(){let e=null!==r.pushOpenedHandler,n=null!==r.deepLinkHandler;return new Promise(((i,r)=>{t().exec(p,r,"OptimoveSDKPlugin","setHandlersCallBackContext",[e,n])}))})().then((e=>{console.log(e)}),(e=>{console.error(e)}))}function p(e){var n;if(!e||"string"==typeof e)return;const i=`${e.type}Handler`;"inAppInboxUpdatedHandler"!==i?null!==r[i]?r[i](e.data):console.log(`Optimove: No handler defined for '${e.type}' event`):null===(n=r[i])||void 0===n||n.call(r)}document.addEventListener("deviceready",(function(){o()}),!1),document.addEventListener("resume",(function(){o()}),!1),document.addEventListener("pause",(function(){new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","clearContext",[])}))}),!1);const s={setUserId:e=>new Promise(((n,i)=>{t().exec(n,i,"OptimoveSDKPlugin","setUserId",[e])})),setUserEmail:e=>new Promise(((n,i)=>{t().exec(n,i,"OptimoveSDKPlugin","setUserEmail",[e])})),reportEvent:(e,n)=>new Promise(((i,r)=>{t().exec(i,r,"OptimoveSDKPlugin","reportEvent",[e,n])})),reportScreenVisit:(e,n)=>new Promise(((i,r)=>{t().exec(i,r,"OptimoveSDKPlugin","reportScreenVisit",[e,n])})),registerUser:(e,n)=>new Promise(((i,r)=>{t().exec(i,r,"OptimoveSDKPlugin","registerUser",[e,n])})),getVisitorId:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","getVisitorId",[])})),pushRegister:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","pushRegister",[])})),inAppUpdateConsent:e=>new Promise(((n,i)=>{t().exec(n,i,"OptimoveSDKPlugin","inAppUpdateConsent",[e])})),inAppGetInboxItems:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","inAppGetInboxItems",[])})),inAppMarkAllInboxItemsAsRead:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","inAppMarkAllInboxItemsAsRead",[])})),inAppMarkAsRead:e=>new Promise(((n,i)=>{t().exec(n,i,"OptimoveSDKPlugin","inAppMarkAsRead",[e.id])})),inAppGetInboxSummary:()=>new Promise(((e,n)=>{t().exec(e,n,"OptimoveSDKPlugin","inAppGetInboxSummary",[])})),inAppPresentInboxMessage:e=>new Promise(((n,i)=>{t().exec(n,i,"OptimoveSDKPlugin","inAppPresentInboxMessage",[e.id])})),inAppDeleteMessageFromInbox:e=>new Promise(((n,i)=>{t().exec(n,i,"OptimoveSDKPlugin","inAppDeleteMessageFromInbox",[e.id])})),setOnInboxUpdatedHandler:e=>{r.inAppInboxUpdatedHandler=e},setPushOpenedHandler(e){r.pushOpenedHandler=e,null!=e&&new Promise(((e,n)=>{t().exec(p,n,"OptimoveSDKPlugin","checkIfPendingPushExists",[])}))},setPushReceivedHandler(e){r.pushReceivedHandler=e},setInAppDeepLinkHandler(e){r.inAppDeepLinkHandler=e},setDeepLinkHandler(e){r.deepLinkHandler=e,new Promise(((e,n)=>{t().exec(p,n,"OptimoveSDKPlugin","checkIfPendingDDLExists",[])}))}};module.exports=n})();