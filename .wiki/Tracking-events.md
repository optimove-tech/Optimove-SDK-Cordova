## Screen Visit Events

To track which screens the user has visited in your app, call the `reportScreenVisit` method of the Optimove singleton:
```typescript
Optimove.reportScreenVisit("screen name", "screen category");
```

Once you and the Optimove Product Integration Team have reviewed your use cases, you will define the custom events together. The Product Integration Team will configure your particular events and parameters within your Optimove site, while you will be responsible for passing the event and parameter information to Optimove.

## Custom Events

- Custom events must be first configured by Optimove Product Integration team before implementation
- Events and parameters must be in lowercase and use snake_case naming convention only
- - **snake_case** definition: Separate each word with one underscore character (_) and no spaces. (e.g., checkout_completed)
- The parameter types available for use in event reporting functions are:
- - **String**: A series of alphanumeric characters of up to 255 characters in length, using any encoding
- - **Number**: Any numeric value, whether an integer or a value containing a decimal point
- - **Boolean**: Is either "true" or "false" values, not a string
- Optimove supports up to 50 parameters per custom event

To track custom events, call the `reportEvent` method with nullable event parameters:
```typescript
Optimove.reportEvent("eventName", { param1: "value1", ...});
```