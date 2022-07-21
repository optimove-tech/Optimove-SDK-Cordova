cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "com-optimobilecreate-plugins.Optimobile",
      "file": "plugins/com-optimobilecreate-plugins/www/optimobile-sdk-plugin.js",
      "pluginId": "com-optimobilecreate-plugins",
      "clobbers": [
        "optimobile"
      ]
    }
  ];
  module.exports.metadata = {
    "com-optimobilecreate-plugins": "0.0.1",
    "cordova-plugin-add-swift-support": "2.0.2"
  };
});