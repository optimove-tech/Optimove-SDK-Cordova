#!bin/zsh

# Create a cordova app
cordova create test-app com.example.testapp TestApp

# Change directory to the app
cd test-app

# Add the android platform
cordova platform add android

# Add the ios platform
cordova platform add ios

# Add the plugin
cordova plugin add ../cordova-sdk

# Build the app
cordova build
