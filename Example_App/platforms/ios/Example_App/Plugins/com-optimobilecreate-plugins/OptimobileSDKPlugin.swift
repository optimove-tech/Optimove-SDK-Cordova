<<<<<<< HEAD:Cordova_QA_App/platforms/ios/Cordova_QA_App/Plugins/com-optimobilecreate-plugins/OptimobileSDKPlugin.swift
import OptimoveSDK
@objc(Optimobile_Cordova) class OptimobileSDKPlugin : CDVPlugin {
    private let optimoveCredentialsKey = "optimove_credentials"
    private let optimoveMobileCredentialsKey = "optimove_mobile_credentials"
    
    private let credentialsJsonName = "optimove"
    
    @objc(initialize:)
    func initialize(command: CDVInvokedUrlCommand) {
        guard let credentials = getCredentials(name: credentialsJsonName) else { return }
        let args = command.arguments
        let inAppConsentStrategy: InAppConsentStrategy = {
            if let strategy = args?[0] as? String {
                return .init(rawValue: strategy)!
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
}
=======
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
>>>>>>> Cordova-Android-branch:Example_App/platforms/ios/Example_App/Plugins/com-optimobilecreate-plugins/OptimobileSDKPlugin.swift
