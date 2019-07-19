

#import <Foundation/Foundation.h>
#import "NotificationHandler.h"

@interface NotificationManager : NSObject

@property id<NotificationDelegate> delegate;

+ (NotificationManager *)sharedInstance;

@end
