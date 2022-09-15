#import "InitializePluginManager.h"

//copied from ProductModuleName-Swift.h
@interface Optimove_Cordova
+ (void)didFinishLaunching:(NSNotification * _Nonnull)notification;
@end

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
    [Optimove_Cordova didFinishLaunching:n];
}

@end

