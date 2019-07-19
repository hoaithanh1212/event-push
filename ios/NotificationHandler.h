

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTLog.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTEventEmitter.h>
#import <UserNotifications/UserNotifications.h>
@import Firebase;
@import UserNotifications;

@protocol NotificationDelegate <NSObject>

- (void)didRegisterRemoteNotification:(NSString *)token;
- (void)didFailToRegisterRemoteNotification;
@end

#define DID_REGISTER_REMOTE_NOTIFICATION @"DID_REGISTER_REMOTE_NOTIFICATION"
#define DID_FAIL_REGISTER_REMOTE_NOTIFICATION @"DID_FAIL_REGISTER_REMOTE_NOTIFICATION"
#define DID_RECEIVE_REMOTE_NOTIFICATION @"DID_RECEIVE_REMOTE_NOTIFICATION"
#define DID_CLICK_NOTIFICATION @"DID_CLICK_NOTIFICATION"
#define USER_LOGIN_ON_OTHER_DEVICE @"USER_LOGIN_ON_OTHER_DEVICE"

@interface NotificationHandler : RCTEventEmitter <RCTBridgeModule, NotificationDelegate, FIRMessagingDelegate, UNUserNotificationCenterDelegate>

@end
