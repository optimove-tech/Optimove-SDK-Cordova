#import <Cordova/CDV.h>

//copied from ProductModuleName-Swift.h
@interface Optimove_Cordova
+ (void)didFinishLaunching:(NSNotification * _Nonnull)notification;


+ (BOOL)application:(UIApplication * _Nonnull)application
       userActivity:(NSUserActivity * _Nonnull)userActivity
 restorationHandler:(void (^_Nonnull)(NSArray<id<UIUserActivityRestoring>> * _Nonnull restorableObjects))restorationHandler;

+ (void)scene:(UIScene * _Nonnull)scene
      session:(UISceneSession * _Nonnull)session
      options:(UISceneConnectionOptions * _Nonnull)connectionOptions API_AVAILABLE(ios(13.0));

+ (void)scene:(UIScene * _Nonnull)scene
 userActivity:(NSUserActivity * _Nonnull)userActivity API_AVAILABLE(ios(13.0));

@end
