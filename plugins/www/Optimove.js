

var exec = require('cordova/exec');


window.initialize = function (inAppConsentStrategy, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'initialize', [inAppConsentStrategy]);
};
window.setUserId = function (userId, success, error) {
    exec(success, error, 'OptimobileSDKPlugin', 'setUserId', [userId]);
}
window.setUserEmail = function (userEmail, success, error) {
    exec(success, error, 'OptimobileSDKPlugin', 'setUserEmail', [userEmail]);
};
window.reportEvent = function (eventName, success, error) {
    exec(success, error, 'OptimobileSDKPlugin', 'reportEvent', [eventName]);
}