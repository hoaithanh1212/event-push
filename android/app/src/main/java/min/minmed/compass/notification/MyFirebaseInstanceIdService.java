package min.minmed.compass.notification;

/**
 * Created by sts on 3/22/17.
 */

import android.util.Log;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;

import min.minmed.compass.MainApplication;

public class MyFirebaseInstanceIdService extends FirebaseInstanceIdService {

    @Override
    public void onTokenRefresh() {
        super.onTokenRefresh();

        String refreshedToken = FirebaseInstanceId.getInstance().getToken();
        Log.d("Refreshed token", refreshedToken);

        NotificationManager.getInstance().setDeviceToken(refreshedToken);

        if (NotificationManager.getInstance().getNotificationHandler() != null) {
            NotificationManager.getInstance().getNotificationHandler().didRegisterRemoteNotification(refreshedToken);
        }

        if (MainApplication.getInstance().getAppConfig() != null)
            MainApplication.getInstance().getAppConfig().setDeviceToken(refreshedToken);
    }
}
