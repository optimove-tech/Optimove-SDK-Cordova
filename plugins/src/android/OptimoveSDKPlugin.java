package com.optimove.android.cordova;

import android.content.Context;

import androidx.annotation.Nullable;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;

import java.util.Map;

import org.apache.cordova.CallbackContext;

import com.optimove.android.Optimove;
import com.optimove.android.optimobile.InAppDeepLinkHandlerInterface;
import com.optimove.android.optimobile.OptimoveInApp;
import com.optimove.android.optimobile.PushMessage;

import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class OptimoveSDKPlugin extends CordovaPlugin {

    private static final String INIT_BASE_SDK = "initBaseSdk";
    private static final String SET_USER_ID = "setUserId";
    private static final String SET_USER_EMAIL = "setUserEmail";
    private static final String REPORT_EVENT = "reportEvent";
    private static final String REPORT_SCREEN_VISIT = "reportScreenVisit";
    private static final String REGISTER_USER = "registerUser";
    private static final String GET_VISITOR_ID = "getVisitorId";
    private static final String GET_CURRENT_USER_IDENTIFIER = "getCurrentUserIdentifier";
    private static final String PUSH_REGISTER = "pushRegister";
    private static final String IN_APP_UPDATE_CONSENT = "inAppUpdateUserConsent";

    @Nullable
    static CallbackContext jsCallbackContext;
    @Nullable
    static PushMessage pendingPush;
    @Nullable
    static String pendingActionId;
    static CordovaInterface sCordova;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
            case INIT_BASE_SDK:
                initBaseSdk(callbackContext);
                return true;
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
                String params = args.getString(1);
                if (params == "null") {
                    this.reportEvent(eventName, callbackContext);
                } else {
                    JSONObject jsonParams = new JSONObject(params);
                    reportEvent(eventName, jsonParams, callbackContext);
                }
                return true;

            case REPORT_SCREEN_VISIT:
                String screenName = args.getString(0);
                String screenCategory = args.getString(1);
                if (screenCategory == "null") {
                    reportScreenVisit(screenName, callbackContext);
                } else {
                    this.reportScreenVisit(screenName, screenCategory, callbackContext);
                }
                return true;
            case REGISTER_USER:
                String id = args.getString(0);
                String userEmail = args.getString(1);
                this.registerUser(id, userEmail, callbackContext);
                return true;
            case GET_VISITOR_ID:
                String visitorId = this.getVisitorId();
                if (visitorId != null) {
                    callbackContext.success(visitorId);
                } else {
                    callbackContext.error("visitor id is null");
                    return false;
                }
                return true;
            case GET_CURRENT_USER_IDENTIFIER:
                String currentUserIdentifier = this.getCurrentUserIdentifier();
                if (currentUserIdentifier != null) {
                    callbackContext.success(currentUserIdentifier);
                } else {
                    callbackContext.error("current user identifier is null");
                    return false;
                }
            case PUSH_REGISTER:
                this.pushRegister(callbackContext);
                return true;
            case IN_APP_UPDATE_CONSENT:
                this.inAppUpdateConsent(args, callbackContext);

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

    private void registerUser(String userId, String userEmail, CallbackContext callbackContext) {
        try {
            Optimove.getInstance().registerUser(userId, userEmail);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();
    }

    private String getVisitorId() {
        return Optimove.getInstance().getVisitorId();
    }

    private String getCurrentUserIdentifier() {
        return Optimove.getInstance().getCurrentUserIdentifier();
    }

    private void initBaseSdk(CallbackContext callbackContext) {
        jsCallbackContext = callbackContext;
        PluginResult result = new PluginResult(PluginResult.Status.OK);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);

        if (null != pendingPush) {
            OptimoveSDKPlugin.sendMessageToJs("pushOpened",
                    PushReceiver.pushMessageToJsonObject(pendingPush, pendingActionId));
            pendingPush = null;
            pendingActionId = null;
        }
    }

    static boolean sendMessageToJs(String type, JSONObject data) {
        if (null == jsCallbackContext) {
            return false;
        }

        JSONObject message = new JSONObject();
        try {
            message.put("type", type);
            message.put("data", data);
        } catch (JSONException e) {
            e.printStackTrace();
            return false;
        }

        PluginResult result = new PluginResult(PluginResult.Status.OK, message);
        result.setKeepCallback(true);
        jsCallbackContext.sendPluginResult(result);

        return true;
    }

    private void pushRegister(CallbackContext callbackContext) {
        try {
            Optimove.getInstance().pushRegister();
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();
    }

    private void inAppUpdateConsent(JSONArray args, CallbackContext callbackContext) {
        final boolean consented;

        try {
            consented = args.getBoolean(0);
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
            return;
        }

        OptimoveInApp.getInstance().updateConsentForUser(consented);
        callbackContext.success();
    }

    private void pushUnregister(CallbackContext callbackContext) {
        try {
            // Optimove.getInstance().pushUnregister(); TODO figure out why can't I call
            // this method
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
            return;
        }
        callbackContext.success();
    }

    static class InAppDeepLinkHandler implements InAppDeepLinkHandlerInterface {

        @Override
        public void handle(Context context, InAppButtonPress buttonPress) {
            sendMessageToJs("inAppDeepLinkPressed", buttonPress.getDeepLinkData());
        }
    }

    static class InboxUpdatedHandler implements OptimoveInApp.InAppInboxUpdatedHandler {
        @Override
        public void run() {
            sendMessageToJs("inAppInboxUpdated", null);
        }
    }
}