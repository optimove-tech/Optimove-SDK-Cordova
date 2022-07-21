cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "com-optimobilecreate-plugins-swift.OptimobileSwift",
      "file": "plugins/com-optimobilecreate-plugins-swift/www/OptimobileSwift.js",
      "pluginId": "com-optimobilecreate-plugins-swift",
      "clobbers": [
        "optimobileswift"
      ]
    },
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
    "cordova-plugin-add-swift-support": "2.0.2",
    "com-optimobilecreate-plugins-swift": "0.0.1",
    "com-optimobilecreate-plugins": "0.0.1"
  };
});