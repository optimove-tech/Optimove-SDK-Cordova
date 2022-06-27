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
  
  exports.getInboxItems = function (arg0, success, error) {
      exec(success, error, 'OptimobileSwift', 'getInboxItems', [arg0]);
  };
  
  exports.setInstallIdjs = function(arg0, arg1, success, error) {
    if (arg0 && typeof(arg0) === 'string' && arg0.length > 0) {
        success(arg0);
      } else {
        error('Empty message!');
      }
    };
  
    exports.initializejs = function(arg0, success, error) {
      if (arg0 && typeof(arg0) === 'string' && arg0.length > 0 && arg1 && typeof(arg1) === 'string' && arg1.length > 0) {
        success(arg0);
      } else {
        error('Empty message!');
      }
    };
  
    exports.pushCampaignsIsEnabledjs = function(arg0, success, error) {
      if (arg0 && typeof(arg0) === 'string' && arg0.length > 0) {
        success(arg0);
      } else {
        error('Empty message!');
      }
    };
  
    exports.getInboxItemsjs = function(arg0, success, error) {
      if (arg0 && typeof(arg0) === 'string' && arg0.length > 0) {
        success(arg0);
      } else {
        error('Empty message!');
      }
    };
  });
  