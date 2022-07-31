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

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    window.initialize("ExplicitByUser", success, error);
    alert('device ready');
}
function success(successMessage = "Success!") {
    console.log(successMessage);
}

function error(errorMessage) {
    console.error(errorMessage);
}

function initialize() {

    //window.initialize("ExplicitByUser", success, error);
    window.initBaseSdk(success, error);

}

document.getElementById("set-user-id-button").addEventListener("click", setUserId);

function setUserId() {
    window.setUserId(document.getElementById("text-area-user-id").value, success, error);
    document.getElementById("text-area-user-id").value = "";
}

document.getElementById("report-event-button").addEventListener("click", reportEvent);

function reportEvent() {
    var eventParams = document.getElementById("text-area-event-params").value;
    if (eventParams === "") {
        eventParams = null;
    }
    window.reportEvent(document.getElementById("text-area-event").value, eventParams, success, error)
    document.getElementById("text-area-event").value = ""
    document.getElementById("text-area-event-params").value = ""
}

document.getElementById("set-user-email-button").addEventListener("click", setUserEmail);

function setUserEmail() {
    window.setUserEmail(document.getElementById("text-area-user-email").value, success, error)
    document.getElementById("text-area-user-email").value = ""
}

document.getElementById("report-screen-visit-button").addEventListener("click", reportScreenVisit);

function reportScreenVisit() {
    var screenCategory = document.getElementById("text-area-screen-category").value;
    if (screenCategory === "") {
        screenCategory = null;
    }
    window.reportScreenVisit(document.getElementById("text-area-screen-name").value, screenCategory, success, error );
    document.getElementById("text-area-screen-name").value = "";
    document.getElementById("text-area-screen-category").value = "";
}
document.getElementById("register-user-button").addEventListener("click", registerUser);

function registerUser() {
    window.registerUser(document.getElementById("text-area-user-id").value, document.getElementById("text-area-user-email").value)
    document.getElementById("text-area-user-id").value = "";
    document.getElementById("text-area-user-email").value = "";
}
document.getElementById("get-visitor-id-button").addEventListener("click", getVisitorId);

function getVisitorId() {
    window.getVisitorId((visitorId) => { 

        document.getElementById("text-area-visitor-id").value = visitorId;

    },error).then((visitorId)=>{
        document.getElementById("text-area-visitor-id").value = visitorId
    });
}
document.getElementById("get-current-user-identifier-button").addEventListener("click", getCurrentUserIdentifier);

function getCurrentUserIdentifier() {
    window.getCurrentUserIdentifier((currentUserIdentifier) => {

        document.getElementById("text-area-current-user-identifier").value = currentUserIdentifier;

    }, error).then((visitorId) => {
        document.getElementById("text-area-current-user-identifier").value = visitorId
    });
}
/*
document.getElementById("push Campaigns Is Enabled").addEventListener("click", campaignsIsEnabled);

function campaignsIsEnabled() {
    Optimobile.updateConsent(true)
}

document.getElementById("get Inbox Items").addEventListener("click", getInbox);

function getInbox() {
    Optimobile.getInboxItems()
}




*/
