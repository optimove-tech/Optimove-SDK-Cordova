package com.optimove.android.cordova;

import android.content.Context;

import androidx.annotation.Nullable;

import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import com.optimove.android.Optimove;
import com.optimove.android.optimobile.InAppDeepLinkHandlerInterface;
import com.optimove.android.optimobile.InAppInboxItem;
import com.optimove.android.optimobile.InAppInboxSummary;
import com.optimove.android.optimobile.OptimoveInApp;
import com.optimove.android.optimobile.PushMessage;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class OptimoveSDKPlugin extends CordovaPlugin {

    private static final String SET_HANDLERS_CALLBACK_CONTEXT = "setHandlersCallBackContext";
    private static final String SET_CREDENTIALS = "setCredentials";
    private static final String SET_USER_ID = "setUserId";
    private static final String SET_USER_EMAIL = "setUserEmail";
    private static final String REPORT_EVENT = "reportEvent";
    private static final String REPORT_SCREEN_VISIT = "reportScreenVisit";
    private static final String REGISTER_USER = "registerUser";
    private static final String GET_VISITOR_ID = "getVisitorId";
    private static final String SIGN_OUT_USER = "signOutUser";
    private static final String GET_CURRENT_USER_IDENTIFIER = "getCurrentUserIdentifier";
    private static final String PUSH_REQUEST_DEVICE_TOKEN = "pushRequestDeviceToken";
    private static final String PUSH_UNREGISTER = "pushUnregister";
    private static final String IN_APP_UPDATE_CONSENT = "inAppUpdateConsent";
    private static final String IN_APP_GET_INBOX_ITEMS = "inAppGetInboxItems";
    private static final String IN_APP_MARK_ALL_INBOX_ITEMS_AS_READ = "inAppMarkAllInboxItemsAsRead";
    private static final String IN_APP_MARK_AS_READ = "inAppMarkAsRead";
    private static final String IN_APP_GET_INBOX_SUMMARY = "inAppGetInboxSummary";
    private static final String IN_APP_PRESENT_INBOX_MESSAGE = "inAppPresentInboxMessage";
    private static final String IN_APP_DELETE_INBOX_MESSAGE = "inAppDeleteMessageFromInbox";
    private static final String CHECK_IF_PENDING_PUSH_EXISTS = "checkIfPendingPushExists";
    private static final String CLEAR_CONTEXT = "clearContext";
    private static final String CHECK_IF_PENDING_DDL_EXISTS = "checkIfPendingDDLExists";

    @Nullable
    static CallbackContext jsCallbackContext;
    @Nullable
    static PushMessage pendingPush;
    @Nullable
    static String pendingActionId;
    static CordovaInterface sCordova;
    static JSONObject pendingDDL;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {

            case SET_HANDLERS_CALLBACK_CONTEXT:
                setHandlersCallBackContext(args, callbackContext);
                return true;

            case SET_CREDENTIALS:
                this.setCredentials(args, callbackContext);
                return true;

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
            case SIGN_OUT_USER:
                this.signOutUser(callbackContext);
                return true;

            case GET_CURRENT_USER_IDENTIFIER:
                this.getCurrentUserIdentifier(callbackContext);
                return true;

            case PUSH_REQUEST_DEVICE_TOKEN:
                this.pushRequestDeviceToken(callbackContext);
                return true;
            case PUSH_UNREGISTER:
                this.pushUnregister(callbackContext);
                return true;

            case IN_APP_UPDATE_CONSENT:
                this.inAppUpdateConsent(args, callbackContext);
                return true;

            case IN_APP_GET_INBOX_ITEMS:
                cordova.getThreadPool().execute(() -> OptimoveSDKPlugin.this.inAppGetInboxItems(callbackContext));
                return true;

            case IN_APP_MARK_ALL_INBOX_ITEMS_AS_READ:
                cordova.getThreadPool().execute(() -> OptimoveSDKPlugin.this.inAppMarkAllInboxItemsAsRead(callbackContext));
                return true;

            case IN_APP_MARK_AS_READ:
                cordova.getThreadPool().execute(() -> OptimoveSDKPlugin.this.inAppMarkAsRead(args, callbackContext));
                return true;

            case IN_APP_GET_INBOX_SUMMARY:
                this.inAppGetInboxSummary(callbackContext);
                return true;

            case IN_APP_PRESENT_INBOX_MESSAGE:
                cordova.getThreadPool()
                        .execute(() -> OptimoveSDKPlugin.this.inAppPresentInboxMessage(args, callbackContext));
                return true;

            case IN_APP_DELETE_INBOX_MESSAGE:
                cordova.getThreadPool()
                        .execute(() -> OptimoveSDKPlugin.this.inAppDeleteMessageFromInbox(args, callbackContext));
                return true;
            case CHECK_IF_PENDING_PUSH_EXISTS:
                this.checkIfPendingPushExists(callbackContext);
                return true;
            case CLEAR_CONTEXT:
                this.clearJsContext();
                return true;
            case CHECK_IF_PENDING_DDL_EXISTS:
                this.checkIfPendingDDLExists(callbackContext);
                return true;
        }

        return false;
    }

    private void checkIfPendingDDLExists(CallbackContext callbackContext) {
        if (jsCallbackContext == null) {
            jsCallbackContext = callbackContext;
        }
        if (null != pendingDDL) {
            OptimoveSDKPlugin.sendMessageToJs("deepLink", pendingDDL);
            pendingDDL = null;
        }
    }

    private void setCredentials(JSONArray args, CallbackContext callbackContext) {
        try {
            String optimoveCredentials = args.getString(0).isEmpty() ? null : args.getString(0);
            String optimobileCredentials = args.getString(1).isEmpty() ? null : args.getString(1);

            Optimove.getInstance().setCredentials(optimoveCredentials, optimobileCredentials);
            callbackContext.success();
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
        }
    }
    private void clearJsContext() {
        OptimoveSDKPlugin.jsCallbackContext = null;
    }

    private void inAppDeleteMessageFromInbox(JSONArray args, CallbackContext callbackContext) {
        int messageId = args.optInt(0, -1);
        InAppInboxItem item = getInboxItemById(messageId);
        if (item == null) {
            callbackContext.error("Message not found or not available");
            return;
        }
        boolean result = OptimoveInApp.getInstance().deleteMessageFromInbox(item);
        if (result) {
            callbackContext.success();
        } else {
            callbackContext.error("Failed to delete inbox item");
        }
    }

    private void inAppPresentInboxMessage(JSONArray args, CallbackContext callbackContext) {
        int messageId = args.optInt(0, -1);

        InAppInboxItem item = getInboxItemById(messageId);
        if (item == null) {
            callbackContext.success(OptimoveInApp.InboxMessagePresentationResult.FAILED.ordinal());
            return;
        }
        OptimoveInApp.InboxMessagePresentationResult result = OptimoveInApp.getInstance().presentInboxMessage(item);
        callbackContext.success(result.ordinal());
    }

    private void inAppGetInboxSummary(CallbackContext callbackContext) {
        OptimoveInApp.getInstance().getInboxSummaryAsync((InAppInboxSummary summary) -> {
            if (summary == null) {
                callbackContext.error("Could not get inbox summary");
                return;
            }

            try {
                JSONObject res = new JSONObject();
                res.put("totalCount", summary.getTotalCount());
                res.put("unreadCount", summary.getUnreadCount());
                callbackContext.success(res);
            } catch (JSONException e) {
                e.printStackTrace();
                callbackContext.error(e.getMessage());
            }
        });
    }

    private void inAppMarkAsRead(JSONArray args, CallbackContext callbackContext) {
        int messageId = args.optInt(0, -1);
        InAppInboxItem item = getInboxItemById(messageId);
        if (item == null) {
            callbackContext.error("Message not found or not available");
            return;
        }
        boolean result = OptimoveInApp.getInstance().markAsRead(item);
        if (result) {
            callbackContext.success();
        } else {
            callbackContext.error("Failed to mark message as read");
        }
    }

    private void setUserId(JSONArray args, CallbackContext callbackContext) {
        try {
            String userId = args.getString(0);
            Optimove.getInstance().setUserId(userId);
            callbackContext.success();
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
        }
    }

    private void setUserEmail(JSONArray args, CallbackContext callbackContext) {
        try {
            String email = args.getString(0);
            Optimove.getInstance().setUserEmail(email);
            callbackContext.success();
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
        }
    }

    private void reportEvent(JSONArray args, CallbackContext callbackContext) {
        try {
            String eventName = args.getString(0);
            JSONObject params = args.optJSONObject(1);
            if (params == null) {
                Optimove.getInstance().reportEvent(eventName);
            } else {
                Optimove.getInstance().reportEvent(eventName, JsonUtils.toMap(params));
            }
            callbackContext.success();
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
        }
    }

    private void reportScreenVisit(JSONArray args, CallbackContext callbackContext) {
        try {
            String screenName = args.getString(0);

            if (args.isNull(1)) {
                Optimove.getInstance().reportScreenVisit(screenName);
            } else {
                String screenCategory = args.optString(1);
                Optimove.getInstance().reportScreenVisit(screenName, screenCategory);
            }
            callbackContext.success();
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
        }
    }

    private void registerUser(JSONArray args, CallbackContext callbackContext) {
        try {
            String userId = args.getString(0);
            String userEmail = args.getString(1);
            Optimove.getInstance().registerUser(userId, userEmail);
            callbackContext.success();
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
        }
    }

    private void getVisitorId(CallbackContext callbackContext) {
        String visitorId = Optimove.getInstance().getVisitorId();
        if (visitorId != null) {
            callbackContext.success(visitorId);
        } else {
            callbackContext.error("visitor id is null");
        }
    }

    private void signOutUser(CallbackContext callbackContext) {
        try {
            Optimove.getInstance().signOutUser();
            callbackContext.success();
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
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

    private void setHandlersCallBackContext(JSONArray args, CallbackContext callbackContext) {
        jsCallbackContext = callbackContext;
        try {
            boolean checkForPendingPush = args.getBoolean(0);
            boolean checkForPendingDDL = args.getBoolean(1);
            if (checkForPendingPush) {
                checkIfPendingPushExists(callbackContext);
            }
            if (checkForPendingDDL) {
                checkIfPendingDDLExists(callbackContext);
            }

        } catch (JSONException e) {
            // noop
        }

        PluginResult result = new PluginResult(PluginResult.Status.OK);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    private void checkIfPendingPushExists(CallbackContext callbackContext) {
        if (jsCallbackContext == null) {
            jsCallbackContext = callbackContext;
        }
        if (null != pendingPush) {
            OptimoveSDKPlugin.sendMessageToJs("pushOpened",
                    PushReceiver.pushMessageToJsonObject(pendingPush, pendingActionId));
            pendingPush = null;
            pendingActionId = null;
        }
    }

    static void sendMessageToJs(String type, JSONObject data) {
        if (null == jsCallbackContext) {
            return;
        }

        JSONObject message = new JSONObject();
        try {
            message.put("type", type);
            message.put("data", data);
        } catch (JSONException e) {
            e.printStackTrace();
            return;
        }

        PluginResult result = new PluginResult(PluginResult.Status.OK, message);
        result.setKeepCallback(true);
        jsCallbackContext.sendPluginResult(result);
    }

    private void pushRequestDeviceToken(CallbackContext callbackContext) {
        try {
            Optimove.getInstance().pushRequestDeviceToken();
            callbackContext.success();
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
        }
    }

    private void pushUnregister(CallbackContext callbackContext) {
        try {
            Optimove.getInstance().pushUnregister();
            callbackContext.success();
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
        }
    }

    private void inAppUpdateConsent(JSONArray args, CallbackContext callbackContext) {
        final boolean consented;

        try {
            consented = args.getBoolean(0);
            OptimoveInApp.getInstance().updateConsentForUser(consented);
            callbackContext.success();
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    private void inAppGetInboxItems(CallbackContext callbackContext) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));

        List<InAppInboxItem> items = OptimoveInApp.getInstance().getInboxItems();
        JSONArray results = new JSONArray();
        try {
            for (InAppInboxItem item : items) {
                JSONObject mapped = new JSONObject();

                mapped.put("id", item.getId());
                mapped.put("title", item.getTitle());
                mapped.put("subtitle", item.getSubtitle());
                mapped.put("isRead", item.isRead());
                mapped.put("sentAt", formatter.format(item.getSentAt()));

                Date availableFrom = item.getAvailableFrom();
                Date availableTo = item.getAvailableTo();
                Date dismissedAt = item.getDismissedAt();

                JSONObject data = item.getData();
                mapped.put("data", data == null ? JSONObject.NULL : data);

                URL imageUrl = item.getImageUrl();
                mapped.put("imageUrl", imageUrl == null ? JSONObject.NULL : imageUrl.toString());

                if (null == availableFrom) {
                    mapped.put("availableFrom", JSONObject.NULL);
                } else {
                    mapped.put("availableFrom", formatter.format(availableFrom));
                }

                if (null == availableTo) {
                    mapped.put("availableTo", JSONObject.NULL);
                } else {
                    mapped.put("availableTo", formatter.format(availableTo));
                }

                if (null == dismissedAt) {
                    mapped.put("dismissedAt", JSONObject.NULL);
                } else {
                    mapped.put("dismissedAt", formatter.format(dismissedAt));
                }

                results.put(mapped);
            }
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
            return;
        }

        callbackContext.success(results);
    }

    private void inAppMarkAllInboxItemsAsRead(CallbackContext callbackContext) {
        boolean result = OptimoveInApp.getInstance().markAllInboxItemsAsRead();
        if (result) {
            callbackContext.success();
        } else {
            callbackContext.error("Failed to mark all messages as read");
        }
    }

    private InAppInboxItem getInboxItemById(int id) {
        if (id == -1) {
            return null;
        }
        List<InAppInboxItem> inboxItems = OptimoveInApp.getInstance().getInboxItems();
        for (InAppInboxItem item : inboxItems) {
            if (item.getId() == id) {
                return item;
            }
        }
        return null;
    }

    static class InAppDeepLinkHandler implements InAppDeepLinkHandlerInterface {

        @Override
        public void handle(Context context, InAppButtonPress buttonPress) {
            JSONObject inAppButtonPress = new JSONObject();
            try {
                inAppButtonPress.put("deepLinkData", buttonPress.getDeepLinkData());
                inAppButtonPress.put("messageId", buttonPress.getMessageId());
                JSONObject messageData = buttonPress.getMessageData();
                inAppButtonPress.put("messageData", messageData == null ? JSONObject.NULL : messageData);
            } catch (JSONException e) {
                // noop
            }
            sendMessageToJs("inAppDeepLink", inAppButtonPress);
        }
    }

    static class InboxUpdatedHandler implements OptimoveInApp.InAppInboxUpdatedHandler {
        @Override
        public void run() {
            sendMessageToJs("inAppInboxUpdated", null);
        }
    }
}