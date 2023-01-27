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

function deepLinkHandler(deepLink: DeepLink): void {
 showMessage("deepLinkHandler: " + JSON.stringify(deepLink));
}
function pushReceivedHandler(pushMessage: PushNotification): void {
  showMessage("pushReceivedHandler: " + JSON.stringify(pushMessage));
}

function pushOpenedHandler(pushMessage: PushNotification): void {
  showMessage("pushOpenedHandler: " +
    JSON.stringify(pushMessage));
}

function inAppDeepLinkHandler(inAppButtonPress: InAppButtonPress): void {
  showMessage(
    "inAppDeepLinkHandler: " +
    JSON.stringify(inAppButtonPress));
}

function onInboxUpdatedHandler(): void {
 showMessage("inboxUpdated");
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
  const paramsInput: string = (<HTMLInputElement>(
    document.getElementById("text-area-event-params")
  )).value;

  var params: Record<string, any> | null = null;
  if (paramsInput !== ""){
      params = JSON.parse(paramsInput);
  }

  const eventType = (<HTMLInputElement>document.getElementById("text-area-event")).value;

  Optimove.reportEvent(
    eventType,
    params
  ).then(() => {
    (<HTMLInputElement>document.getElementById("text-area-event")).value = "";
    (<HTMLInputElement>( document.getElementById("text-area-event-params"))).value = "";
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
  const screenName = (<HTMLInputElement>document.getElementById("text-area-screen-name")).value;
  var screenCategory: string | undefined =  (<HTMLInputElement>(document.getElementById("text-area-screen-category"))).value;
  if (screenCategory === "") {
    screenCategory = undefined;
  }

  Optimove.reportScreenVisit(
    screenName,
    screenCategory
  ).then(() => {
    (<HTMLInputElement>document.getElementById("text-area-screen-name")).value ="";
    (<HTMLInputElement>(document.getElementById("text-area-screen-category"))).value = "";
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
  .getElementById("sign-out-user-button")
  .addEventListener("click", signOutUser);

function signOutUser() {
  Optimove.signOutUser().then(success, error);
}

document
  .getElementById("get-visitor-id-button")
  .addEventListener("click", getVisitorId);

function getVisitorId(): void {
  Optimove.getVisitorId().then((visitorId) => {
    showMessage("visitor id:" + visitorId);
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
    showMessage("inbox items: " +
    JSON.stringify(getInboxItemsForPrinting(inboxItemsArray)));
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

function getInboxItemForTesting(): InAppInboxItem | null {
  var id = parseInt((<HTMLInputElement>(
    document.getElementById("text-area-in-app-inbox-item")
  )).value);

  if (isNaN(id)){
    alert("item id is required");
    return null;
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
  let item = getInboxItemForTesting();
  if (item === null){
    return;
  }
  Optimove.inAppMarkAsRead(item).then(success, error);
}

document
  .getElementById("in-app-get-inbox-summary-button")
  .addEventListener("click", inAppGetInboxSummary);

function inAppGetInboxSummary(): void {
  Optimove.inAppGetInboxSummary().then((inboxSummary: InAppInboxSummary) => {
    showMessage(JSON.stringify(inboxSummary));
  }, error);
}

document
  .getElementById("in-app-present-inbox-message-button")
  .addEventListener("click", inAppPresentInboxMessage);

function inAppPresentInboxMessage(): void {
  let item = getInboxItemForTesting();
  if (item === null){
    return;
  }
  Optimove.inAppPresentInboxMessage(item).then(
    success,
    error
  );
}

document
  .getElementById("in-app-delete-inbox-message-button")
  .addEventListener("click", inAppDeleteMessageFromInbox);

function inAppDeleteMessageFromInbox(): void {
  let item = getInboxItemForTesting();
  if (item === null){
    return;
  }
  Optimove.inAppDeleteMessageFromInbox(item).then(
    success,
    error
  );
}

// HELPERS
document
.getElementById("text-area-clear")
.addEventListener("click", clearOutput);

function clearOutput(){
 let outputBox: HTMLTextAreaElement = <HTMLTextAreaElement>
   document.getElementById("text-area-output");
   outputBox.value = "";
}

function showMessage(message: string) {
  outputBox.value =
    outputBox.value + "\n" + message;
  outputBox.rows = outputBox.rows + 1;
}

function success(): void {
  let successMessage: string = "Success!";
   alert(successMessage);
 }

 function error(errorMessage: string): void {
   alert(errorMessage);
 }
