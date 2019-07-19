package min.minmed.compass;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.remobile.toast.RCTToastPackage;
import fr.snapp.imagebase64.RNImgToBase64Package;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.react.rnspinkit.RNSpinkitPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import java.util.Arrays;
import java.util.List;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import min.minmed.compass.notification.NotificationModule;
import min.minmed.compass.utils.AppConfig;


public class MainApplication extends Application implements ReactApplication {

    private static MainApplication sInstance;
    private AppConfig mAppConfig;

    public static MainApplication getInstance() {
        return sInstance;
    }

    public AppConfig getAppConfig() {
        return mAppConfig;
    }

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new MPAndroidChartPackage(),
            new RNImgToBase64Package(),
            new ImageResizerPackage(),
            new PickerPackage(),
            new RCTToastPackage(),
            new RNDeviceInfo(),
                    new RNGoogleSigninPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new RNSpinkitPackage(),
                    new RNGestureHandlerPackage(),
                    new NotificationModule()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        sInstance = this;
        SoLoader.init(this, /* native exopackage */ false);
        mAppConfig = new AppConfig(this);
    }
}
