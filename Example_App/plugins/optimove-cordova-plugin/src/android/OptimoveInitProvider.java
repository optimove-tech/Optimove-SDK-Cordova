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

public class OptimoveInitProvider extends ContentProvider {
    private static final String OPTIMOVE_CREDENTIALS = "optimove_credentials";
    private static final String OPTIMOVE_MOBILE_CREDENTIALS = "optimove_mobile_credentials";

    @Override
    public boolean onCreate() {
        Application app = (Application) getContext().getApplicationContext();
        String packageName = app.getPackageName();
        Resources resources = app.getResources();
        String optimove_credentials = getStringConfigValue(packageName, resources, OPTIMOVE_CREDENTIALS);
        String optimove_mobile_credentials = getStringConfigValue(packageName, resources, OPTIMOVE_MOBILE_CREDENTIALS);
        if (TextUtils.isEmpty(optimove_credentials) || TextUtils.isEmpty(optimove_mobile_credentials)) {
            return true;
        }
        assert optimove_credentials != null;
        assert optimove_mobile_credentials != null;
        OptimoveConfig.Builder configBuilder = new OptimoveConfig.Builder(optimove_credentials,
                optimove_mobile_credentials);
        Optimove.initialize(app, configBuilder.build());
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