import OptimoveSDK
import NotificationCenter
@objc(Optimobile_Cordova) class OptimobileSDKPlugin : CDVPlugin {
    
    private let internalQueue = DispatchQueue(label: "com.singletioninternal.queue",
                                              qos: .default,
                                              attributes: .concurrent)
    
    private var pendingPush: PushNotification?
    
    private let optimoveCredentialsKey = "optimove_credentials"
    private let optimoveMobileCredentialsKey = "optimove_mobile_credentials"
    
    private let credentialsJsonName = "optimove"
    
    func load() {
        internalQueue.sync(flags: .barrier) {
            NotificationCenter.default.addObserver(self, selector: #selector(self.didFinishLaunching(notification:)), name: UIApplication.didFinishLaunchingNotification, object: nil)
        }
    }
    
    @objc func didFinishLaunching(notification: NSNotification) {
        let configPath = Bundle.main.path(forResource: "optimove", ofType: "plist")
        
        guard let configPath = configPath else {
            print("optimove.plist NOT FOUND");
            return
        }
        
        guard let configValues: [String: String] = NSDictionary(contentsOfFile: configPath) as? [String: String] else {
            print("optimove.plist IS NOT VALID");return
        }
        
        //        if let userInfo = notification.userInfo {
        //            let userInfoDict = notification.userInfo?[UIApplication.LaunchOptionsKey.remoteNotification];
        //            if userInfoDict != nil {
        //                pendingPush = PushNotification.init(userInfo: userInfo, response: nil)
        //            }
        //        }
        
        let config = OptimoveConfigBuilder(optimoveCredentials: configValues[optimoveCredentialsKey], optimobileCredentials: configValues[optimoveMobileCredentialsKey])
        
        if configValues["inAppConsentStrategy"] == "auto-enroll" {
            config.enableInAppMessaging(inAppConsentStrategy: .autoEnroll)
        }
        else if configValues["inAppConsentStrategy"] == "explicit-by-user" {
            config.enableInAppMessaging(inAppConsentStrategy: .explicitByUser)
        }
        
        Optimove.initialize(with: config.build())
    }
    
    @objc(reportEvent:)
    func reportEvent(command: CDVInvokedUrlCommand) {
        let name = command.arguments[0] as! String
        var parms = [String: Any]()
        for i in 1..<command.arguments.count {
            parms[command.arguments[i] as! String] = command.arguments[i + 1]
        }
        Optimove.shared.reportEvent(name: name, parameters: parms)
    }
    
    @objc(reportScreenVisit:)
    func reportScreenVisit(command: CDVInvokedUrlCommand) {
        let screenTitle = command.arguments.first!
        let screenCategory = command.arguments[1]
        Optimove.shared.reportScreenVisit(screenTitle: screenTitle as! String, screenCategory: screenCategory as? String)
    }
    
    @objc(registerUser:)
    func registerUser(command: CDVInvokedUrlCommand) {
        let sdkId = command.arguments.first!
        let email = command.arguments[1]
        Optimove.shared.registerUser(sdkId: sdkId as! String, email: email as! String)
    }
    
    @objc(setUserId:)
    func setUserId(command: CDVInvokedUrlCommand) {
        Optimove.shared.setUserId(command.arguments.first as! String)
    }
    
    @objc(getVisitorID:)
    func getVisitorID(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run {
            let pluginResult = CDVPluginResult(status: .ok, messageAs: Optimove.getVisitorID())
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(setUserEmail:)
    func setUserEmail(command: CDVInvokedUrlCommand) {
        Optimove.shared.setUserEmail(email: command.arguments.first as! String)
    }
    
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
