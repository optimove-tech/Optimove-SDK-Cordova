

var exec = require('cordova/exec');


window.initBaseSdk = function (success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'initBaseSdk', []);
};

window.setUserId = function (userId, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'setUserId', [userId]);
}
window.setUserEmail = function (userEmail, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'setUserEmail', [userEmail]);
};

/* eventParams is nullable*/
window.reportEvent = function (eventName, eventParams, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'reportEvent', [eventName, eventParams]);
}

/* screenCategory parameter is nullable*/
window.reportScreenVisit = function (screenName, screenCategory, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'reportScreenVisit', [screenName, screenCategory]);
}
window.registerUser = function (userId, userEmail, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'registerUser', [userId, userEmail]);
}

window.getVisitorId = function (success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'getVisitorId', []);
};
window.getCurrentUserIdentifier = function (success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'getCurrentUserIdentifier', []);
};

window.pushRegister = function (success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'pushRegister', []);
};
window.inAppUpdateConsent = function (consented, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'inAppUpdateConsent', [consented]);
}
