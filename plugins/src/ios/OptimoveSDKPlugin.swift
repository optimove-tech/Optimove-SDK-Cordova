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
        
        let config = OptimoveConfigBuilder(optimoveCredentials: configValues[optimoveCredentialsKey], optimobileCredentials: configValues[optimoveMobileCredentialsKey])
        
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
}
