package com.optimove.android.cordova;

import android.app.Application;
import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.Context;
import android.content.res.Resources;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.optimove.android.Optimove;
import com.optimove.android.OptimoveConfig;
import com.optimove.android.optimobile.DeferredDeepLinkHandlerInterface;
import com.optimove.android.optimobile.DeferredDeepLinkHelper;
import com.optimove.android.optimobile.OptimoveInApp;

import org.json.JSONException;
import org.json.JSONObject;
import org.apache.cordova.CordovaWebView;

public class OptimoveInitProvider extends ContentProvider {
    private static final String KEY_OPTIMOVE_CREDENTIALS = "optimoveCredentials";
    private static final String KEY_OPTIMOVE_MOBILE_CREDENTIALS = "optimoveMobileCredentials";
    private static final String KEY_IN_APP_CONSENT_STRATEGY = "optimoveInAppConsentStrategy";

    private static final String IN_APP_AUTO_ENROLL = "auto-enroll";
    private static final String IN_APP_EXPLICIT_BY_USER = "explicit-by-user";

    private static final String ENABLE_DEFERRED_DEEP_LINKING = "optimoveEnableDeferredDeepLinking";
    private static final String NOTIFICATION_ICON_KEY = "com.optimove.android.cordova.OptimoveInitProvider.notification_icon";
    private static final String TAG = "OptimoveInitProvider";

    private static final String SDK_VERSION = "2.0.2";
    private static final int RUNTIME_TYPE = 3;
    private static final int SDK_TYPE = 106;

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

        if (optimoveMobileCredentials == null) {
            Optimove.initialize(app, configBuilder.build());
            return true;
        }

        if (IN_APP_AUTO_ENROLL.equals(inAppConsentStrategy)) {
            configBuilder = configBuilder.enableInAppMessaging(OptimoveConfig.InAppConsentStrategy.AUTO_ENROLL);
        } else if (IN_APP_EXPLICIT_BY_USER.equals(inAppConsentStrategy)) {
            configBuilder = configBuilder.enableInAppMessaging(OptimoveConfig.InAppConsentStrategy.EXPLICIT_BY_USER);
        }
        if (Boolean.parseBoolean(enableDeferredDeepLinking)) {
            configBuilder = configBuilder.enableDeepLinking(getDDLHandler());
        }

        /**
        * Get notification icon from AndroidManifest metaData
        * Cordova config.xml example:
        *   <config-file target="app/src/main/AndroidManifest.xml" parent="/manifest/application">
        *     <meta-data
        *       android:name="com.optimove.android.cordova.OptimoveInitProvider.notification_icon"
        *       android:resource="@drawable/notification" />
        *   </config-file>
        */
        try {
            ApplicationInfo ai = app.getPackageManager().getApplicationInfo(packageName, PackageManager.GET_META_DATA);
            int smallIconId = ai.metaData.getInt(NOTIFICATION_ICON_KEY, ai.icon);
            configBuilder.setPushSmallIconId(smallIconId);
        }  catch (PackageManager.NameNotFoundException e) {
            Log.d(TAG, "Failed to load package metaData", e);
        } catch(Resources.NotFoundException e) {
            Log.d(TAG, "Failed to load notification icon", e);
        }

        overrideInstallInfo(configBuilder);

        Optimove.initialize(app, configBuilder.build());

        if (IN_APP_AUTO_ENROLL.equals(inAppConsentStrategy) || IN_APP_EXPLICIT_BY_USER.equals(inAppConsentStrategy)) {
            OptimoveInApp.getInstance().setDeepLinkHandler(new OptimoveSDKPlugin.InAppDeepLinkHandler());
        }

        Optimove.getInstance().setPushActionHandler(new PushReceiver.PushActionHandler());
        OptimoveInApp.getInstance().setOnInboxUpdated(new OptimoveSDKPlugin.InboxUpdatedHandler());

        return true;
    }

    private void overrideInstallInfo(OptimoveConfig.Builder configBuilder) {
        JSONObject sdkInfo = new JSONObject();
        JSONObject runtimeInfo = new JSONObject();

        try {
            sdkInfo.put("id", SDK_TYPE);
            sdkInfo.put("version", SDK_VERSION);
            runtimeInfo.put("id", RUNTIME_TYPE);
            runtimeInfo.put("version", CordovaWebView.CORDOVA_VERSION);

            configBuilder.setSdkInfo(sdkInfo);
            configBuilder.setRuntimeInfo(runtimeInfo);
        } catch (JSONException e) {
            e.printStackTrace();
        }
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

    private @Nullable
    String getStringConfigValue(String packageName, Resources resources, String key) {
        int resId = resources.getIdentifier(key, "string", packageName);
        if (0 == resId) {
            return null;
        }
        String value = resources.getString(resId);
        return TextUtils.isEmpty(value) ? null : value;
    }

    private DeferredDeepLinkHandlerInterface getDDLHandler() {
        return (Context context, DeferredDeepLinkHelper.DeepLinkResolution resolution, String link,
                @Nullable DeferredDeepLinkHelper.DeepLink data) -> {
            try {
                String mappedResolution;
                String url;
                JSONObject deepLinkContent = null;
                JSONObject linkData = null;

                switch (resolution) {
                    case LINK_MATCHED:
                        mappedResolution = "LINK_MATCHED";
                        url = data.url;

                        deepLinkContent = new JSONObject();
                        deepLinkContent.put("title", data.content.title);
                        deepLinkContent.put("description", data.content.description);

                        linkData = data.data;

                        break;
                    case LINK_NOT_FOUND:
                        mappedResolution = "LINK_NOT_FOUND";
                        url = link;
                        break;
                    case LINK_EXPIRED:
                        mappedResolution = "LINK_EXPIRED";
                        url = link;
                        break;
                    case LINK_LIMIT_EXCEEDED:
                        mappedResolution = "LINK_LIMIT_EXCEEDED";
                        url = link;
                        break;
                    case LOOKUP_FAILED:
                    default:
                        mappedResolution = "LOOKUP_FAILED";
                        url = link;
                        break;
                }

                JSONObject deepLink = new JSONObject();
                deepLink.put("resolution", mappedResolution);
                deepLink.put("url", url);
                deepLink.put("content", deepLinkContent == null ? JSONObject.NULL : deepLinkContent);
                deepLink.put("linkData", linkData == null ? JSONObject.NULL : linkData);

                if (OptimoveSDKPlugin.jsCallbackContext == null) {
                    OptimoveSDKPlugin.pendingDDL = deepLink;
                    return;
                }
                OptimoveSDKPlugin.sendMessageToJs("deepLink", deepLink);
            } catch (Exception e) {
                e.printStackTrace();
            }
        };
    }
}
