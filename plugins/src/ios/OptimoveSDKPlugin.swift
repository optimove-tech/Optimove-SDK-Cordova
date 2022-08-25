import OptimoveSDK
import NotificationCenter

@objc(Optimove_Cordova) class OptimoveSDKPlugin : CDVPlugin {
    private static var optimovePluginInstance: OptimoveSDKPlugin!
    
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
        
        let optimoveCredentials = configValues[optimoveCredentialsKey]?.isEmpty == true ? nil : configValues[optimoveCredentialsKey]
        
        let optimobileCredentials = configValues[optimoveMobileCredentialsKey]?.isEmpty == true ? nil : configValues[optimoveMobileCredentialsKey]
        
        let config = OptimoveConfigBuilder(optimoveCredentials: optimoveCredentials, optimobileCredentials: optimobileCredentials)
        
        return config.build()
    }()
    
    override func pluginInitialize() {
        OptimoveSDKPlugin.optimovePluginInstance = self
    }
    
    @objc(didFinishLaunching:)
    static func didFinishLaunching(notification: Notification) {
        guard let config = OptimoveSDKPlugin.config else { return }
        
        Optimove.initialize(with: config)
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
