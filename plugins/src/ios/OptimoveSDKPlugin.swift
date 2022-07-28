import OptimoveSDK
import NotificationCenter
@objc(Optimobile_Cordova) class OptimobileSDKPlugin : CDVPlugin {
    private let internalQueue = DispatchQueue(label: "com.singletioninternal.queue",
                                              qos: .default,
                                              attributes: .concurrent)
    
    private var pendingPush: PushNotification?
    
    private let optimoveCredentialsKey = "optimoveCredentials"
    private let optimoveMobileCredentialsKey = "optimoveMobileCredentials"
    
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
        
        if let userInfo = notification.userInfo {
            let userInfoDict = notification.userInfo?[UIApplication.LaunchOptionsKey.remoteNotification];
            if userInfoDict != nil {
                pendingPush = PushNotification.init(userInfo: userInfo, response: nil)
            }
        }
        
        let config = OptimoveConfigBuilder(optimoveCredentials: configValues[optimoveCredentialsKey], optimobileCredentials: configValues[optimoveMobileCredentialsKey])
        
        if configValues["inAppConsentStrategy"] == "auto-enroll" {
            config.enableInAppMessaging(inAppConsentStrategy: .autoEnroll)
        }
        else if configValues["inAppConsentStrategy"] == "explicit-by-user" {
            config.enableInAppMessaging(inAppConsentStrategy: .explicitByUser)
        }
        
        Optimove.initialize(with: config.build())
    }
}
