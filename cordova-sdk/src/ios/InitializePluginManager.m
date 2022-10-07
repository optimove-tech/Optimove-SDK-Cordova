#import "InitializePluginManager.h"
#import "Bridging-Header.h"

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
    [Optimove_Cordova didFinishLaunching:n cdvVersion: CDV_VERSION];
}

@end

