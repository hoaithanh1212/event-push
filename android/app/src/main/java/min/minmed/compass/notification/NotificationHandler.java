package min.minmed.compass.notification;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

import min.minmed.compass.MainApplication;

/**
 * Created by sts on 3/22/17.
 */

public class NotificationHandler extends ReactContextBaseJavaModule {

    private static final String NotificationHandler_Name = "NotificationHandler";

    private static final String DID_REGISTER_REMOTE_NOTIFICATION = "DID_REGISTER_REMOTE_NOTIFICATION";
    private static final String DID_RECEIVE_REMOTE_NOTIFICATION = "DID_RECEIVE_REMOTE_NOTIFICATION";
    private static final String DID_FAIL_REGISTER_REMOTE_NOTIFICATION = "DID_FAIL_REGISTER_REMOTE_NOTIFICATION";
    private static final String DID_CLICK_NOTIFICATION = "DID_CLICK_NOTIFICATION";
    private static final String SET_CURRENT_GROUP_CHAT_STS = "SET_CURRENT_GROUP_CHAT_STS";
    private static final String USER_LOGIN_ON_OTHER_DEVICE = "USER_LOGIN_ON_OTHER_DEVICE";

    private ReactContext reactContext;

    public NotificationHandler(ReactApplicationContext reactContext) {
        super(reactContext);

        NotificationManager.getInstance().setNotificationHandler(this);

        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return NotificationHandler_Name;
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DID_REGISTER_REMOTE_NOTIFICATION, DID_REGISTER_REMOTE_NOTIFICATION);
        constants.put(DID_RECEIVE_REMOTE_NOTIFICATION, DID_RECEIVE_REMOTE_NOTIFICATION);
        constants.put(DID_FAIL_REGISTER_REMOTE_NOTIFICATION, DID_FAIL_REGISTER_REMOTE_NOTIFICATION);
        constants.put(DID_CLICK_NOTIFICATION, DID_CLICK_NOTIFICATION);
        constants.put(USER_LOGIN_ON_OTHER_DEVICE, USER_LOGIN_ON_OTHER_DEVICE);
        constants.put(SET_CURRENT_GROUP_CHAT_STS, SET_CURRENT_GROUP_CHAT_STS);
        return constants;
    }

    @ReactMethod
    public void registerForPushNotifications() {
        Log.d("", "registerForPushNotifications");
        String deviceToken = NotificationManager.getInstance().getDeviceToken();
        if (deviceToken == null) {
            deviceToken = MainApplication.getInstance().getAppConfig().getDeviceToken();
        }
        didRegisterRemoteNotification(deviceToken);
    }

    public void didRegisterRemoteNotification(String deviceToken) {
        try {
            WritableMap eventParams = Arguments.createMap();
            eventParams.putString("deviceToken", deviceToken);
            this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(DID_REGISTER_REMOTE_NOTIFICATION, eventParams);
        } catch (Exception e) {
        }
    }

    public void didFailToRegisterRemoteNotification() {
        WritableMap eventParams = Arguments.createMap();
        eventParams.putString("message", "Cannot get Firebase notification token");
        this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(DID_FAIL_REGISTER_REMOTE_NOTIFICATION, eventParams);
    }

    public void didReceiveRemoteNotification(String title, String text) {
        WritableMap eventParams = Arguments.createMap();
        eventParams.putString("title", title);
        eventParams.putString("text", text);
        this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(DID_RECEIVE_REMOTE_NOTIFICATION, eventParams);
    }

    public void sendEvent(@androidx.annotation.Nullable WritableMap params) {
        ReactContext reactContext = getReactApplicationContext();
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(DID_CLICK_NOTIFICATION, params);
    }

    public void userLoginOnOtherDevice() {
        WritableMap eventParams = Arguments.createMap();
        eventParams.putString("message", "logout");
        this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(USER_LOGIN_ON_OTHER_DEVICE, eventParams);
    }
}
