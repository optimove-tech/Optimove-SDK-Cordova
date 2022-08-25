package com.optimove.android.cordova;

import android.app.Application;
import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.Context;
import android.content.res.Resources;
import android.database.Cursor;
import android.net.Uri;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.optimove.android.Optimove;
import com.optimove.android.OptimoveConfig;
import com.optimove.android.optimobile.DeferredDeepLinkHandlerInterface;
import com.optimove.android.optimobile.DeferredDeepLinkHelper;
import com.optimove.android.optimobile.OptimoveInApp;

import org.json.JSONObject;

public class OptimoveInitProvider extends ContentProvider {
    private static final String KEY_OPTIMOVE_CREDENTIALS = "optimoveCredentials";
    private static final String KEY_OPTIMOVE_MOBILE_CREDENTIALS = "optimoveMobileCredentials";
    private static final String KEY_IN_APP_CONSENT_STRATEGY = "inAppConsentStrategy";

    private static final String IN_APP_AUTO_ENROLL = "auto-enroll";
    private static final String IN_APP_EXPLICIT_BY_USER = "explicit-by-user";

    private static final String ENABLE_DEFERRED_DEEP_LINKING = "enableDeferredDeepLinking";

    @Override
    public boolean onCreate() {
        Application app = (Application) getContext().getApplicationContext();
        String packageName = app.getPackageName();
        Resources resources = app.getResources();
        String optimoveCredentials = getStringConfigValue(packageName, resources, KEY_OPTIMOVE_CREDENTIALS);
        String optimoveMobileCredentials = getStringConfigValue(packageName, resources,
                KEY_OPTIMOVE_MOBILE_CREDENTIALS);
        String inAppConsentStrategy = getStringConfigValue(packageName, resources, KEY_IN_APP_CONSENT_STRATEGY);
        String enableDeferredDeepLinking = getStringConfigValue(packageName, resources, ENABLE_DEFERRED_DEEP_LINKING);
        if (optimoveCredentials == null && optimoveMobileCredentials == null) {
            throw new IllegalArgumentException(
                    "error: Invalid credentials! \n please provide at least one set of credentials");
        }

        OptimoveConfig.Builder configBuilder = new OptimoveConfig.Builder(optimoveCredentials,
                optimoveMobileCredentials);

        if (IN_APP_AUTO_ENROLL.equals(inAppConsentStrategy)) {
            configBuilder = configBuilder.enableInAppMessaging(OptimoveConfig.InAppConsentStrategy.AUTO_ENROLL);
        } else if (IN_APP_EXPLICIT_BY_USER.equals(inAppConsentStrategy)) {
            configBuilder = configBuilder.enableInAppMessaging(OptimoveConfig.InAppConsentStrategy.EXPLICIT_BY_USER);
        }
        if (Boolean.parseBoolean(enableDeferredDeepLinking)) {
            configBuilder = configBuilder.enableDeepLinking(getDDLHandler());
        }

        Optimove.initialize(app, configBuilder.build());

        if (IN_APP_AUTO_ENROLL.equals(inAppConsentStrategy) || IN_APP_EXPLICIT_BY_USER.equals(inAppConsentStrategy)) {
            OptimoveInApp.getInstance().setDeepLinkHandler(new OptimoveSDKPlugin.InAppDeepLinkHandler());
        }

        Optimove.getInstance().setPushActionHandler(new PushReceiver.PushActionHandler());
        OptimoveInApp.getInstance().setOnInboxUpdated(new OptimoveSDKPlugin.InboxUpdatedHandler());
        return true;
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

    private @Nullable String getStringConfigValue(String packageName, Resources resources, String key) {
        int resId = resources.getIdentifier(key, "string", packageName);
        if (0 == resId) {
            return null;
        }
        String value = resources.getString(resId);
        return TextUtils.isEmpty(value) ? null : value;
    }

    private DeferredDeepLinkHandlerInterface getDDLHandler() {
        return (Context context, DeferredDeepLinkHelper.DeepLinkResolution resolution, String link,
                DeferredDeepLinkHelper.DeepLink data) -> {
            try {
                JSONObject dataJson = null;
                if (null != data) {
                    JSONObject deepLinkContent = new JSONObject();
                    if (data.content != null) {
                        deepLinkContent.put("title", data.content.title);
                        deepLinkContent.put("description", data.content.description);
                    }
                    dataJson = new JSONObject();
                    dataJson.put("data", data.data != null ? data.data : null);
                    dataJson.put("content", deepLinkContent);
                    dataJson.put("url", data.url);

                }
                JSONObject deepLink = new JSONObject();
                deepLink.put("link", link);
                deepLink.put("resolution", resolution.ordinal());
                deepLink.put("data", dataJson);
                OptimoveSDKPlugin.pendingDDL = deepLink;
                OptimoveSDKPlugin.sendMessageToJs("deepLink", deepLink);
            } catch (Exception e) {
                e.printStackTrace();
            }
        };
    }
}