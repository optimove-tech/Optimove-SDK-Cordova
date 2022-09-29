declare var Optimove: Optimove;

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

document.addEventListener("deviceready", onDeviceReady, false);
let outputBox: HTMLTextAreaElement = <HTMLTextAreaElement>
  document.getElementById("text-area-output");
  
function onDeviceReady() {
  Optimove.setOnInboxUpdatedHandler(onInboxUpdatedHandler);
  Optimove.setPushReceivedHandler(pushReceivedHandler);
  Optimove.setInAppDeepLinkHandler(inAppDeepLinkHandler);
  Optimove.setPushOpenedHandler(pushOpenedHandler);
  Optimove.setDeepLinkHandler(deepLinkHandler);
}

function success(): void {
 let successMessage: string = "Success!";
  alert(successMessage);
}

function error(errorMessage: string): void {
  alert(errorMessage);
}

function deepLinkHandler(deepLink: DeepLink): void {
  outputBox.value =
    outputBox.value + "\n" + "deepLinkHandler: " + JSON.stringify(deepLink);
  outputBox.rows = outputBox.rows + 1;
}
function pushReceivedHandler(pushMessage: PushNotification): void {
  outputBox.value =
  outputBox.value +
  "\n" + "pushReceivedHandler: " +
  JSON.stringify(pushMessage);
  outputBox.rows = outputBox.rows + 1;
}

function pushOpenedHandler(pushMessage: PushNotification): void {
  outputBox.value =
    outputBox.value +
    "\n" +
    "pushOpenedHandler: " +
    JSON.stringify(pushMessage);
  outputBox.rows = outputBox.rows + 1;
}

function inAppDeepLinkHandler(inAppButtonPress: InAppButtonPress): void {
  outputBox.value =
    outputBox.value +
    "\n" +
    "inAppDeepLinkHandler: " +
    JSON.stringify(inAppButtonPress);
  outputBox.rows = outputBox.rows + 1;
}

function onInboxUpdatedHandler(): void {
  outputBox.value =
    outputBox.value + "\n" + "inboxUpdated"
  outputBox.rows = outputBox.rows + 1;
}

document
  .getElementById("set-user-id-button")
  .addEventListener("click", setUserId);

function setUserId(): void {
  Optimove.setUserId(
    (<HTMLInputElement>document.getElementById("text-area-user-id")).value
  ).then(() => {
    (<HTMLInputElement>document.getElementById("text-area-user-id")).value = "";
    success();
  }, error);
}

document
  .getElementById("report-event-button")
  .addEventListener("click", reportEvent);

function reportEvent(): void {
  var eventParams: string = (<HTMLInputElement>(
    document.getElementById("text-area-event-params")
  )).value;
  let eventParamsRec: Record<string, any>;
  if (eventParams === "") {
    eventParamsRec = null;
  } else {
    let eventParamsJson: JSON = JSON.parse(eventParams);
    for (let key in eventParamsJson) {
      eventParamsRec[key] = eventParamsJson[key];
     }
  }

  Optimove.reportEvent(
    (<HTMLInputElement>document.getElementById("text-area-event")).value,
    eventParamsRec
  ).then(() => {
    (<HTMLInputElement>document.getElementById("text-area-event")).value = "";
    (<HTMLInputElement>(
      document.getElementById("text-area-event-params")
    )).value = "";
    success();
  }, error);
}

document
  .getElementById("set-user-email-button")
  .addEventListener("click", setUserEmail);

function setUserEmail(): void {
  Optimove.setUserEmail(
    (<HTMLInputElement>document.getElementById("text-area-user-email")).value
  ).then(() => {
    (<HTMLInputElement>document.getElementById("text-area-user-email")).value =
      "";
    success();
  }, error);
}

document
  .getElementById("report-screen-visit-button")
  .addEventListener("click", reportScreenVisit);

function reportScreenVisit(): void {
  var screenCategory = (<HTMLInputElement>(
    document.getElementById("text-area-screen-category")
  )).value;
  if (screenCategory === "") {
    screenCategory = null;
  }
  Optimove.reportScreenVisit(
    (<HTMLInputElement>document.getElementById("text-area-screen-name")).value,
    screenCategory
  ).then(() => {
    (<HTMLInputElement>document.getElementById("text-area-screen-name")).value =
      "";
    (<HTMLInputElement>(
      document.getElementById("text-area-screen-category")
    )).value = "";
    success();
  }, error);
}
document
  .getElementById("register-user-button")
  .addEventListener("click", registerUser);

function registerUser() {
  Optimove.registerUser(
    (<HTMLInputElement>document.getElementById("text-area-user-id")).value,
    (<HTMLInputElement>document.getElementById("text-area-user-email")).value
  ).then(() => {
    (<HTMLInputElement>document.getElementById("text-area-user-id")).value = "";
    (<HTMLInputElement>document.getElementById("text-area-user-email")).value =
      "";
    success();
  }, error);
}
document
  .getElementById("get-visitor-id-button")
  .addEventListener("click", getVisitorId);

function getVisitorId(): void {
  Optimove.getVisitorId().then((visitorId) => {
    outputBox.value =
      outputBox.value + "\n" + "visitor id:" + visitorId;
    outputBox.rows = outputBox.rows + 1;
  }, error);
}

document
  .getElementById("push-register-button")
  .addEventListener("click", pushRegister);

function pushRegister(): void {
  Optimove.pushRegister().then(success, error);
}
document
  .getElementById("in-app-consent-true")
  .addEventListener("click", inAppUpdateConsentTrue);

function inAppUpdateConsentTrue(): void {
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

function inAppGetInboxItems(): void {
  Optimove.inAppGetInboxItems().then((inboxItemsArray) => {
    outputBox.value =
      outputBox.value +
      "\n" + "inbox items: "
    JSON.stringify(getInboxItemsForPrinting(inboxItemsArray));
    outputBox.rows = outputBox.rows + 1;
  }, error);
}
interface InboxItemSubset {
  id: number;
  isRead: boolean;
  sentAt: string;
}
function getInboxItemsForPrinting(inboxItemsArray: InAppInboxItem[]) {
  let subsetItemsList: InboxItemSubset[] = [];
  let item: InAppInboxItem;
  for (item of inboxItemsArray) {
    subsetItemsList.push({
      id: item.id,
      isRead: item.isRead,
      sentAt: item.sentAt.toISOString()
    });
  }
  return subsetItemsList;
}

document
  .getElementById("in-app-mark-all-inbox-items-as-read-button")
  .addEventListener("click", inAppMarkAllInboxItemsAsRead);

function inAppMarkAllInboxItemsAsRead(): void {
  Optimove.inAppMarkAllInboxItemsAsRead().then(success, error);
}

document
  .getElementById("in-app-mark-inbox-item-as-read-button")
  .addEventListener("click", inAppMarkAsRead);

function getInboxItemForTesting(): InAppInboxItem {
  var id = parseInt((<HTMLInputElement>(
    document.getElementById("text-area-in-app-inbox-item")
  )).value);

  if (isNaN(id)){
    alert("item id is required");
    return;
  }

  return {
    id: id,
    title: "test",
    subtitle: "test",
    availableFrom: null,
    availableTo: null,
    dismissedAt:  null,
    data: null,
    isRead: false,
    imageUrl:  null,
    sentAt: new Date(),
  };
}

function inAppMarkAsRead(): void {
  Optimove.inAppMarkAsRead(getInboxItemForTesting()).then(success, error);
}

document
  .getElementById("in-app-get-inbox-summary-button")
  .addEventListener("click", inAppGetInboxSummary);

function inAppGetInboxSummary(): void {
  Optimove.inAppGetInboxSummary().then((inboxSummary) => {
    outputBox.value = outputBox.value + "\n" + JSON.stringify(inboxSummary);
    outputBox.rows = outputBox.rows + 1;
  }, error);
}

document
  .getElementById("in-app-present-inbox-message-button")
  .addEventListener("click", inAppPresentInboxMessage);

function inAppPresentInboxMessage(): void {
  Optimove.inAppPresentInboxMessage(getInboxItemForTesting()).then(
    success,
    error
  );
}

document
  .getElementById("in-app-delete-inbox-message-button")
  .addEventListener("click", inAppDeleteMessageFromInbox);

function inAppDeleteMessageFromInbox(): void {
  Optimove.inAppDeleteMessageFromInbox(getInboxItemForTesting()).then(
    success,
    error
  );
}
