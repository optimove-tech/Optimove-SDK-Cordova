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
    window.initialize("WzEsIm15LXRva2VuIiwibXktY29uZmlnLWZpbGUiXQ==", "WzEsImV1LWNlbnRyYWwtMSIsIjE5ZGY1ZTc3LTJhNmMtNGIzZC05YmI5LWNiNTQ0MDgwMmEyNiIsIlMxTksyWjBMSVpWeVl6eVk4bnB0RlAzQjBpSDVjbU50RU5pSSJd");
    alert('device ready');
}

document.getElementById("Initialize").addEventListener("click", initialize);

function initialize() {
    window.initialize("WzEsIm15LXRva2VuIiwibXktY29uZmlnLWZpbGUiXQ==", "WzEsImV1LWNlbnRyYWwtMSIsIjE5ZGY1ZTc3LTJhNmMtNGIzZC05YmI5LWNiNTQ0MDgwMmEyNiIsIlMxTksyWjBMSVpWeVl6eVk4bnB0RlAzQjBpSDVjbU50RU5pSSJd",(successMessage)=>{
        console.log(successMessage);
    },(errorMessage)=>{
        console.log(errorMessage);
    })
}



document.getElementById("push Campaigns Is Enabled").addEventListener("click", campaignsIsEnabled);

function campaignsIsEnabled() {
    Optimobile.updateConsent(true)
}

document.getElementById("get Inbox Items").addEventListener("click", getInbox);

function getInbox() {
    Optimobile.getInboxItems()
}

document.getElementById("report-event-button").addEventListener("click", reportEvent);

function reportEvent() {
    window.reportEvent( document.getElementById("text-area-event").value,(successMessage)=>{
        console.log(successMessage);
    },(errorMessage)=>{
        console.log(errorMessage);
    })
    document.getElementById("text-area-event").value = ""
}

document.getElementById("Report Screen Visit").addEventListener("click", reportScreenVisit);

function reportScreenVisit() {
    Optimobile.reportScreenVisit("screenTitle", "screenCategory")
}

document.getElementById("Register User").addEventListener("click", registerUser);

function registerUser() {
    Optimobile.registerUser(document.getElementById("text-area-user-id").value,  document.getElementById("textareauseremail").value)
    document.getElementById("text-area-user-id").value = "";
    document.getElementById("textareauseremail").value = "";
}


function setUserId() {
    window.setUserId(document.getElementById("text-area-user-id").value,(success)=>{
        console.log(success);
    },(error) => {
        console.log(error);
    });
    document.getElementById("text-area-user-id").value = "";
}

document.getElementById("set-user-id-button").addEventListener("click", setUserId);


document.getElementById("set-user-email-button").addEventListener("click", setUserEmail);

function setUserEmail() {
    window.setUserEmail(document.getElementById("text-area-user-email").value)
    document.getElementById("text-area-user-email").value = ""
}

document.getElementById("Get Visitor ID").addEventListener("click", getVisitorID);

function getVisitorID() {
    Optimobile.getVisitorID().then(function (visitorId) {
        document.getElementById("textareav").value = visitorId
    })
}