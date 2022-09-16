import OptimoveSDK
import NotificationCenter

@objc(Optimove_Cordova) class OptimoveSDKPlugin : CDVPlugin {
    private static var optimovePluginInstance: OptimoveSDKPlugin!
    private static var cordovaCommand: CDVInvokedUrlCommand? = nil

    private static let optimoveCredentialsKey = "optimoveCredentials"
    private static let optimoveMobileCredentialsKey = "optimoveMobileCredentials"

    private static var config: OptimoveConfig? = {
        let configPath = Bundle.main.path(forResource: "optimove", ofType: "plist")

        guard let configPath = configPath else {
            print("optimove.plist NOT FOUND")
            return nil
        }

        guard let configValues: [String: String] = NSDictionary(contentsOfFile: configPath) as? [String: String] else {
            print("optimove.plist IS NOT VALID")
            return nil
        }

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

        //TODO: opened.received/... handlers
        let builder = OptimoveConfigBuilder(optimoveCredentials: optimoveCredentials, optimobileCredentials: optimobileCredentials)
        builder.setPushOpenedHandler(pushOpenedHandlerBlock:...)

        return builder.build()
    }()

    override func pluginInitialize() {
        OptimoveSDKPlugin.optimovePluginInstance = self
    }

    @objc(didFinishLaunching:)
    static func didFinishLaunching(notification: Notification) {
        guard let config = OptimoveSDKPlugin.config else { return }

        Optimove.initialize(with: config)

        OptimoveInApp.setOnInboxUpdated(inboxUpdatedHandlerBlock: {
            if (optimovePluginInstance != nil){
                optimovePluginInstance.sendMessageToJs(type: "inAppInboxUpdated", data: nil)
            }
        })
    }

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

    // ========================== MESSAGING ==========================

    @objc(setHandlersCallBackContext:)
    func setHandlersCallBackContext(command: CDVInvokedUrlCommand){
        OptimoveSDKPlugin.cordovaCommand = command

        let pluginResult:CDVPluginResult = CDVPluginResult.init(status: CDVCommandStatus_OK)
        pluginResult.setKeepCallbackAs(true)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(clearJsContext:)
    func clearJsContext(command: CDVInvokedUrlCommand){
        OptimoveSDKPlugin.cordovaCommand = nil

        self.commandDelegate.send(CDVPluginResult.init(status: CDVCommandStatus_OK), callbackId: command.callbackId)
    }


    func sendMessageToJs(type: String, data: Any?){
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
            var items = [[String : Any]]()

            let formatter = DateFormatter()
            formatter.timeStyle = .full
            formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
            formatter.timeZone = TimeZone(secondsFromGMT: 0)

            for item in inboxItems {
                var dict: [String: Any] = [
                    "id": item.id,
                    "title": item.title,
                    "subtitle": item.subtitle,
                    "availableFrom": item.availableFrom != nil ? formatter.string(from: item.availableFrom!) : "",
                    "availableTo": item.availableTo != nil ? formatter.string(from: item.availableTo!) : "",
                    "dismissedAt": item.dismissedAt != nil ? formatter.string(from: item.dismissedAt!) : "",
                    "isRead": item.isRead(),
                    "sentAt": formatter.string(from: item.sentAt)
                ]

                if let data = item.data {
                    dict["data"] = data
                }

                if let imageUrl = item.getImageUrl() {
                    dict["imageUrl"] = imageUrl.absoluteString
                }

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

            var pluginResult = CDVPluginResult.init(status: CDVCommandStatus_ERROR, messageAs: "Message not found or not available")
            for msg in inboxItems {
                if (msg.id != messageId){
                    continue
                }

                let result = OptimoveInApp.presentInboxMessage(item: msg)
                if (result == .PRESENTED){
                    pluginResult = CDVPluginResult.init(status: CDVCommandStatus_OK)
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

            var pluginResult = CDVPluginResult.init(status: CDVCommandStatus_ERROR, messageAs: "Message not found or not available")
            for msg in inboxItems {
                if msg.id != messageId {
                    continue
                }

                let result = OptimoveInApp.deleteMessageFromInbox(item: msg)
                if result {
                    pluginResult = CDVPluginResult.init(status: CDVCommandStatus_OK)
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

            var pluginResult = CDVPluginResult.init(status: CDVCommandStatus_ERROR, messageAs: "Message not found")
            for msg in inboxItems {
                if msg.id != messageId {
                    continue
                }

                let result = OptimoveInApp.markAsRead(item: msg)
                pluginResult = result ?
                    CDVPluginResult.init(status: CDVCommandStatus_OK) :
                    CDVPluginResult.init(status: CDVCommandStatus_ERROR, messageAs: "Failed to mark message as read")

                break
            }
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        })
    }

    @objc(inAppMarkAllInboxItemsAsRead:)
    func inAppMarkAllInboxItemsAsRead(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run(inBackground: {
            let result = OptimoveInApp.markAllInboxItemsAsRead()

            if result {
                self.commandDelegate.send(.init(status: .ok), callbackId: command.callbackId)
            }
            else {
                self.commandDelegate.send(.init(status: .error, messageAs: "Failed to mark all messages as read"), callbackId: command.callbackId)
            }
        })
    }

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
}
