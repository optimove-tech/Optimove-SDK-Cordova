import OptimoveSDK
import NotificationCenter
@objc(Optimove_Cordova) class OptimoveSDKPlugin : CDVPlugin {
    private let optimoveCredentialsKey = "optimoveCredentials"
    private let optimoveMobileCredentialsKey = "optimoveMobileCredentials"
    
    private lazy var config: OptimoveConfig? = {
        let configPath = Bundle.main.path(forResource: "optimove", ofType: "plist")
        
        guard let configPath = configPath else {
            print("optimove.plist NOT FOUND")
            return nil
        }
        
        guard let configValues: [String: String] = NSDictionary(contentsOfFile: configPath) as? [String: String] else {
            print("optimove.plist IS NOT VALID")
            return nil
        }
        
        let config = OptimoveConfigBuilder(optimoveCredentials: configValues[optimoveCredentialsKey], optimobileCredentials: configValues[optimoveMobileCredentialsKey])
        
        return config.build()
    }()
    
    func load() {
        NotificationCenter.default.addObserver(self, selector: #selector(self.didFinishLaunching(notification:)), name: UIApplication.didFinishLaunchingNotification, object: nil)
    }
    
    @objc func didFinishLaunching(notification: NSNotification) {
        guard let config = config else { return }
        Optimove.initialize(with: config)
    }
}
