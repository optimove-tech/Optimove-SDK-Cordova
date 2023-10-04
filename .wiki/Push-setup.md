# Configuration

Optimove SDK provides all functionality to handle push registration & notifications using FCM and APNS.

## ************** Android **************

To integrate into your Android project, you have to complete the following steps:

### Set up a Firebase Project & enable FCM

Set up an [FCM project](https://firebase.google.com/docs/cloud-messaging/) and configure push for your app.

Optimove requires a service account to execute campaigns for your FCM project. This service account should contain a custom role with just one permission - `cloudmessaging.messages.create` (you can read about custom roles [here](https://cloud.google.com/iam/docs/understanding-custom-roles), about this specific permission [here](https://firebase.google.com/docs/projects/iam/permissions#messaging))

Follow these steps to generate this key:

1. Go to your Google Cloud Platform console
2. Navigate to IAM  & Admin
3. Navigate to Roles
4. Click on "Create Role" at the top
5. Fill the fields (As a name you can choose something like 'Optimove FCM')
6. Click on "Add Permissions"
7. Search for `cloudmessaging.messages.create` and choose it
8. Click create
9. Navigate to Service Accounts
10. Click on "Create Service Account" at the top
11. Select the custom role you created in 8
12. Click done
13. Click on the service account you generated
14. Generate a key to this service account

If you have multiple App projects (for example, one for production and one for staging), you must perform this step for each project.

> Please note it is the Google Service Account private key JSON file that needs to be uploaded to your mobile UI, not the Google Services JSON file you include in your app project.

## Configure Mobile Push Channel

Access your Optimove dashboard and select 'Settings' then under the 'OptiMobile' section, select 'Mobile Push Config' 

Click the cog icon in the row for Android and in the popup when prompted enter the credentials for FCM.

### Integrate SDK components with your Android project

1. Add `google-services.json` file from your Firebase app 'General' settings to the root of your Cordova project.
2. run `cordova prepare android`


## ************** iOS **************

To integrate into your iOS project, you have to complete the following steps:

### Generate credentials

In order to generate a P8 key for Apple services first access your account at `https://developer.apple.com/` and select 'Certificates, Identifiers & Profiles', then select 'Keys' on the left.

<img width="1278" alt="apple-keys" src="https://user-images.githubusercontent.com/106683327/193060264-70b0b1ff-6b3f-4bd6-a728-28340c8967ff.png">


Select 'Create a Key' and on the form 'Register a New Key' enter a meaningful name such as 'APNS Access Key' and check the 'Enable' checkbox for 'Apple Push Notifications service (APNs)', click 'Continue'.

<img width="1229" alt="register-key" src="https://user-images.githubusercontent.com/106683327/193060578-f848bb97-bb87-4ab9-b8f2-a7e75e042ced.png">


On the confirmation screen double check the APNs enablement is set then click 'Register'

On the final screen take note of your KeyID and download the key. Note that you can only download the key once, if lost the key must be revoked and re-created.

Downloading the key will save a `.p8` file with the access credentials.

You now have all the details to configure your Mobile push channel. Access your Optimove dashboard and select 'Settings' then under the 'OptiMobile' section, select 'Mobile Push Config' and click the cog next to the Apple icon. Select APNs P8 and select your file, enter your other details and click 'Configure'.

### Configure your app capabilities and entitlements

In your app project settings use the "+ capability" button to add the `Background Modes` and `Push Notifications` capabilities, in `Background Modes` you should have the "Remote Notifications" mode checked.

> Note you must use a real device to test push notifications on iOS because simulators cannot register for push notifications.

### Supporting Pictures and Action Buttons in Notifications

When sending a push notification you can attach a picture or action buttons to it. They will show on iOS 10+ devices.

The notification will expand upon swiping the notification on devices supporting 3D Touch. In order to enable this functionality you need to add a Notification Service Extension to your application.

In order to enable Optimove to track the push notifications, you'll need to add a `Notification Service Extension` to your project for each App-target. This app extension creates a process that handles incoming Push Notifications manipulation. To add this extension to your app please follow the steps below:

1. Select `File > New > Target` on XCode
2. Select the Notification Service Extension target from the `iOS > Application` section
![add-nse](https://user-images.githubusercontent.com/106683327/193061361-c122eb01-315a-4059-af56-af40866f82dd.png)

3. Click `Next`
4. Specify a name for your extension
5. Click `Finish`
6. In your `Podfile` add a new target matching the extension's name
7. Add the `OptimoveNotificationServiceExtension` SDK to the target's dependencies list

If using CocoaPods, add the following to your Podfile and run `pod install`.

**`Podfile` code snippet**

```ruby
# The Optimove SDK supports iOS version 10 and higher
platform :ios, '10.0'

target 'My Application' do # Your app target
  use_frameworks!
  # added by plugin
  pod 'OptimoveCore', '~> 5.1' 
  pod 'OptimoveSDK', '~> 5.1'
end

target 'My Notification Extension' do # Your new extension target
  use_frameworks!
  pod 'OptimoveNotificationServiceExtension', '~> 5.1'
end
```

Then replace the contents of `NotificationService.swift` with the following lines:

```swift
import UserNotifications
import OptimoveNotificationServiceExtension

class NotificationService: UNNotificationServiceExtension {
    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        OptimoveNotificationService.didReceive(request, withContentHandler: contentHandler)
    }
}
```

Optimove's helper function automatically adds picture attachments and buttons to the notification content. You can modify the content before calling `didReceive` or replace the implementation with your own.

### Supporting push delivery tracking, dismissed tracking and badges

For push delivery tracking, dismissed tracking and badges to work correctly you need to

1. Set up a Notification Service Extension as described above
2. Add the `App Groups` capability to your App and Notification Service Extension targets
3. Set group to `group.{your.bundle.identifier}.optimove` for both targets

> Note that due to iOS limitations badge is not set when app is in the foreground

Additionally, SDK gives you full control of when to clear the badge. For example, you can clear it when the app enters foreground by modifying your `AppDelegte.m` like so:

```objective-c
- (void)applicationWillEnterForeground:(UIApplication *)application{
    UIApplication.sharedApplication.applicationIconBadgeNumber = 0;
}
```
## ************** Typescript / Javascript **************

To register for push notifications call 
```typescript
Optimove.pushRequestDeviceToken();
```

The following sample code shows how to use Optimove to handle push notifications.

```typescript
Optimove.setPushOpenedHandler((push: PushNotification) => {
    // Called when a user taps on a push notification or its action buttons
});

Optimove.setPushReceivedHandler((push: PushNotification) => {
    // Called when a push is received with your app in the foreground
});
```