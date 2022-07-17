//  Copyright © 2020 Optimove. All rights reserved.

import Foundation

final class TenantEvent: Event {

    struct Constants {
        static let category = "track"
    }

    init(name: String, context: [String: Any]) {
        super.init(name: name, category: Constants.category, context: context)
    }

}
