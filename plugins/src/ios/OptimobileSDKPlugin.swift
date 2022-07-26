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