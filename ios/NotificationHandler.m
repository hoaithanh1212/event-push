
#import "NotificationHandler.h"
#import "NotificationManager.h"

NSString *const kGCMMessageIDKey = @"gcm.message_id";

@implementation NotificationHandler
RCT_EXPORT_MODULE(NotificationHandler);

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    [NotificationManager sharedInstance].delegate = self;
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[DID_REGISTER_REMOTE_NOTIFICATION, DID_FAIL_REGISTER_REMOTE_NOTIFICATION, DID_RECEIVE_REMOTE_NOTIFICATION, DID_CLICK_NOTIFICATION,USER_LOGIN_ON_OTHER_DEVICE];
}

- (NSDictionary *)constantsToExport {
  return @{DID_REGISTER_REMOTE_NOTIFICATION: DID_REGISTER_REMOTE_NOTIFICATION,
           DID_FAIL_REGISTER_REMOTE_NOTIFICATION: DID_FAIL_REGISTER_REMOTE_NOTIFICATION,
           DID_RECEIVE_REMOTE_NOTIFICATION: DID_RECEIVE_REMOTE_NOTIFICATION,
           DID_CLICK_NOTIFICATION: DID_CLICK_NOTIFICATION,
           USER_LOGIN_ON_OTHER_DEVICE: USER_LOGIN_ON_OTHER_DEVICE
           };
}

- (void)registerForAPNS {
  UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeBadge | UIUserNotificationTypeAlert | UIUserNotificationTypeSound) categories:nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
  });
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
  [center requestAuthorizationWithOptions:UNAuthorizationOptionBadge|UNAuthorizationOptionSound|UNAuthorizationOptionAlert completionHandler:^(BOOL granted, NSError * _Nullable error) {
    
  }];
}

- (void)didRegisterRemoteNotification:(NSString *)token {
  [self sendEventWithName:DID_REGISTER_REMOTE_NOTIFICATION body:token];
}

- (void)didFailToRegisterRemoteNotification {
  [self sendEventWithName:DID_FAIL_REGISTER_REMOTE_NOTIFICATION body:@{@"message": @"fail roi"}];
}

RCT_EXPORT_METHOD(registerForPushNotifications) {
  if (floor(NSFoundationVersionNumber) <= NSFoundationVersionNumber_iOS_9_x_Max) {
    UIUserNotificationType allNotificationTypes =
    (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings =
    [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    });
  } else {
    // iOS 10 or later
#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
    // For iOS 10 display notification (sent via APNS)
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions =
    UNAuthorizationOptionAlert
    | UNAuthorizationOptionSound
    | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:authOptions completionHandler:^(BOOL granted, NSError * _Nullable error) {
    }];
#endif
  }
  
  [FIRMessaging messaging].delegate = self;
  
  [self registerForAPNS];
}

#pragma mark - UNUserNotificationCenterDelegate
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  NSDictionary *userInfo = notification.request.content.userInfo;
  [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
  }
  NSLog(@"%@", userInfo);
  completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionSound);
  [self sendEventWithName:DID_RECEIVE_REMOTE_NOTIFICATION body:userInfo];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  
  NSMutableDictionary *userInfo = [NSMutableDictionary dictionaryWithDictionary:response.notification.request.content.userInfo];
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
  }
  completionHandler();
  [self sendEventWithName:DID_CLICK_NOTIFICATION body:userInfo];
}

#pragma mark - FIRMessagingDelegate
- (void)messaging:(FIRMessaging *)messaging didRefreshRegistrationToken:(NSString *)fcmToken {
  NSString *tokenJSONString = [NSString stringWithFormat:@"{\"deviceToken\": \"%@\"}", fcmToken];
  [[NotificationManager sharedInstance].delegate didRegisterRemoteNotification:tokenJSONString];
}

- (void)messaging:(FIRMessaging *)messaging didReceiveMessage:(FIRMessagingRemoteMessage *)remoteMessage {
  NSLog(@"Received data message: %@", remoteMessage.appData);
}

@end

