package min.minmed.compass.notification;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Date;
import java.util.Map;

import min.minmed.compass.MainActivity;
import min.minmed.compass.R;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = MyFirebaseMessagingService.class.getSimpleName();

    public MyFirebaseMessagingService() {
        super();
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        RemoteMessage.Notification notification = remoteMessage.getNotification();
        Map<String, String> notificationData = remoteMessage.getData();

        int notificationId = (int) (new Date().getTime() % 1000);

        if (notification != null) {
            this.showNotification(getApplicationContext(), notification.getTitle(), notification.getBody(), 0, notificationId, true);
        } else {
            this.showNotification(getApplicationContext(), notificationData.get("Title"), notificationData.get("Body"), 0, notificationId, true);
        }
    }

    private void showNotification(Context context, String title, String text, int tag, int notificationId, boolean ongoing) {
        android.app.NotificationManager notificationManager = (android.app.NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);


        CharSequence name = "channel_name";
        String CHANNEL_ID = "compass_channel_id_0001";
        int importance = android.app.NotificationManager.IMPORTANCE_HIGH;

        Intent intent = new Intent(context, MainActivity.class);
        Bundle bundle = new Bundle();

        intent.putExtras(bundle);

        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context);
        builder.setContentTitle(title);
        builder.setContentText(text);
        builder.setContentIntent(pendingIntent);
        builder.setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher));
        builder.setSound(Settings.System.DEFAULT_NOTIFICATION_URI);
        long[] pattern = {500, 500, 500, 500, 500, 500, 500, 500, 500};
        builder.setVibrate(pattern);
        builder.setAutoCancel(true);


        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            builder.setSmallIcon(R.mipmap.ic_launcher);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);

            builder.setChannelId(CHANNEL_ID);

            Notification notification = builder.build();

            android.app.NotificationManager mNotificationManager = (android.app.NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            mNotificationManager.createNotificationChannel(channel);
            mNotificationManager.notify(null, notificationId, notification);

        } else {
            Notification notification = builder.build();
            notificationManager.notify(null, notificationId, notification);
        }
    }
}
