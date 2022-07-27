cordova.define("com-optimobilecreate-plugins.Optimobile", function(require, exports, module) {


var exec = require('cordova/exec');

window.setUserId = function(userId, success, error){
    exec(success, error, 'OptimobileSDKPlugin', 'setUserId', [userId]);
}
window.setUserEmail = function (userEmail, success, error) {
    exec(success, error, 'OptimobileSDKPlugin', 'setUserEmail', [userEmail]);
};
    window.initialize = function (optimove_credentials, optimove_mobile_credentials, success, error) {
        exec(success, error, 'OptimobileSDKPlugin', 'initialize', [optimove_credentials, optimove_mobile_credentials]);
};
window.reportEvent = function(eventName, success, error){
    exec(success, error, 'OptimobileSDKPlugin', 'reportEvent', [eventName]);
}
cordova.define("com-optimobilecreate-plugins.Optimobile", function(require, exports, module) {
    
    
    exports.setInstallId = function (arg0, success, error) {
        exec(success, error, 'OptimobileSDKPlugin', 'setInstallId', [arg0]);
    };
    
    exports.initialize = function (arg0, arg1, success, error) {
        exec(success, error, 'OptimobileSDKPlugin', 'initialize', [arg0, arg1]);
    };
    
    exports.updateConsent = function (arg0, success, error) {
        exec(success, error, 'OptimobileSDKPlugin', 'updateConsent', [arg0]);
    };
    
    exports.reportEvent = function (arg0, success, error) {
        exec(success, error, 'OptimobileSDKPlugin', 'reportEvent', [arg0]);
    };
    
    exports.reportScreenVisit = function (arg0, success, error) {
        exec(success, error, 'OptimobileSDKPlugin', 'reportScreenVisit', [arg0]);
    };
    
    
    exports.registerUser = function (arg0, success, error) {
        exec(success, error, 'OptimobileSDKPlugin', 'registerUser', [arg0]);
    };
    
    exports.getVisitorID = function() {
        return new Promise(function (resolve, reject){
            exec(resolve, reject, 'OptimobileSDKPlugin', 'getVisitorID');
        })
    };
    
    exports.setUserEmail = function (arg0, success, error) {
        exec(success, error, 'OptimobileSDKPlugin', 'setUserEmail', [arg0]);
    };
    
    exports.getInboxItems = function (arg0, success, error) {
        exec(success, error, 'OptimobileSDKPlugin', 'getInboxItems', [arg0]);
    };
});

window.initialize = function (optimove_credentials, optimove_mobile_credentials,inAppConsentStrategy, success, error) {
    exec(success, error, 'OptimobileSDKPlugin', 'initialize', [optimove_credentials, optimove_mobile_credentials, inAppConsentStrategy]);
};

});
