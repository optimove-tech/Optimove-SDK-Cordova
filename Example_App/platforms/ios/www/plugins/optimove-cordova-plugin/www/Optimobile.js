cordova.define("optimove-cordova-plugin.Optimobile", function(require, exports, module) {


var exec = require('cordova/exec');


window.initialize = function (inAppConsentStrategy, success, error) {
    exec(success, error, 'OptimobileSDKPlugin', 'initialize', [inAppConsentStrategy]);
};

});
