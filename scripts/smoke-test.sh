#!bin/zsh

# Stop on error
set -e

# Change directory to the app
cd ExampleApp

# Add the android platform
cordova platform add android

# Add the ios platform
cordova platform add ios

# Add the plugin
cordova plugin add ../cordova-sdk

# Build the app
cordova build | xcbeautify
