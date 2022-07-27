cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "optimove-cordova-plugin.Optimove",
      "file": "plugins/optimove-cordova-plugin/www/Optimove.js",
      "pluginId": "optimove-cordova-plugin",
      "clobbers": [
        "Optimove"
      ]
    }
  ];
  module.exports.metadata = {
    "optimove-cordova-plugin": "1.0.0"
  };
});