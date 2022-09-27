import OptimoveSDK
import NotificationCenter

enum InAppConsentStrategy: String {
    case autoEnroll = "auto-enroll"
    case explicitByUser = "explicit-by-user"
    case disabled = "in-app-disabled"
}

@objc(Optimove_Cordova) class OptimoveSDKPlugin : CDVPlugin {
    private static var optimovePluginInstance: OptimoveSDKPlugin!
    private static var cordovaCommand: CDVInvokedUrlCommand? = nil

    private static let optimoveCredentialsKey = "optimoveCredentials"
    private static let optimoveMobileCredentialsKey = "optimoveMobileCredentials"
    private static let inAppConsentStrategy = "optimoveInAppConsentStrategy"
    private static let enableDeferredDeepLinking = "optimoveEnableDeferredDeepLinking"
    private static let cname = "optimoveDdlCname"

    private static var pendingPush: PushNotification? = nil
    private static var pendingDdl: DeepLinkResolution? = nil

    // ========================== INITIALIZATION ==========================

    override func pluginInitialize() {
        OptimoveSDKPlugin.optimovePluginInstance = self
    }

    @objc(didFinishLaunching:)
    static func didFinishLaunching(notification: Notification) {
        let configPath = Bundle.main.path(forResource: "optimove", ofType: "plist")

        guard let configPath = configPath else {
            print("optimove.plist NOT FOUND")
            return
        }

        guard let configValues: [String: String] = NSDictionary(contentsOfFile: configPath) as? [String: String] else {
            print("optimove.plist IS NOT VALID")
            return
        }

        guard let builder = getConfigBuilder(configValues: configValues) else{
            return
        };

        builder.setPushOpenedHandler(pushOpenedHandlerBlock: { notification in
            guard let pluginInstance = OptimoveSDKPlugin.optimovePluginInstance, let _ = OptimoveSDKPlugin.cordovaCommand else {
                pendingPush = notification

                return
            }

            pluginInstance.sendMessageToJs(type: "pushOpened", data: getPushNotificationMap(pushNotification: notification))
        })

        if #available(iOS 10, *) {
            builder.setPushReceivedInForegroundHandler(pushReceivedInForegroundHandlerBlock: { notification, completionHanlder in
                OptimoveSDKPlugin.optimovePluginInstance?.sendMessageToJs(type: "pushReceived", data: getPushNotificationMap(pushNotification: notification))

                completionHanlder(UNNotificationPresentationOptions.alert)
            })
        }

        switch(configValues[inAppConsentStrategy]){
            case InAppConsentStrategy.autoEnroll.rawValue:
                builder.enableInAppMessaging(inAppConsentStrategy:OptimoveSDK.InAppConsentStrategy.autoEnroll);
                break
            case InAppConsentStrategy.explicitByUser.rawValue:
                builder.enableInAppMessaging(inAppConsentStrategy:OptimoveSDK.InAppConsentStrategy.explicitByUser);
                break
            case InAppConsentStrategy.disabled.rawValue:
                break
            default:
                print("Invalid inApp consent strategy")
                return
        }

        builder.setInAppDeepLinkHandler(inAppDeepLinkHandlerBlock: { data in
            OptimoveSDKPlugin.optimovePluginInstance?.sendMessageToJs(type: "inAppDeepLink", data: getInappButtonPressMap(inAppButtonPress: data))
        })

        if (configValues[enableDeferredDeepLinking] != nil) {
            let ddlHandler: DeepLinkHandler = { deepLinkResolution in
                guard let pluginInstance = OptimoveSDKPlugin.optimovePluginInstance, let _ = OptimoveSDKPlugin.cordovaCommand else {
                    pendingDdl = deepLinkResolution

                    return
                }

                pluginInstance.sendMessageToJs(type: "deepLink", data: getDdlResolutionMap(deepLinkResolution: deepLinkResolution))
            }

            if (configValues[cname] != nil){
                builder.enableDeepLinking(cname: configValues[cname], ddlHandler)
            }
            else{
                builder.enableDeepLinking(ddlHandler)
            }
        }

        let config = builder.build()

        Optimove.initialize(with: config)

        OptimoveInApp.setOnInboxUpdated(inboxUpdatedHandlerBlock: {
            OptimoveSDKPlugin.optimovePluginInstance?.sendMessageToJs(type: "inAppInboxUpdated", data: nil)
        })
    }

    static func getConfigBuilder(configValues: [String: String]) -> OptimoveConfigBuilder? {
        var optimoveCredentials: String? = nil
        if let val = configValues[optimoveCredentialsKey] {
            if (!val.isEmpty){
                optimoveCredentials = val;
            }
        }

        var optimobileCredentials: String? = nil
        if let val = configValues[optimoveMobileCredentialsKey] {
            if (!val.isEmpty){
                optimobileCredentials = val;
            }
        }

        let builder = OptimoveConfigBuilder(optimoveCredentials: optimoveCredentials, optimobileCredentials: optimobileCredentials)

        return builder
    }

    // ========================== ASSOCIATION AND EVENTS ==========================

    @objc(reportEvent:)
    func reportEvent(command: CDVInvokedUrlCommand) {
        guard let name = command.arguments[0] as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "name is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        var parameters: [String: Any] = [:]

        if let param = command.arguments[1] as? [String: Any] {
            parameters = param
        }

        Optimove.shared.reportEvent(name: name, parameters: parameters)
<<<<<<< HEAD
        
=======
>>>>>>> dev
        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(reportScreenVisit:)
    func reportScreenVisit(command: CDVInvokedUrlCommand) {
        guard let screenTitle = command.arguments.first as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "screenTitle is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        let screenCategory = command.arguments[1] as? String

        Optimove.shared.reportScreenVisit(screenTitle: screenTitle, screenCategory: screenCategory)

        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(registerUser:)
    func registerUser(command: CDVInvokedUrlCommand) {
        guard let id = command.arguments.first as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "id is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        guard let  email = command.arguments[1] as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "email is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        Optimove.shared.registerUser(sdkId: id, email: email)

        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(setUserId:)
    func setUserId(command: CDVInvokedUrlCommand) {
        guard let id = command.arguments.first as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "id is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        Optimove.shared.setUserId(id)

        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(getVisitorID:)
    func getVisitorID(command: CDVInvokedUrlCommand) {
        let pluginResult = CDVPluginResult(status: .ok, messageAs: Optimove.getVisitorID())
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(setUserEmail:)
    func setUserEmail(command: CDVInvokedUrlCommand) {
        guard let email = command.arguments.first as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "email is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        Optimove.shared.setUserEmail(email: email)

        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }
<<<<<<< HEAD
    
    @objc(isAvailable:)
    func isAvailable(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run {
            let pluginResult = CDVPluginResult(status: .ok, messageAs: OptimoveInApp.getInboxItems())
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(pushRequestDeviceToken:)
    func pushRequestDeviceToken(command: CDVInvokedUrlCommand) {
        Optimove.shared.pushRequestDeviceToken()
        self.commandDelegate.run {
            let pluginResult = CDVPluginResult(status: .ok, messageAs: "")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(updateConsent:)
    func updateConsent(command: CDVInvokedUrlCommand) {
        OptimoveInApp.updateConsent(forUser: command.arguments[0] as? Bool ?? false)
    }
    
    @objc(inAppPresentInboxMessage:)
    func inAppPresentInboxMessage(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run(inBackground: {
            let messageId = command.arguments.first as! NSNumber
            let inboxItems = OptimoveInApp.getInboxItems()
            
            for msg in inboxItems {
                if msg.id == messageId.int64Value {
                    let result = OptimoveInApp.presentInboxMessage(item: msg)
                    
                    if result == .PRESENTED {
                        self.commandDelegate.send(.init(status: .ok), callbackId: command.callbackId)
                    }
                    else {
                        break
                    }
                }
            }
        })
    }
    
    @objc(inAppDeleteMessageFromInbox:)
    func inAppDeleteMessageFromInbox(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run(inBackground: {
            let messageId = command.arguments.first as! NSNumber
            let inboxItems = OptimoveInApp.getInboxItems()
            
            for msg in inboxItems {
                if msg.id == messageId.int64Value {
                    let result = OptimoveInApp.deleteMessageFromInbox(item: msg)
                    
                    if result {
                        self.commandDelegate.send(.init(status: .ok), callbackId: command.callbackId)
                        return
                    }
                    
                    break
                }
            }
        })
    }
    
    @objc(inAppMarkAsRead:)
    func inAppMarkAsRead(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run(inBackground: {
            let messageId = command.arguments.first as! NSNumber
            let inboxItems = OptimoveInApp.getInboxItems()
            
            for msg in inboxItems {
                if msg.id == messageId.int64Value {
                    let result = OptimoveInApp.markAsRead(item: msg)
                    
                    if result {
                        self.commandDelegate.send(.init(status: .ok), callbackId: command.callbackId)
                    }
                    else {
                        self.commandDelegate.send(.init(status: .error, messageAs: "Failed to mark message as read"), callbackId: command.callbackId)
                    }
                    
                    return
                }
            }
        })
    }
    
=======

    // ========================== MESSAGING ==========================

    @objc(setHandlersCallBackContext:)
    func setHandlersCallBackContext(command: CDVInvokedUrlCommand){
        OptimoveSDKPlugin.cordovaCommand = command

        let checkForPendingPush: Bool = command.arguments[0] as! Bool
        let checkForPendingDdl: Bool = command.arguments[1] as! Bool

        var sentPushResult = false
        var sentDdlResult = false
        if (checkForPendingPush){
            sentPushResult = maybeSendAndClearPendingPush(command: command)
        }

        if (checkForPendingDdl){
            sentDdlResult = maybeSendAndClearPendingDdl(command: command)
        }

        if (!sentPushResult && !sentDdlResult){
            let pluginResult:CDVPluginResult = CDVPluginResult.init(status: .ok)
            pluginResult.setKeepCallbackAs(true)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }

    @objc(clearContext:)
    func clearContext(command: CDVInvokedUrlCommand){
        OptimoveSDKPlugin.cordovaCommand = nil

        self.commandDelegate.send(CDVPluginResult.init(status: .ok), callbackId: command.callbackId)
    }

    @objc(checkIfPendingPushExists:)
    func checkIfPendingPushExists(command: CDVInvokedUrlCommand){
        if (OptimoveSDKPlugin.cordovaCommand == nil){
            OptimoveSDKPlugin.cordovaCommand = command
        }

        let sent = maybeSendAndClearPendingPush(command: command)
        if (!sent){
            let pluginResult: CDVPluginResult = CDVPluginResult(status: .ok)
            pluginResult.setKeepCallbackAs(true)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }

    private func maybeSendAndClearPendingPush(command: CDVInvokedUrlCommand) -> Bool{
        guard let notification = OptimoveSDKPlugin.pendingPush else {
            return false
        }

        OptimoveSDKPlugin.optimovePluginInstance.sendMessageToJs(type: "pushOpened", data: OptimoveSDKPlugin.getPushNotificationMap(pushNotification: notification))
        OptimoveSDKPlugin.pendingPush = nil

        return true
    }

    private func sendMessageToJs(type: String, data: [String: Any?]?){
        guard let command = OptimoveSDKPlugin.cordovaCommand else {
            return
        }

        var message: [String: Any] = [
            "type": type
        ]

        if (data != nil){
            message["data"] = data
        }

        let pluginResult: CDVPluginResult = CDVPluginResult(status: .ok, messageAs: message)
        pluginResult.setKeepCallbackAs(true)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(pushRegister:)
    func pushRegister(command: CDVInvokedUrlCommand) {
        Optimove.shared.pushRequestDeviceToken()

        self.commandDelegate.send(CDVPluginResult(status: .ok), callbackId: command.callbackId)
    }

    @objc(inAppUpdateConsent:)
    func inAppUpdateConsent(command: CDVInvokedUrlCommand) {
        let consented: Bool = command.arguments[0] as! Bool
        OptimoveInApp.updateConsent(forUser: consented)

        self.commandDelegate.send(CDVPluginResult(status: .ok), callbackId: command.callbackId)
    }

    @objc(inAppGetInboxItems:)
    func inAppGetInboxItems(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run(inBackground:{
            let inboxItems = OptimoveInApp.getInboxItems()
            var items = [[String : Any?]]()

            let formatter = DateFormatter()
            formatter.timeStyle = .full
            formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
            formatter.timeZone = TimeZone(secondsFromGMT: 0)

            for item in inboxItems {
                let dict: [String: Any?] = [
                    "id": item.id,
                    "title": item.title,
                    "subtitle": item.subtitle,
                    "availableFrom": item.availableFrom != nil ? formatter.string(from: item.availableFrom!) : nil,
                    "availableTo": item.availableTo != nil ? formatter.string(from: item.availableTo!) : nil,
                    "dismissedAt": item.dismissedAt != nil ? formatter.string(from: item.dismissedAt!) : nil,
                    "isRead": item.isRead(),
                    "sentAt": formatter.string(from: item.sentAt),
                    "imageUrl": item.getImageUrl()?.absoluteString,
                    "data": item.data
                ]

                items.append(dict)
            }

            let pluginResult = CDVPluginResult(status: .ok, messageAs: items)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        })
    }

    @objc(inAppPresentInboxMessage:)
    func inAppPresentInboxMessage(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run(inBackground: {
            let messageId = command.arguments[0] as! Int64
            let inboxItems = OptimoveInApp.getInboxItems()

            var pluginResult = CDVPluginResult.init(status: .error, messageAs: "Message not found or not available")
            for msg in inboxItems {
                if (msg.id != messageId){
                    continue
                }

                let result = OptimoveInApp.presentInboxMessage(item: msg)
                if (result == .PRESENTED){
                    pluginResult = CDVPluginResult.init(status: .ok)
                }

                break;

            }

            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        })
    }

    @objc(inAppDeleteMessageFromInbox:)
    func inAppDeleteMessageFromInbox(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run(inBackground: {
            let messageId = command.arguments[0] as! Int64
            let inboxItems = OptimoveInApp.getInboxItems()

            var pluginResult = CDVPluginResult.init(status: .error, messageAs: "Message not found or not available")
            for msg in inboxItems {
                if msg.id != messageId {
                    continue
                }

                let result = OptimoveInApp.deleteMessageFromInbox(item: msg)
                if result {
                    pluginResult = CDVPluginResult.init(status: .ok)
                }
                break
            }

            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        })
    }

    @objc(inAppMarkAsRead:)
    func inAppMarkAsRead(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run(inBackground: {
            let messageId = command.arguments[0] as! Int64
            let inboxItems = OptimoveInApp.getInboxItems()

            var pluginResult = CDVPluginResult.init(status: .error, messageAs: "Message not found")
            for msg in inboxItems {
                if msg.id != messageId {
                    continue
                }

                let result = OptimoveInApp.markAsRead(item: msg)
                pluginResult = result ?
                CDVPluginResult.init(status: .ok) :
                CDVPluginResult.init(status: .error, messageAs: "Failed to mark message as read")

                break
            }
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        })
    }

>>>>>>> dev
    @objc(inAppMarkAllInboxItemsAsRead:)
    func inAppMarkAllInboxItemsAsRead(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run(inBackground: {
            let result = OptimoveInApp.markAllInboxItemsAsRead()
<<<<<<< HEAD
            
=======

>>>>>>> dev
            if result {
                self.commandDelegate.send(.init(status: .ok), callbackId: command.callbackId)
            }
            else {
                self.commandDelegate.send(.init(status: .error, messageAs: "Failed to mark all messages as read"), callbackId: command.callbackId)
            }
        })
    }
<<<<<<< HEAD
    
=======

>>>>>>> dev
    @objc(inAppGetInboxSummary:)
    func inAppGetInboxSummary(command: CDVInvokedUrlCommand) {
        OptimoveInApp.getInboxSummaryAsync { summary in
            if let summary = summary {
                self.commandDelegate.send(.init(status: .ok, messageAs: ["totalCount" : summary.totalCount, "unreadCount" : summary.unreadCount]), callbackId: command.callbackId)
            }
            else {
                self.commandDelegate.send(.init(status: .error, messageAs: "Could not get inbox summary"), callbackId: command.callbackId)
            }
        }
    }
<<<<<<< HEAD
    
    @objc(getInboxItems:)
    func getInboxItems(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run {
            let inboxItems = OptimoveInApp.getInboxItems()
            var items = [[String : Any]]()
            
            let formatter = DateFormatter()
            formatter.timeStyle = .full
            formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            
            for item in inboxItems {
                var dict  = [String: Any]()
                dict["id"] = item.id
                dict["title"] = item.title
                dict["subtitle"] = item.subtitle
                dict["availableFrom"] = item.availableFrom != nil ? formatter.string(from: item.availableFrom!) : ""
                dict["availableTo"] = item.availableTo != nil ? formatter.string(from: item.availableTo!) : ""
                dict["dismissedAt"] =  item.dismissedAt != nil ? formatter.string(from: item.dismissedAt!) : ""
                dict["isRead"] = item.isRead
                dict["sentAt"] = formatter.string(from: item.sentAt)
                
                if let data = item.data {
                    dict["data"] = data
                }
                if let imageUrl = item.getImageUrl() {
                    dict["imageUrl"] = imageUrl.absoluteString
                }
                
                items.append(dict)
            }
            
            self.commandDelegate.run {
                let pluginResult = CDVPluginResult(status: .ok, messageAs: items)
                self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            }
        }
    }
}
=======

    private static func getPushNotificationMap(pushNotification: PushNotification) -> [String: Any?] {
        let aps: [AnyHashable:Any] = pushNotification.aps
        var alert: [String: String] = [:]
        if let a = aps["alert"] as? Dictionary<String, String> {
            alert = a
        }

        let title: String? = alert["title"] ?? nil
        let message: String? = alert["body"] ?? nil

        let dict: [String: Any?] = [
            "id": pushNotification.id,
            "title": title,
            "message": message,
            "data": pushNotification.data,
            "url": pushNotification.url?.absoluteString,
            "actionId": pushNotification.actionIdentifier
        ]

        return dict
    }

    private static func getInappButtonPressMap(inAppButtonPress: InAppButtonPress) -> [String: Any?] {
        let dict: [String: Any?] = [
            "deepLinkData": inAppButtonPress.deepLinkData,
            "messageData": inAppButtonPress.messageData,
            "messageId": inAppButtonPress.messageId
        ]

        return dict
    }


    // ========================== DDL ==========================

    @objc(checkIfPendingDDLExists:)
    func checkIfPendingDDLExists(command: CDVInvokedUrlCommand){
        if (OptimoveSDKPlugin.cordovaCommand == nil){
            OptimoveSDKPlugin.cordovaCommand = command
        }

        let sent = maybeSendAndClearPendingDdl(command: command)
        if (!sent){
            let pluginResult: CDVPluginResult = CDVPluginResult(status: .ok)
            pluginResult.setKeepCallbackAs(true)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }

    private func maybeSendAndClearPendingDdl(command: CDVInvokedUrlCommand) -> Bool{
        guard let ddlResolution = OptimoveSDKPlugin.pendingDdl else {
            return false
        }

        OptimoveSDKPlugin.optimovePluginInstance.sendMessageToJs(type: "deepLink", data: OptimoveSDKPlugin.getDdlResolutionMap(deepLinkResolution: ddlResolution))
        OptimoveSDKPlugin.pendingDdl = nil

        return true
    }

    private static func getDdlResolutionMap(deepLinkResolution: DeepLinkResolution) -> [String: Any?] {
        var urlString: String
        var resolution: String
        var content: [String: Any?]? = nil
        var linkData: [AnyHashable:Any?]? = nil

        switch deepLinkResolution {
            case .lookupFailed(let dl):
                urlString = dl.absoluteString
                resolution = "LOOKUP_FAILED"
            case .linkNotFound(let dl):
                urlString = dl.absoluteString
                resolution = "LINK_NOT_FOUND"
            case .linkExpired(let dl):
                urlString = dl.absoluteString
                resolution = "LINK_EXPIRED"
            case .linkLimitExceeded(let dl):
                urlString = dl.absoluteString
                resolution = "LINK_LIMIT_EXCEEDED"
            case .linkMatched(let dl):
                urlString = dl.url.absoluteString
                resolution = "LINK_MATCHED"
                content = [
                    "title": dl.content.title,
                    "description": dl.content.description,
                ]
                linkData = dl.data
        }

        return [
            "resolution": resolution,
            "url": urlString,
            "content": content,
            "linkData": linkData,
        ]
    }

    @objc(application:userActivity:restorationHandler:)
    static func application(_ application: UIApplication, userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void){
        _ = Optimove.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    @available(iOS 13.0, *)
    @objc(scene:session:options:)
    static func scene(_ scene: UIScene, session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let _ = (scene as? UIWindowScene) else { return }

        // Deep links from cold starts
        if let userActivity = options.userActivities.first {
            Optimove.shared.scene(scene, continue: userActivity)
        }
    }

    @available(iOS 13.0, *)
    @objc(scene:userActivity:)
    static func scene(_ scene: UIScene, userActivity: NSUserActivity) {
        Optimove.shared.scene(scene, continue: userActivity)
    }
}
>>>>>>> dev
