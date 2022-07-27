cordova.define("optimove-cordova-plugin.Optimove", function(require, exports, module) {


var exec = require('cordova/exec');


window.initialize = function (inAppConsentStrategy, success, error) {
    exec(success, error, 'OptimoveSDKPlugin', 'initialize', [inAppConsentStrategy]);
};

});
