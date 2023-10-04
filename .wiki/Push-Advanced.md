### Changing the Push Icon (only for Android)

To change the push icon, you need to follow this guide.

1. #### Create an icon

    Create a new icon for your push notifications. The icon should be a white-on-transparent background image. The icon should be named `notification.png` (this name will used at point 3).

    > Make sure to comply with the [status bar icon guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_status_bar.html) so the icon renders correctly on all devices. For help preparing assets, we suggest checking out the [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/index.html)

    > Note that the icon must be a drawable, not a mipmap resource.

2. #### Add the icon to your project

    Add the icon to your Android project's `res/drawable` folder. 

3. #### Add the icon to your `config.xml` file

    ```xml
    <config-file target="app/src/main/AndroidManifest.xml" parent="/manifest/application">
        <meta-data
            android:name="com.optimove.android.cordova.OptimoveInitProvider.notification_icon"
            android:resource="@drawable/notification" />
    </config-file>
    ```

