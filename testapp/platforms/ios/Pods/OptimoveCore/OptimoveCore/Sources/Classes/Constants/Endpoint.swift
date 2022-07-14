//  Copyright © 2019 Optimove. All rights reserved.

import Foundation

public struct Endpoints {

    public struct Logger {
        public static let defaultEndpint = URL(string: "https://mbaas.optimove.net/report/log")!
    }

    public struct Remote {

        public struct TenantConfig {
            public static let url = URL(string: "https://sdk-cdn.optimove.net/mobilesdkconfig")!
        }

        public struct GlobalConfig {
            public static var url = URL(string: "https://sdk-cdn.optimove.net/configs/mobile")!
                .appendingPathComponent("global")
                .appendingPathComponent("v4")
                .appendingPathComponent(SdkEnvironment.getBuildSetting(for: "OPTIMOVE_CONFIG_ENV_PATH", defaultValue: "prod"))
                .appendingPathComponent("configs.json")
        }

    }
}
