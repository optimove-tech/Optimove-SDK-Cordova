package com.optimove.android.cordova;

import android.os.Bundle;

import org.apache.cordova.*;

public class OptimoveMainActivity extends CordovaActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);

        Optimove.getInstance().seeIntent(getIntent(), savedInstanceState);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        Optimove.getInstance().seeInputFocus(hasFocus);
    }

    /*
     * If the main activity in AndroidManifest has android:launchMode="singleTop", add following lines as well.
     * It is advisable to have launch mode single top, as otherwise app link will create another copy of the
     * activity on top of the stack if activity is already running.
     */

    //@Override
    //protected void onNewIntent(Intent intent) {
    //    super.onNewIntent(intent);
    //    Optimove.getInstance().seeIntent(intent);
    //}
}
