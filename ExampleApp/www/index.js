(()=>{function e(){alert("Success!")}function t(e){console.error(e)}function n(e){alert("deepLinkHandler: "+JSON.stringify(e))}function i(e){console.log("pushReceivedHandler: "+JSON.stringify(e))}function a(e){console.log("pushOpenedHandler: "+JSON.stringify(e))}function d(e){console.log("inAppDeepLinkHandler: "+JSON.stringify(e))}function o(){console.log("inbox Updated")}function l(){var e=document.getElementById("text-area-in-app-inbox-item").value;return{id:parseInt(e),title:"test",subtitle:"test",availableFrom:null,availableTo:null,dismissedAt:null,data:null,isRead:!1,imageUrl:null,sentAt:new Date("")}}document.addEventListener("deviceready",(function(){Optimove.setOnInboxUpdatedHandler(o),Optimove.setPushReceivedHandler(i),Optimove.setInAppDeepLinkHandler(d),Optimove.setPushOpenedHandler(a),Optimove.setDeepLinkHandler(n)}),!1),document.getElementById("set-user-id-button").addEventListener("click",(function(){Optimove.setUserId(document.getElementById("text-area-user-id").value).then((()=>{document.getElementById("text-area-user-id").value="",e()}),t)})),document.getElementById("report-event-button").addEventListener("click",(function(){var n=document.getElementById("text-area-event-params").value;let i;if(""===n)i=null;else{let e=JSON.parse(n);for(let t in e)i[t]=e[t]}Optimove.reportEvent(document.getElementById("text-area-event").value,i).then((()=>{document.getElementById("text-area-event").value="",document.getElementById("text-area-event-params").value="",e()}),t)})),document.getElementById("set-user-email-button").addEventListener("click",(function(){Optimove.setUserEmail(document.getElementById("text-area-user-email").value).then((()=>{document.getElementById("text-area-user-email").value="",e()}),t)})),document.getElementById("report-screen-visit-button").addEventListener("click",(function(){var n=document.getElementById("text-area-screen-category").value;""===n&&(n=null),Optimove.reportScreenVisit(document.getElementById("text-area-screen-name").value,n).then((()=>{document.getElementById("text-area-screen-name").value="",document.getElementById("text-area-screen-category").value="",e()}),t)})),document.getElementById("register-user-button").addEventListener("click",(function(){Optimove.registerUser(document.getElementById("text-area-user-id").value,document.getElementById("text-area-user-email").value).then((()=>{document.getElementById("text-area-user-id").value="",document.getElementById("text-area-user-email").value="",e()}),t)})),document.getElementById("get-visitor-id-button").addEventListener("click",(function(){Optimove.getVisitorId().then((e=>{alert(e)}),t)})),document.getElementById("push-register-button").addEventListener("click",(function(){Optimove.pushRegister().then(e,t)})),document.getElementById("in-app-consent-true").addEventListener("click",(function(){Optimove.inAppUpdateConsent(!0).then(e,t)})),document.getElementById("in-app-consent-false").addEventListener("click",(function(){Optimove.inAppUpdateConsent(!1).then(e,t)})),document.getElementById("in-app-get-inbox-items-button").addEventListener("click",(function(){Optimove.inAppGetInboxItems().then((e=>{alert(JSON.stringify(function(e){let t,n=[];for(t of e)n.push({id:t.id,isRead:t.isRead});return n}(e)))}),t)})),document.getElementById("in-app-mark-all-inbox-items-as-read-button").addEventListener("click",(function(){Optimove.inAppMarkAllInboxItemsAsRead().then(e,t)})),document.getElementById("in-app-mark-inbox-item-as-read-button").addEventListener("click",(function(){Optimove.inAppMarkAsRead(l()).then(e,t)})),document.getElementById("in-app-get-inbox-summary-button").addEventListener("click",(function(){Optimove.inAppGetInboxSummary().then((e=>{alert(JSON.stringify(e))}),t)})),document.getElementById("in-app-present-inbox-message-button").addEventListener("click",(function(){Optimove.inAppPresentInboxMessage(l()).then(e,t)})),document.getElementById("in-app-delete-inbox-message-button").addEventListener("click",(function(){Optimove.inAppDeleteMessageFromInbox(l()).then(e,t)})),module.exports={}})();