package com.optimove.android.cordova;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.TaskStackBuilder;

import com.optimove.android.Optimove;
import com.optimove.android.optimobile.PushActionHandlerInterface;
import com.optimove.android.optimobile.PushBroadcastReceiver;
import com.optimove.android.optimobile.PushMessage;

import org.json.JSONException;
import org.json.JSONObject;

public class PushReceiver extends PushBroadcastReceiver {
    @Override
    protected void onPushReceived(Context context, PushMessage pushMessage) {
        super.onPushReceived(context, pushMessage);
        OptimoveSDKPlugin.sendMessageToJs("pushReceived", pushMessageToJsonObject(pushMessage, null));
    }

    static JSONObject pushMessageToJsonObject(PushMessage pushMessage, String actionId) {
        JSONObject message = new JSONObject();

        try {
            message.put("id", pushMessage.getId());
            message.put("title", pushMessage.getTitle());
            message.put("message", pushMessage.getMessage());

            if (null != pushMessage.getUrl()) {
                message.put("url", pushMessage.getUrl().toString());
            }

            if (actionId != null) {
                message.put("actionId", actionId);
            }

            message.put("data", pushMessage.getData());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return message;
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void onPushOpened(Context context, PushMessage pushMessage) {
        try {
            Optimove.getInstance().pushTrackOpen(pushMessage.getId());
        } catch (Exception e) {
            e.printStackTrace();
            if (OptimoveSDKPlugin.jsCallbackContext != null)
                OptimoveSDKPlugin.jsCallbackContext.error(e.getMessage());
        }

        PushReceiver.handlePushOpen(context, pushMessage, null);
    }

    private static void handlePushOpen(Context context, PushMessage pushMessage, String actionId) {
        PushReceiver pr = new PushReceiver();
        Intent launchIntent = pr.getPushOpenActivityIntent(context, pushMessage);

        if (null == launchIntent) {
            return;
        }

        ComponentName component = launchIntent.getComponent();
        if (null == component) {
            return;
        }

        Class<? extends Activity> cls = null;
        try {
            cls = (Class<? extends Activity>) Class.forName(component.getClassName());
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            OptimoveSDKPlugin.jsCallbackContext.error(e.getMessage());
        }

        // Ensure we're trying to launch an Activity
        if (null == cls) {
            return;
        }

        if (OptimoveSDKPlugin.sCordova != null) {
            Intent existingIntent = OptimoveSDKPlugin.sCordova.getActivity().getIntent();
            addDeepLinkExtras(pushMessage, existingIntent);
        }

        if (null != pushMessage.getUrl()) {
            launchIntent = new Intent(Intent.ACTION_VIEW, pushMessage.getUrl());

            addDeepLinkExtras(pushMessage, launchIntent);

            TaskStackBuilder taskStackBuilder = TaskStackBuilder.create(context);
            taskStackBuilder.addParentStack(component);
            taskStackBuilder.addNextIntent(launchIntent);
            taskStackBuilder.startActivities();
        } else {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

            addDeepLinkExtras(pushMessage, launchIntent);

            context.startActivity(launchIntent);
        }

        if (null == OptimoveSDKPlugin.jsCallbackContext) {
            OptimoveSDKPlugin.pendingPush = pushMessage;
            OptimoveSDKPlugin.pendingActionId = actionId;
            return;
        }

        OptimoveSDKPlugin.sendMessageToJs("pushOpened", pushMessageToJsonObject(pushMessage, actionId));
    }

    static class PushActionHandler implements PushActionHandlerInterface {
        @Override
        public void handle(Context context, PushMessage pushMessage, String actionId) {
            PushReceiver.handlePushOpen(context, pushMessage, actionId);

            Intent it = new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
            context.sendBroadcast(it);
        }
    }
}
