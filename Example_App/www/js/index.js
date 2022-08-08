/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

document.addEventListener("deviceready", onDeviceReady, false);

var items;
function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
  alert("device ready");
}

function success(successMessage = "Success!") {
  console.log(successMessage);
  alert(successMessage);
}

function error(errorMessage) {
  console.error(errorMessage);
}


function pushReceivedHandler(pushMessage) {
  //handling push received
}

function pushOpenedHandler(pushMessage) {
  //handling push message
}

function inAppDeepLinkHandler(deepLinkData) {
  //handling inAppDeepLink
}
/*
Optimove.setOnInboxUpdatedHandler(onInboxUpdated);
alert("got to indexJS2");
Optimove.setPushReceivedHandler(pushReceivedHandler);
alert("got to indexJS3");
Optimove.setPushOpenedHandler(pushOpenedHandler);
alert("got to indexJS4");
Optimove.setInAppDeepLinkHandler(inAppDeepLinkHandler);  
alert("got to indexJS5");*/
//Optimove.setOnInboxUpdatedHandler(onInboxUpdated);

document
  .getElementById("set-user-id-button")
  .addEventListener("click", setUserId);

function setUserId() {
  Optimove.setUserId(document.getElementById("text-area-user-id").value).then(
    () => {
      document.getElementById("text-area-user-id").value = "";
      success();
    },
    error
  );
}

document
  .getElementById("report-event-button")
  .addEventListener("click", reportEvent);

function reportEvent() {
  var eventParams = document.getElementById("text-area-event-params").value;
  if (eventParams === "") {
    eventParams = null;
  }
  Optimove.reportEvent(
    document.getElementById("text-area-event").value,
    eventParams
  ).then(() => {
    document.getElementById("text-area-event").value = "";
    document.getElementById("text-area-event-params").value = "";
    success();
  }, error);
}

document
  .getElementById("set-user-email-button")
  .addEventListener("click", setUserEmail);

function setUserEmail() {
  Optimove.setUserEmail(
    document.getElementById("text-area-user-email").value
  ).then(() => {
    document.getElementById("text-area-user-email").value = "";
    success();
  }, error);
}

document
  .getElementById("report-screen-visit-button")
  .addEventListener("click", reportScreenVisit);

function reportScreenVisit() {
  var screenCategory = document.getElementById(
    "text-area-screen-category"
  ).value;
  if (screenCategory === "") {
    screenCategory = null;
  }
  Optimove.reportScreenVisit(
    document.getElementById("text-area-screen-name").value,
    screenCategory
  ).then(() => {
    document.getElementById("text-area-screen-name").value = "";
    document.getElementById("text-area-screen-category").value = "";
    success();
  }, error);
}
document
  .getElementById("register-user-button")
  .addEventListener("click", registerUser);

function registerUser() {
  Optimove.registerUser(
    document.getElementById("text-area-user-id").value,
    document.getElementById("text-area-user-email").value
  ).then(() => {
    document.getElementById("text-area-user-id").value = "";
    document.getElementById("text-area-user-email").value = "";
    success();
  }, error);
}
document
  .getElementById("get-visitor-id-button")
  .addEventListener("click", getVisitorId);

function getVisitorId() {
  Optimove.getVisitorId().then((visitorId) => {
    document.getElementById("text-area-visitor-id").value = visitorId;
  }, error);
}
document
  .getElementById("get-current-user-identifier-button")
  .addEventListener("click", getCurrentUserIdentifier);

function getCurrentUserIdentifier() {
  Optimove.getCurrentUserIdentifier().then((currentUserIdentifier) => {
    document.getElementById("text-area-current-user-identifier").value =
      currentUserIdentifier;
  }, error);
}

document
  .getElementById("push-register-button")
  .addEventListener("click", pushRegister);

function pushRegister() {
  Optimove.pushRegister().then(success, error);
}
document
  .getElementById("in-app-consent-true")
  .addEventListener("click", inAppUpdateConsentTrue);

function inAppUpdateConsentTrue() {
  Optimove.inAppUpdateConsent(true).then(success, error);
}

document
  .getElementById("in-app-consent-false")
  .addEventListener("click", inAppUpdateConsentFalse);

function inAppUpdateConsentFalse() {
  Optimove.inAppUpdateConsent(false).then(success, error);
}

document
  .getElementById("in-app-get-inbox-items-button")
  .addEventListener("click", inAppGetInboxItems);

function inAppGetInboxItems() {
  Optimove.inAppGetInboxItems().then((inboxItemsArray) => {
    items = inboxItemsArray;
    alert(items);
  }, error);
}

document
  .getElementById("in-app-mark-all-inbox-items-as-read-button")
  .addEventListener("click", inAppMarkAllInboxItemsAsRead);

function inAppMarkAllInboxItemsAsRead() {
  Optimove.inAppMarkAllInboxItemsAsRead().then(success, error);
}

document
  .getElementById("in-app-mark-inbox-item-as-read-button")
  .addEventListener("click", inAppMarkAsRead);

function inAppMarkAsRead() {
  Optimove.inAppMarkAsRead(
    document.getElementById("text-area-in-app-inbox-item-id").value
  ).then(success, error);
  document.getElementById("text-area-in-app-inbox-item-id").value = "";
}

document
  .getElementById("in-app-get-inbox-summary-button")
  .addEventListener("click", inAppGetInboxSummary);

function inAppGetInboxSummary() {
  Optimove.inAppGetInboxSummary().then((inboxSummary) => {
    document.getElementById("text-area-in-app-inbox-summary").value =
      inboxSummary;
  }, error);
}

document
  .getElementById("in-app-present-inbox-message-button")
  .addEventListener("click", inAppPresentInboxMessage);

function inAppPresentInboxMessage() {
  Optimove.inAppPresentInboxMessage(
    document.getElementById("text-area-in-app-inbox-item-id").value
  ).then(success, error);
}

document
  .getElementById("in-app-delete-inbox-message-button")
  .addEventListener("click", inAppPresentInboxMessage);

function inAppDeleteMessageFromInbox() {
  Optimove.inAppDeleteMessageFromInbox(
    document.getElementById("text-area-in-app-inbox-item-id").value
  ).then(success, error);
}
document
  .getElementById("get-visitor-id-button")
  .addEventListener("click", getVisitorId);

function getVisitorId() {
  Optimove.getVisitorId().then((visitorId) => {
    document.getElementById("text-area-visitor-id").value = visitorId;
  }, error);
}
document
  .getElementById("get-current-user-identifier-button")
  .addEventListener("click", getCurrentUserIdentifier);

function getCurrentUserIdentifier() {
  Optimove.getCurrentUserIdentifier().then((visitorId) => {
    document.getElementById("text-area-current-user-identifier").value =
      visitorId;
  }, error);
}

function onInboxUpdated() {
  Optimove.inAppGetInboxItems().then((inboxItemsArray) => {
    var inboxItem;
    alert(inboxItemsArray);
    inboxItem = inboxItemsArray[0];
    Optimove.inAppPresentInboxMessage(inboxItem);
  }, error);
}
