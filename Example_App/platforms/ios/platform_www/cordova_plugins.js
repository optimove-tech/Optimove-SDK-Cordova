cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "optimove-cordova-plugin.Optimobile",
      "file": "plugins/optimove-cordova-plugin/www/Optimobile.js",
      "pluginId": "optimove-cordova-plugin",
      "clobbers": [
        "Optimobile"
      ]
    }
  ];
  module.exports.metadata = {
    "optimove-cordova-plugin": "1.0.0"
  };
});