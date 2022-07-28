package com.optimove.android.cordova;

import org.apache.cordova.CordovaPlugin;

import java.nio.file.WatchEvent;

import org.apache.cordova.CallbackContext;
import com.optimove.android.Optimove;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class OptimoveSDKPlugin extends CordovaPlugin {
    private static final String SET_USER_ID = "setUserId";
    private static final String SET_USER_EMAIL = "setUserEmail";
    private static final String REPORT_EVENT = "reportEvent";
    private static final String REPORT_SCREEN_VISIT = "reportScreenVisit"; 
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
            case SET_USER_ID:
                String userId = args.getString(0);
                this.setUserId(userId, callbackContext);
                return true;
            case SET_USER_EMAIL:
                String email = args.getString(0);
                this.setUserEmail(email, callbackContext);
                return true;
            case REPORT_EVENT:
                String eventName = args.getString(0);
                this.reportEvent(eventName, callbackContext);
                return true;
            case REPORT_SCREEN_VISIT:
                String screenName = args.getString(0);
                String screenCategory = args.getString(1);
                this.reportScreenVisit(screenName, screenCategory, callbackContext);   
        }
        return false;
    }
    
    private void setUserId(String userId, CallbackContext callbackContext) {
        try {
            Optimove.getInstance().setUserId(userId);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }

        callbackContext.success();

    }

    private void setUserEmail(String email, CallbackContext callbackContext) {
        try {
            Optimove.getInstance().setUserEmail(email);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();
    }

    private void reportEvent(String eventName, CallbackContext callbackContext) {
        try {
            Optimove.getInstance().reportEvent(eventName);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();

    }

    private void reportScreenVisit(String screenName, String screenCategory, CallbackContext callbackContext) {
        try {
            Optimove.getInstance().reportScreenVisit(screenName,screenCategory);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();

    }
}