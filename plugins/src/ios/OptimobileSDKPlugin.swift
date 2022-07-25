import OptimoveSDK
@objc(Optimobile_Cordova) class OptimobileSwift : CDVPlugin {
    @objc(initialize:)
    func initialize(command: CDVInvokedUrlCommand) {
        let args = command.arguments
        let config = OptimoveConfigBuilder(optimoveCredentials: args?[0] as? String, optimobileCredentials: args?[1] as? String).enableInAppMessaging(inAppConsentStrategy: .explicitByUser).build()
        Optimove.initialize(with: config)
    }
}