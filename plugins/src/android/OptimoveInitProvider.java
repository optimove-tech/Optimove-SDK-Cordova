package com.optimove.android.cordova;

import android.app.Application;
import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.res.Resources;
import android.database.Cursor;
import android.net.Uri;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.optimove.android.Optimove;
import com.optimove.android.OptimoveConfig;
import com.optimove.android.optimobile.OptimoveInApp;

public class OptimoveInitProvider extends ContentProvider {
    private static final String OPTIMOVE_CREDENTIALS = "optimoveCredentials";
    private static final String OPTIMOVE_MOBILE_CREDENTIALS = "optimoveMobileCredentials";
    private static final String IN_APP_AUTO_ENROLL = "autoEnroll";
    private static final String IN_APP_EXPLICIT_BY_USER = "explicitByUser";
    private static final String KEY_IN_APP_CONSENT_STRATEGY = "optimoveInAppConsentStrategy";

    @Override
    public boolean onCreate() {
        Application app = (Application) getContext().getApplicationContext();
        String packageName = app.getPackageName();
        Resources resources = app.getResources();
        String optimoveCredentials = getStringConfigValue(packageName, resources, OPTIMOVE_CREDENTIALS);
        String optimoveMobileCredentials = getStringConfigValue(packageName, resources, OPTIMOVE_MOBILE_CREDENTIALS);
        if (TextUtils.isEmpty(optimoveCredentials) || TextUtils.isEmpty(optimoveMobileCredentials)) {
            return true;
        }
        String inAppConsentStrategy = getStringConfigValue(packageName, resources, KEY_IN_APP_CONSENT_STRATEGY);
        assert optimoveCredentials != null;
        assert optimoveMobileCredentials != null;

        OptimoveConfig.Builder configBuilder = new OptimoveConfig.Builder(optimoveCredentials,
                optimoveMobileCredentials);

        if (IN_APP_AUTO_ENROLL.equals(inAppConsentStrategy)) {
            configBuilder.enableInAppMessaging(OptimoveConfig.InAppConsentStrategy.AUTO_ENROLL);
        } else if (IN_APP_EXPLICIT_BY_USER.equals(inAppConsentStrategy)) {
            configBuilder.enableInAppMessaging(OptimoveConfig.InAppConsentStrategy.EXPLICIT_BY_USER);
        }
        
        Optimove.initialize(app, configBuilder.build());

        if (IN_APP_AUTO_ENROLL.equals(inAppConsentStrategy) || IN_APP_EXPLICIT_BY_USER.equals(inAppConsentStrategy)) {
            OptimoveInApp.getInstance().setDeepLinkHandler(new OptimoveSDKPlugin.InAppDeepLinkHandler());
        }

        Optimove.getInstance().setPushActionHandler(new PushReceiver.PushActionHandler());


        return false;
    }

    @Nullable
    @Override
    public Cursor query(@NonNull Uri uri, @Nullable String[] projection, @Nullable String selection,
                        @Nullable String[] selectionArgs, @Nullable String sortOrder) {
        return null;
    }

    @Nullable
    @Override
    public String getType(@NonNull Uri uri) {
        return null;
    }

    @Nullable
    @Override
    public Uri insert(@NonNull Uri uri, @Nullable ContentValues values) {
        return null;
    }

    @Override
    public int delete(@NonNull Uri uri, @Nullable String selection, @Nullable String[] selectionArgs) {
        return 0;
    }

    @Override
    public int update(@NonNull Uri uri, @Nullable ContentValues values, @Nullable String selection,
                      @Nullable String[] selectionArgs) {
        return 0;
    }

    private String getStringConfigValue(String packageName, Resources resources, String key) {
        int resId = resources.getIdentifier(key, "string", packageName);
        if (0 == resId) {
            return null;
        }

        return resources.getString(resId);
    }
}