import OptimoveSDK
@objc(Optimobile_Cordova) class OptimobileSDKPlugin : CDVPlugin {
    private let optimoveCredentialsKey = "optimoveCredentials"
    private let optimoveMobileCredentialsKey = "optimoveMobileCredentials"
    
    private let credentialsJsonName = "optimove"
    
    @objc(initialize:)
    func initialize(command: CDVInvokedUrlCommand) {
        guard let credentials = getCredentials(name: credentialsJsonName) else { return }
        let args = command.arguments
        let inAppConsentStrategy: InAppConsentStrategy = {
            if let strategyName = args?[0] as? String {
                if let strategy: InAppConsentStrategy = .init(rawValue: strategyName) {
                    return strategy
                }
            }
            return.notEnabled
        }()
        let config = OptimoveConfigBuilder(optimoveCredentials: credentials[0], optimobileCredentials: credentials[1]).enableInAppMessaging(inAppConsentStrategy: inAppConsentStrategy).build()
        Optimove.initialize(with: config)
    }
    
    private func getCredentials(name: String) -> [String]? {
        guard let url = Bundle.main.url(forResource: name, withExtension: "json") else {return nil }
        if let data = try? Data(contentsOf: url) {
            do {
                guard let jsonToDict = try JSONSerialization.jsonObject(with: data, options: []) as? [String: String] else { return nil }
                guard let optimoveCredentials = jsonToDict[optimoveCredentialsKey] else { return nil }
                guard let optimoveMobileCredentials = jsonToDict[optimoveMobileCredentialsKey] else { return nil }
                return [optimoveCredentials, optimoveMobileCredentials]
            } catch {
                print(error.localizedDescription)
            }
        }
        return nil
    }
    
    @objc(updateConsent:)
    func updateConsent(command: CDVInvokedUrlCommand) {
        OptimoveInApp.updateConsent(forUser: command.arguments[0] as? Bool ?? false)
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
    
    @objc(getInboxItems:)
    func getInboxItems(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run {
            let pluginResult = CDVPluginResult(status: .ok, messageAs: OptimoveInApp.getInboxItems())
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(isAvailable:)
    func isAvailable(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run {
            let pluginResult = CDVPluginResult(status: .ok, messageAs: OptimoveInApp.getInboxItems())
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
}
