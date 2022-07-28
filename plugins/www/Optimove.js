

var exec = require('cordova/exec');


window.initialize = function (inAppConsentStrategy, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'initialize', [inAppConsentStrategy]);
};
window.setUserId = function (userId, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'setUserId', [userId]);
}
window.setUserEmail = function (userEmail, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'setUserEmail', [userEmail]);
};

/* event params is nullable*/
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
    exec(success, error, 'OptimoveSDKPlugin', 'getVisitorId',[]);
};
window.getCurrentUserIdentifier = function (success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'getCurrentUserIdentifier', []);
};