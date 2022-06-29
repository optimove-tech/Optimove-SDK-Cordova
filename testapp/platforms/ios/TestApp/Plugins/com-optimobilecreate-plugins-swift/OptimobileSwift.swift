import OptimoveSDK
@objc(Optimobile_Cordova) class OptimobileSwift : CDVPlugin {
    @objc(initialize:)
    func initialize(command: CDVInvokedUrlCommand) {
        let args = command.arguments
        let config = OptimoveConfigBuilder(optimoveCredentials: args?[0] as? String, optimobileCredentials: args?[1] as? String).enableInAppMessaging(inAppConsentStrategy: .explicitByUser).build()
        Optimove.initialize(with: config)
    }
    
    @objc(setInstallId:)
    func setInstallId(command: CDVInvokedUrlCommand) {
        Optimove.shared.setUserId(command.arguments[0] as? String ?? "")
    }
    
    @objc(pushCampaignsIsEnabled:)
    func pushCampaignsIsEnabled(command: CDVInvokedUrlCommand) {
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
    
    @objc(getVisitorID)
    func getVisitorID() -> String? {
        return Optimove.getVisitorID()
    }
    
    @objc(setUserEmail:)
    func setUserEmail(command: CDVInvokedUrlCommand) {
        Optimove.shared.setUserEmail(email: command.arguments.first as! String)
    }
    
//    @objc(getInboxItems:)
//    func getInboxItems(command: CDVInvokedUrlCommand) -> [InAppInboxItem] {
//       return OptimoveInApp.getInboxItems()
//    }
}
