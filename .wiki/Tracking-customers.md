## Difference between Visitors & Customers

### Visitor
- Once the user has downloaded the application and the *OptimoveSDK* for Android has run for the first time, the user is considered a *visitor*, i.e., an unidentified visitor
- This visitor id is created by the Optimove SDK for each user who enters your application

### Customer
- Once the user creates an account or log in to the application and recieves your application unique identifier, they becomes customers
- This customer ID (also known as SDK ID) is also your Optimove's customer's unique identifier (e.g email address, or numeric id, or etc)
- All user's visitor data will be stiched to their unique customer ID once recognized

## Important Information   
- This SDK ID is also your Optimove's customer's unique identifier (e.g email address, or numeric id, or etc)
- Your Optimove customer unique identifier is sent to Optimove on the daily customer transfer
- Any SDK ID that does not correspond/match to your Optimove customer unique identifier (Customer ID) due to faulty / unrecognized SDK IDs will not be tracked 
- If you do not know your Optimove customer unique identifier, please contact your Optimove Point of Contact

## Send customer ID to Optimove When

- Upon user account creation / login
- Newsletter signup
- Guest checkout

## Stitching visitors to customers
Once the user successfully creates an account, they become a recognized customer.
Use one of the following functions accordingly:

- `setUserId` method and pass the `User Id` when an **"email address" is not** available:

```dart
Optimove.setUserId("YOUR_CUSTOMERS_USER_ID");
```

- `registerUser` method and pass the `User Id` when an **"email address" is** available:

```dart
Optimove.registerUser("YOUR_CUSTOMERS_USER_ID", "YOUR_CUSTOMERS_EMAIL");
```

> **Important Note:** We recommend apps to send the SDK the `User Id` **every time** the app starts. It increases the chances of successful tracking of already existing end users. The SDK blocks multiple calls with the same `User Id` and/or `Email`, so it's perfectly safe to call `setUserId`/`registerUser` every time the app starts.

## Signing out

You can sign out user with

```dart
Optimove.signOutUser();
```

## Encrypting SDK ID
If you will be sending encrypted SDK ID, please follow the steps in [Reporting encrypted CustomerIDs](https://github.com/optimove-tech/Reporting-Encrypted-CustomerID)
s
## Sending emails only to Identified Visitors (none customers)
To send emails to users who are not customers, call the `setUserEmail` method accordingly:
```dart
Optimove.setUserEmail("YOUR_CUSTOMERS_EMAIL");
```


> **Important Note:** The SDK blocks multiple calls with the same `Email`, so it's perfectly safe to call `setUserEmail` every time the app starts.
