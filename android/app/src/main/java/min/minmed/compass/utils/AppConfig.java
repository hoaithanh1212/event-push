package min.minmed.compass.utils;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by thanh.nguyen on 3/9/2017.
 */

public class AppConfig {
  private SharedPreferences mSharedPreferences;
  private SharedPreferences.Editor mEditor;
  private static final String NAME = "Compass";

  private static final String DEVICE_TOKEN = "device_token";

  public AppConfig(Context context) {
    mSharedPreferences = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
    mEditor = mSharedPreferences.edit();
    mEditor.apply();
  }

  public void setDeviceToken(String deviceToken) {
    mEditor.putString(DEVICE_TOKEN, deviceToken);
    mEditor.commit();
  }

  public String getDeviceToken() {
    return mSharedPreferences.getString(DEVICE_TOKEN, "");
  }
}
