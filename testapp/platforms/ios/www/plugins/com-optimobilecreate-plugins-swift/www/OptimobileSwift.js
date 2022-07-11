
cordova.define("com-optimobilecreate-plugins-swift.OptimobileSwift", function(require, exports, module) {
    var exec = require('cordova/exec');
    
    exports.setInstallId = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'setInstallId', [arg0]);
    };
    
    exports.initialize = function (arg0, arg1, success, error) {
        exec(success, error, 'OptimobileSwift', 'initialize', [arg0, arg1]);
    };
    
    exports.pushCampaignsIsEnabled = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'pushCampaignsIsEnabled', [arg0]);
    };
    
    exports.getVisitorID = function() {
        return new Promise(function (resolve, reject){
            exec(resolve, reject, 'OptimobileSwift', 'getVisitorID');
        })
    };
    
    exports.getInboxItems = function (arg0, success, error) {
        exec(success, error, 'OptimobileSwift', 'getInboxItems', [arg0]);
    };
});

