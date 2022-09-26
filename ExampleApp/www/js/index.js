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
  Optimove.setOnInboxUpdatedHandler(onInboxUpdatedHandler);
  Optimove.setPushReceivedHandler(pushReceivedHandler);
  Optimove.setInAppDeepLinkHandler(inAppDeepLinkHandler);
  Optimove.setPushOpenedHandler(pushOpenedHandler);
  Optimove.setDeepLinkHandler(deepLinkHandler);
}

function success(successMessage = "Success!") {
  alert(successMessage);
}

function error(errorMessage) {
  console.error(errorMessage);
}

function deepLinkHandler(deepLink) {
  setOutput("deepLinkHandler: " + JSON.stringify(deepLink));
 }
function pushReceivedHandler(pushMessage) {
  setOutput("pushReceivedHandler: " + JSON.stringify(pushMessage));
}

function pushOpenedHandler(pushMessage) {
  setOutput("pushOpenedHandler: " + JSON.stringify(pushMessage));
}

function inAppDeepLinkHandler(deepLinkData) {
  setOutput("inAppDeepLinkHandler: " + JSON.stringify(deepLinkData));
}

function onInboxUpdatedHandler() {
  console.log("onInboxUpdatedHandler");
}

function setOutput(output){
  document.getElementById("text-area-output").value = output;
}

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
    alert(visitorId);
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
    alert(JSON.stringify(flattenInboxItemObject(inboxItemsArray)));
  }, error);
}

function flattenInboxItemObject(inboxItemsArray) {
  flattendItemsList = [];
  for (item of inboxItemsArray) {
    flattendItemsList.push({
      id: item.id,
      isRead: item.isRead,
      sentAt: item.sentAt.toISOString()
    });
  }
  return flattendItemsList;
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

function getInboxItemForTesting() {
  var id = parseInt(document.getElementById("text-area-in-app-inbox-item").value);
  if (isNaN(id)){
    alert("item id is required");
    return;
  }

  var item = {
    id: id,
  };

  return item;
}

function inAppMarkAsRead() {
  Optimove.inAppMarkAsRead(getInboxItemForTesting()).then(success, error);
}

document
  .getElementById("in-app-get-inbox-summary-button")
  .addEventListener("click", inAppGetInboxSummary);

function inAppGetInboxSummary() {
  Optimove.inAppGetInboxSummary().then((inboxSummary) => {
    alert(JSON.stringify(inboxSummary));
  }, error);
}

document
  .getElementById("in-app-present-inbox-message-button")
  .addEventListener("click", inAppPresentInboxMessage);

function inAppPresentInboxMessage() {
  Optimove.inAppPresentInboxMessage(getInboxItemForTesting()).then(
      () => {},
      error
  );
}

document
  .getElementById("in-app-delete-inbox-message-button")
  .addEventListener("click", inAppDeleteMessageFromInbox);

function inAppDeleteMessageFromInbox() {
  Optimove.inAppDeleteMessageFromInbox(getInboxItemForTesting()).then(
    success,
    error
  );
}

