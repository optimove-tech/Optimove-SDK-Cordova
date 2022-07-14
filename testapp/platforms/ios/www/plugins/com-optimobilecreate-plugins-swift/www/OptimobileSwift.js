
cordova.define("com-optimobilecreate-plugins-swift.OptimobileSwift", function(require, exports, module) {
    var exec = require('cordova/exec');
    
    exports.setInstallId = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'setInstallId', [arg0]);
    };
    
    exports.initialize = function (arg0, arg1, success, error) {
        exec(success, error, 'OptimobileSwift', 'initialize', [arg0, arg1]);
    };
    
    exports.updateConsent = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'updateConsent', [arg0]);
    };
    
    exports.reportEvent = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'reportEvent', [arg0]);
    };
    
    exports.reportScreenVisit = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'reportScreenVisit', [arg0]);
    };
    
    exports.setUserId = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'setUserId', [arg0]);
    };
    
    exports.registerUser = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'registerUser', [arg0]);
    };
    
    exports.getVisitorID = function() {
        return new Promise(function (resolve, reject){
            exec(resolve, reject, 'OptimobileSwift', 'getVisitorID');
        })
    };
    
    exports.setUserEmail = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'setUserEmail', [arg0]);
    };
    
    exports.getInboxItems = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'getInboxItems', [arg0]);
    };
});

