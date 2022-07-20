cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "com-optimobilecreate-plugins.OptimobileSwift",
      "file": "plugins/com-optimobilecreate-plugins/www/OptimobileSwift.js",
      "pluginId": "com-optimobilecreate-plugins",
      "clobbers": [
        "optimobileswift"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-add-swift-support": "2.0.2",
    "com-optimobilecreate-plugins-swift": "0.0.1"
  };
});
