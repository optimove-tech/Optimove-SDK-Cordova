//
//  InitializePluginManager.m
//  Example_App
//
//  Created by Barak Ben Hur on 03/08/2022.
//

#import "InitializePluginManager.h"

@implementation InitializePluginManager

+ (void) load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [NSNotificationCenter.defaultCenter addObserver: self
                                               selector: @selector(didFinishLaunching:)
                                                   name: UIApplicationDidFinishLaunchingNotification
                                                 object: nil];
    });
}

+ (void) didFinishLaunching: (NSNotification*) n {
    Optimove_Cordova *plugin = [[Optimove_Cordova alloc] init];
    [plugin didFinishLaunching:n];
}

@end
