#!bin/zsh

# Stop on error
set -e
set -o pipefail

# Check if the app name is passed as an argument
if [ -z "$1" ]; then
    echo "No AppName supplied as the first argument"
    exit 1
fi

# Change directory to the app. Pass the app name as the first argument
cd $1

# Add the android platform
cordova platform add android

# Add the ios platform
cordova platform add ios

# Add the plugin
cordova plugin add ../cordova-sdk

# Build the app
cordova build |
    xcbeautify -q --is-ci
