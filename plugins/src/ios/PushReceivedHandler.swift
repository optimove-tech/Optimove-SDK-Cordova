//
//  PushReceivedHandler.swift
//  Example_App
//
//  Created by Barak Ben Hur on 07/08/2022.
//

import UIKit

class PushReceivedHandler: NSObject {
    
    override init() {
        super.init()
        swizzleDidReceiveRemoteNotification()
    }
    
    private func swizzleDidReceiveRemoteNotification() {
        let appDelegate = UIApplication.shared.delegate
        guard let appDelegateClass: AnyClass = object_getClass(appDelegate) else { return }
        
        let originalSelector = #selector(UIApplicationDelegate.application(_:didReceiveRemoteNotification:fetchCompletionHandler:))
        let swizzledSelector = #selector(PushReceivedHandler.self.application(_:didReceiveRemoteNotification:fetchCompletionHandler:))
        
        guard let swizzledMethod = class_getInstanceMethod(PushReceivedHandler.self, swizzledSelector) else {
            return
        }
        
        if let originalMethod = class_getInstanceMethod(appDelegateClass, originalSelector)  {
            // exchange implementation
            method_exchangeImplementations(originalMethod, swizzledMethod)
        } else {
            // add implementation
            class_addMethod(appDelegateClass, swizzledSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod))
        }
    }
    
    @objc private func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        print("Handle Push")
    }
}
