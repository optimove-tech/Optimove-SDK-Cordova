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

    @objc(reportEvent:)
    func reportEvent(command: CDVInvokedUrlCommand) {
        guard let name = command.arguments[0] as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "name is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        var parameters: [String: Any] = [:]

        if let param = command.arguments[1] as? [String: Any] {
            parameters = param
        }

        Optimove.shared.reportEvent(name: name, parameters: parameters)

        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(reportScreenVisit:)
    func reportScreenVisit(command: CDVInvokedUrlCommand) {
        guard let screenTitle = command.arguments.first as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "screenTitle is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        let screenCategory = command.arguments[1] as? String

        Optimove.shared.reportScreenVisit(screenTitle: screenTitle, screenCategory: screenCategory)

        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(registerUser:)
    func registerUser(command: CDVInvokedUrlCommand) {
        guard let id = command.arguments.first as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "id is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        guard let  email = command.arguments[1] as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "email is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        Optimove.shared.registerUser(sdkId: id, email: email)

        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(setUserId:)
    func setUserId(command: CDVInvokedUrlCommand) {
        guard let id = command.arguments.first as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "id is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        Optimove.shared.setUserId(id)

        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(getVisitorID:)
    func getVisitorID(command: CDVInvokedUrlCommand) {
        let pluginResult = CDVPluginResult(status: .ok, messageAs: Optimove.getVisitorID())
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }

    @objc(setUserEmail:)
    func setUserEmail(command: CDVInvokedUrlCommand) {
        guard let email = command.arguments.first as? String else {
            let pluginResult = CDVPluginResult(status: .error, messageAs: "email is invalid")
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            return
        }

        Optimove.shared.setUserEmail(email: email)

        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }
}
