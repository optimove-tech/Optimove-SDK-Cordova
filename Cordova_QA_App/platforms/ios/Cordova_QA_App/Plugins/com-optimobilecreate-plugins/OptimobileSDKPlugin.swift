import OptimoveSDK
@objc(Optimobile_Cordova) class OptimobileSDKPlugin : CDVPlugin {
    private let optimoveCredentialsKey = "optimove_credentials"
    private let optimoveMobileCredentialsKey = "optimove_mobile_credentials"
    
    @objc(initialize:)
    func initialize(command: CDVInvokedUrlCommand) {
        let args = command.arguments
        
        let inAppConsentStrategy: InAppConsentStrategy = {
            if let strategy = args?[2] as? String {
                return .init(rawValue: strategy)!
            }
            return.notEnabled
        }()
        
        let config = OptimoveConfigBuilder(optimoveCredentials: args?[0] as? String, optimobileCredentials: args?[1] as? String).enableInAppMessaging(inAppConsentStrategy: inAppConsentStrategy).build()
        Optimove.initialize(with: config)
    }
    
    private func getCredentials(path: String) -> [String]? {
        if let data = path.data(using: .utf8) {
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
}
