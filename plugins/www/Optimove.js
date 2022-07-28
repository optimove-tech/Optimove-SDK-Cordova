

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
window.reportEvent = function (eventName, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'reportEvent', [eventName]);
}

window.reportScreenVisit = function (screenName, screenCategory, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'reportScreenVisit', [screenName, screenCategory]);
}