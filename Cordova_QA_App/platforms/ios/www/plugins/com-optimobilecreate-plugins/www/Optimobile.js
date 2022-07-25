cordova.define("com-optimobilecreate-plugins.Optimobile", function(require, exports, module) {


var exec = require('cordova/exec');


window.initialize = function (arg0, arg1, success, error) {
    exec(success, error, 'OptimobileSDKPlugin', 'initialize', [arg0, arg1]);
};

});
