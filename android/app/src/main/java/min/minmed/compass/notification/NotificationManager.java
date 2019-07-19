package min.minmed.compass.notification;

/**
 * Created by sts on 3/22/17.
 */

public class NotificationManager {

    private static final NotificationManager instance = new NotificationManager();

    private NotificationHandler notificationHandler;

    public static NotificationManager getInstance() {
        return instance;
    }

    public NotificationHandler getNotificationHandler() {
        return notificationHandler;
    }

    void setNotificationHandler(NotificationHandler notificationHandler) {
        this.notificationHandler = notificationHandler;
    }

    String getDeviceToken() {
        return deviceToken;
    }

    void setDeviceToken(String deviceToken) {
        this.deviceToken = deviceToken;
    }

    private String deviceToken;

    private NotificationManager() {
    }
}
