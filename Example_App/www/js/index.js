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


document.getElementById("set-user-id-button").addEventListener("click", setUserId);

function setUserId() {
    Optimove.setUserId(document.getElementById("text-area-user-id").value).then(() => {
        document.getElementById("text-area-user-id").value = "";
        success();
    }, error);

}

document.getElementById("report-event-button").addEventListener("click", reportEvent);

function reportEvent() {
    var eventParams = document.getElementById("text-area-event-params").value;
    if (eventParams === "") {
        eventParams = null;
    }
    Optimove.reportEvent(document.getElementById("text-area-event").value, eventParams).then(() => {
        document.getElementById("text-area-event").value = "";
        document.getElementById("text-area-event-params").value = "";
        success();
    }, error);

}

document.getElementById("set-user-email-button").addEventListener("click", setUserEmail);

function setUserEmail() {
    Optimove.setUserEmail(document.getElementById("text-area-user-email").value).then(() => {
        document.getElementById("text-area-user-email").value = "";
        success();
    }, error);

}

document.getElementById("report-screen-visit-button").addEventListener("click", reportScreenVisit);

function reportScreenVisit() {
    var screenCategory = document.getElementById("text-area-screen-category").value;
    if (screenCategory === "") {
        screenCategory = null;
    }
    Optimove.reportScreenVisit(document.getElementById("text-area-screen-name").value, screenCategory).then(() => {
        document.getElementById("text-area-screen-name").value = "";
        document.getElementById("text-area-screen-category").value = "";
        success();
    }, error);

}
document.getElementById("register-user-button").addEventListener("click", registerUser);

function registerUser() {
    Optimove.registerUser(document.getElementById("text-area-user-id").value, document.getElementById("text-area-user-email").value).then(() => {
        document.getElementById("text-area-user-id").value = "";
        document.getElementById("text-area-user-email").value = "";
        success();
    }, error);

}
document.getElementById("get-visitor-id-button").addEventListener("click", getVisitorId);

function getVisitorId() {
    Optimove.getVisitorId().then((visitorId) => {

        document.getElementById("text-area-visitor-id").value = visitorId;

    }, error);
}
document.getElementById("get-current-user-identifier-button").addEventListener("click", getCurrentUserIdentifier);

function getCurrentUserIdentifier() {
    Optimove.getCurrentUserIdentifier().then((visitorId) => {
        document.getElementById("text-area-current-user-identifier").value = visitorId
    }, error);
}

