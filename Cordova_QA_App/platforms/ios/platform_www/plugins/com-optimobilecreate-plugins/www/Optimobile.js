cordova.define("com-optimobilecreate-plugins.Optimobile", function(require, exports, module) {


var exec = require('cordova/exec');

window.setUserId = function(arg0, success, error){
    exec(success, error, 'OptimobileSDKPlugin', 'setUserId', [arg0]);
}
window.setUserEmail = function (arg0, success, error) {
    exec(success, error, 'OptimobileSDKPlugin', 'setUserEmail', [arg0]);
};
window.initialize = function (arg0, arg1, success, error) {
    exec(success, error, 'OptimobileSDKPlugin', 'initialize', [arg0, arg1]);
};
window.reportEvent = function(arg0, success, error){
    exec(success, error, 'OptimobileSDKPlugin', 'reportEvent', [arg0]);
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
    
  /*  exports.setUserId = function (arg0, success, error) {
        exec(success, error, 'OptimobileSDKPlugin', 'setUserId', [arg0]);
    };*/
    
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


});
