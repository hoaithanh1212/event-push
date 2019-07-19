

#import "NotificationManager.h"

@implementation NotificationManager

+ (id)sharedInstance {
  static NotificationManager *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}



@end
