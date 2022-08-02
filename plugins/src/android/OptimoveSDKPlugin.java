package com.optimove.android.cordova;

import org.apache.cordova.CordovaPlugin;

import java.nio.file.WatchEvent;
import java.util.Map;

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
    private static final String REGISTER_USER = "registerUser";
    private static final String GET_VISITOR_ID = "getVisitorId";
    private static final String GET_CURRENT_USER_IDENTIFIER = "getCurrentUserIdentifier";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
        case SET_USER_ID:
            this.setUserId(args, callbackContext);
            return true;
        case SET_USER_EMAIL:
            this.setUserEmail(args, callbackContext);
            return true;
        case REPORT_EVENT:
            this.reportEvent(args, callbackContext);
            return true;
        case REPORT_SCREEN_VISIT:
            reportScreenVisit(args, callbackContext);
            return true;
        case REGISTER_USER:
            this.registerUser(args, callbackContext);
            return true;
        case GET_VISITOR_ID:
            this.getVisitorId(callbackContext);
            return true;
        case GET_CURRENT_USER_IDENTIFIER:
            this.getCurrentUserIdentifier(callbackContext);
            return true;
        }
        return false;
    }

    private void setUserId(JSONArray args, CallbackContext callbackContext) {

        try {
            String userId = args.getString(0);
            Optimove.getInstance().setUserId(userId);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }

        callbackContext.success();

    }

    private void setUserEmail(JSONArray args, CallbackContext callbackContext) {
        try {
            String email = args.getString(0);
            Optimove.getInstance().setUserEmail(email);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();
    }

    private void reportEvent(JSONArray args, CallbackContext callbackContext) {
        try {
            reportEvent(args, callbackContext);
            String eventName = args.getString(0);
            JSONObject params = args.optJSONObject(1);
            if (params == null) {
                this.reportEvent(eventName, callbackContext);
            } else {
                reportEvent(eventName, params, callbackContext);
            }
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }

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

    private void reportEvent(String eventName, JSONObject parameters, CallbackContext callbackContext) {
        Map<String, Object> parametersMap;
        try {
            parametersMap = JsonUtils.toMap(parameters);
        } catch (JSONException e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        try {
            Optimove.getInstance().reportEvent(eventName, parametersMap);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();

    }

    private void reportScreenVisit(JSONArray args, CallbackContext callbackContext) {
        try {
            String screenName = args.getString(0);
            String screenCategory = args.optString(1);
            if (screenCategory.equals("null")) {
                reportScreenVisit(screenName, callbackContext);
            } else {
                this.reportScreenVisit(screenName, screenCategory, callbackContext);
            }
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
    }

    private void reportScreenVisit(String screenName, CallbackContext callbackContext) {
        try {
            Optimove.getInstance().reportScreenVisit(screenName);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();

    }

    private void reportScreenVisit(String screenName, String screenCategory, CallbackContext callbackContext) {
        try {
            Optimove.getInstance().reportScreenVisit(screenName, screenCategory);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();
    }

    private void registerUser(JSONArray args, CallbackContext callbackContext) {
        try {
            String userId = args.getString(0);
            String userEmail = args.getString(1);
            Optimove.getInstance().registerUser(userId, userEmail);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();
    }

    private void getVisitorId(CallbackContext callbackContext) {
        String visitorId = Optimove.getInstance().getVisitorId();
        if (visitorId != null) {
            callbackContext.success(visitorId);
        } else {
            callbackContext.error("visitor id is null");
        }

    }

    private void getCurrentUserIdentifier(CallbackContext callbackContext) {
        String currentUserIdentifier = Optimove.getInstance().getCurrentUserIdentifier();
        if (currentUserIdentifier != null) {
            callbackContext.success(currentUserIdentifier);
        } else {
            callbackContext.error("current user identifier is null");
        }

    }

}