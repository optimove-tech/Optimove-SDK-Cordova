cordova.define("com-optimobilecreate-plugins.Optimobile", function(require, exports, module) {


var exec = require('cordova/exec');


window.initialize = function (optimove_credentials, optimove_mobile_credentials, success, error) {
    exec(success, error, 'OptimobileSDKPlugin', 'initialize', [optimove_credentials, optimove_mobile_credentials]);
};

});
