(()=>{"use strict";var e={};function t(){alert("Success!")}function n(e){console.error(e)}function i(e){alert("deepLinkHandler: "+JSON.stringify(e))}function a(e){console.log("pushReceivedHandler: "+JSON.stringify(e))}function o(e){console.log("pushOpenedHandler: "+JSON.stringify(e))}function d(e){console.log("inAppDeepLinkHandler: "+JSON.stringify(e))}function l(){console.log("inbox Updated")}function r(){var e=document.getElementById("text-area-in-app-inbox-item").value;return{id:parseInt(e),title:"test",subtitle:"test",availableFrom:null,availableTo:null,dismissedAt:null,data:null,isRead:!1,imageUrl:null,sentAt:new Date("")}}(e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})})(e),document.addEventListener("deviceready",(function(){Optimove.setOnInboxUpdatedHandler(l),Optimove.setPushReceivedHandler(a),Optimove.setInAppDeepLinkHandler(d),Optimove.setPushOpenedHandler(o),Optimove.setDeepLinkHandler(i)}),!1),document.getElementById("set-user-id-button").addEventListener("click",(function(){Optimove.setUserId(document.getElementById("text-area-user-id").value).then((()=>{document.getElementById("text-area-user-id").value="",t()}),n)})),document.getElementById("report-event-button").addEventListener("click",(function(){var e=document.getElementById("text-area-event-params").value;let i;if(""===e)i=null;else{let t=JSON.parse(e);for(let e in t)i[e]=t[e]}Optimove.reportEvent(document.getElementById("text-area-event").value,i).then((()=>{document.getElementById("text-area-event").value="",document.getElementById("text-area-event-params").value="",t()}),n)})),document.getElementById("set-user-email-button").addEventListener("click",(function(){Optimove.setUserEmail(document.getElementById("text-area-user-email").value).then((()=>{document.getElementById("text-area-user-email").value="",t()}),n)})),document.getElementById("report-screen-visit-button").addEventListener("click",(function(){var e=document.getElementById("text-area-screen-category").value;""===e&&(e=null),Optimove.reportScreenVisit(document.getElementById("text-area-screen-name").value,e).then((()=>{document.getElementById("text-area-screen-name").value="",document.getElementById("text-area-screen-category").value="",t()}),n)})),document.getElementById("register-user-button").addEventListener("click",(function(){Optimove.registerUser(document.getElementById("text-area-user-id").value,document.getElementById("text-area-user-email").value).then((()=>{document.getElementById("text-area-user-id").value="",document.getElementById("text-area-user-email").value="",t()}),n)})),document.getElementById("get-visitor-id-button").addEventListener("click",(function(){Optimove.getVisitorId().then((e=>{alert(e)}),n)})),document.getElementById("push-register-button").addEventListener("click",(function(){Optimove.pushRegister().then(t,n)})),document.getElementById("in-app-consent-true").addEventListener("click",(function(){Optimove.inAppUpdateConsent(!0).then(t,n)})),document.getElementById("in-app-consent-false").addEventListener("click",(function(){Optimove.inAppUpdateConsent(!1).then(t,n)})),document.getElementById("in-app-get-inbox-items-button").addEventListener("click",(function(){Optimove.inAppGetInboxItems().then((e=>{alert(JSON.stringify(function(e){let t,n=[];for(t of e)n.push({id:t.id,isRead:t.isRead});return n}(e)))}),n)})),document.getElementById("in-app-mark-all-inbox-items-as-read-button").addEventListener("click",(function(){Optimove.inAppMarkAllInboxItemsAsRead().then(t,n)})),document.getElementById("in-app-mark-inbox-item-as-read-button").addEventListener("click",(function(){Optimove.inAppMarkAsRead(r()).then(t,n)})),document.getElementById("in-app-get-inbox-summary-button").addEventListener("click",(function(){Optimove.inAppGetInboxSummary().then((e=>{alert(JSON.stringify(e))}),n)})),document.getElementById("in-app-present-inbox-message-button").addEventListener("click",(function(){Optimove.inAppPresentInboxMessage(r()).then(t,n)})),document.getElementById("in-app-delete-inbox-message-button").addEventListener("click",(function(){Optimove.inAppDeleteMessageFromInbox(r()).then(t,n)})),module.exports=e})();