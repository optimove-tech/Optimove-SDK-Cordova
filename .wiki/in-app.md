## Enabling In-App Messages

As mentioned in the initialization section In-App messaging is configured during initialization.

Your `optimove.json` file should look something like this:

```json
{
  "optimoveCredentials": "YOUR_OPTIMOVE_CREDENTIALS",
  "optimoveMobileCredentials": "YOUR_OPTIMOVE_MOBILE_CREDENTIALS",
  "inAppConsentStrategy": "in-app-disabled|auto-enroll|explicit-by-user",
  "enableDeferredDeepLinking": false
}
```

Setting `inAppConsentStrategy` to `auto-enroll` will automatically enroll all your app users to be reachable by In-App messages, the SDK will automatically present and track opens.

Setting `inAppConsentStrategy` to `explicit-by-user` will give you the option to manually control the consent of a user. You can control the consent by calling the following method:

```typescript
Optimove.inAppUpdateConsent(true);
```

## Deep-linking for In-App

The following sample code shows how to use Optimove to control the in-app buttons:

```typescript
Optimove.setInAppDeeplinkHandler((inAppButtonPress: InAppButtonPress) => {
    // Called when a user taps on an in-app button
});
```

## Using the In-App Inbox

In-app messages can optionally be persisted in a user-level inbox for later retrieval. This allows you to build features such as loyalty rewards or expiring coupons into your app. Regardless of whether they are stored in the inbox, the maximum amount of in-apps stored on a device is 50 (the oldest messages exceeding this limit will be evicted).

### Retrieve messages

To retrieve a list of messages from the user's inbox and present the first in the list, see the following example:

```typescript
Optimove.inAppGetInboxItems().then((items:InAppInboxItem[]) => {
   Optimove.inAppPresentInboxMessage(items[0]);
}, error);
```

### Mark as read

To mark a single or all inbox messages as read:

```typescript
//single
Optimove.inAppGetInboxItems().then((items:InAppInboxItem[]) => {
   Optimove.markAsRead(items[0]);
}, error);

//all
Optimove.markAllInboxItemsAsRead();
```

### Delete message

You can also delete an in-app message from inbox:

```typescript
Optimove.inAppGetInboxItems().then((items:InAppInboxItem[]) => {
   Optimove.inAppDeleteMessageFromInbox(items[0]);
}, error);
```

### Inbox updated handler

In order to be notified when inbox changes you may set up a handler. The handler fires on the UI thread when one of the following happens to an in-app with an inbox configuration:

- message fetched from server
- message opened
- message marked as read
- message deleted
- message evicted (expires or limit of stored messages exceeded)

You can use it as follows:

```typescript
Optimove.setOnInboxUpdatedHandler(() => {
   //
});
```

### Get inbox summary

You can retrieve an inbox summary as follows:

```typescript
Optimove.inAppGetInboxSummary().then((inboxSummary: InAppInboxSummary) => {
  //
}, error);
```

### Get inbox item's image URL

Each inbox item may have an image associated with it.

```typescript
Optimove.inAppGetInboxItems().then((items:InAppInboxItem[]) => {
   items[0]["imageUrl"];
}, error);
```