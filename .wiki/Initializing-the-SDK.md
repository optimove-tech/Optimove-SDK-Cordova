
# Prerequisites
* iOS plugin installation requires [CocoaPods](https://cocoapods.org/) (sudo gem install cocoapods)
* The plugin depends on Promises. Ensure you have a [suitable promise polyfill](https://github.com/stefanpenner/es6-promise) available in your app runtime [if required](https://caniuse.com/#search=Promise)


# Initialization
To add the Optimove Cordova plugin to your project use: `cordova plugin add @optimove-inc/cordova-sdk` in the root directory of your project.

Depending on which features were enabled for your app you will be able to retreive the following credentials from your Mobile Marketing UI:

- **YOUR_OPTIMOVE_CREDENTIALS** – Your unique SDK token in order to identify your Optimove tenant
- **YOUR_OPTIMOVE_MOBILE_CREDENTIALS** – The mobile config used to identify your app bundle

Create a `optimove.json` file in your project's root directory with the following:

```json
{
  "optimoveCredentials": "YOUR_OPTIMOVE_CREDENTIALS",
  "optimoveMobileCredentials": "YOUR_OPTIMOVE_MOBILE_CREDENTIALS",
  "inAppConsentStrategy": "in-app-disabled|auto-enroll|explicit-by-user",
  "enableDeferredDeepLinking": false
}
```

After you modify `optimove.json` don't forget to run `cordova prepare <platform>`.

Finally, if you are using typescript please add 
``` files : ["./node_modules/@optimove-inc/cordova-sdk/index.d.ts"]``` to your tsconfig.json.

## ********************** Android **********************

Optimove Cordova SDK requires compileSdkVersion 31. Apps created with cordova 11 by default depend on `cordova-android@10.*` platform, which sets default compileSdkVersion to 30. If you are getting related errors, you can:

1. Override compileSdkVersion in config.xml:
```xml
<platform name="android">
	<preference name="android-targetSdkVersion" value="31" />
</platform>
```
2. Upgrade the dependency `cordova platform update android@11.0.0`
> Please note that the default android toolchains have moved to JDK11 now, you must use JDK11, at least if you change any of the Android API target versions to >=31.

### Other

(Optional) Optimove SDK includes Firebase Bill of Materials. You may override BoM version by adding build-extras.gradle to platforms/android/app with the following content.
```
ext {
    // Optimove supports [19.0.0, 22.99.99] Firebase Messaging version range,
    // which corresponds to [20.0.0, 28.99.99] Bill of Materials version range.
    OptimoveFirebaseBoMVersion = "28.2.0"
}
```

## ************************ iOS ************************

After you have added the plugin, please do
1. `cd app/platforms/ios` and  `pod install`
2. `cordova prepare ios`
3. After first adding ios platform you may need to open the project in Xcode and fix errors if any.

## ************** Typescript / Javascript **************

In either case you dont need to import anything from the plugin module. Types are available as ambient declarations. For example, in your `www/js/index.js` you can use global `Optimove` object like this:

```javascript
document.addEventListener('deviceready', function () {
    if (typeof Optimove === 'undefined') {
      console.info('Optimove plugin not found');
      return;
    }

    Optimove.setPushReceivedHandler(() => {});
}, false);
```



