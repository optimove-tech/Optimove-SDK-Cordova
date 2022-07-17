import OptimoveSDK
@objc(Optimobile_Cordova) class ModusEchoSwift : CDVPlugin {
    @objc(setInstallId:)
    func setInstallId(command: CDVInvokedUrlCommand) {
        Optimove.setUserId(command.arguments[0] as? String ?? "")
    }
    
    @objc(initialize:)
    func initialize(command: CDVInvokedUrlCommand) {
        Optimove.initialize(with: command.arguments[0] as! OptimoveConfig)
    }
    
    @objc(pushCampaignsIsEnabled:)
    func pushCampaignsIsEnabled(command: CDVInvokedUrlCommand) {
        OptimoveInApp.updateConsent(forUser: command.arguments[0] as? Bool ?? false)
    }
    
//    @objc(getInboxItems:)
//    func getInboxItems(command: CDVInvokedUrlCommand) -> [InAppInboxItem] {
//       return OptimoveInApp.getInboxItems()
//    }
}
