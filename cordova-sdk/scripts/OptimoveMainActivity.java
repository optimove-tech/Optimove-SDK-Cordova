package {{APP_NAMESPACE}};

import android.os.Bundle;
import android.content.Intent;

import org.apache.cordova.*;
import com.optimove.android.Optimove;

public class OptimoveMainActivity extends MainActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Optimove.getInstance().seeIntent(getIntent(), savedInstanceState);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        Optimove.getInstance().seeInputFocus(hasFocus);
    }

    @Override
    protected void onNewIntent(Intent intent) {
       super.onNewIntent(intent);
       Optimove.getInstance().seeIntent(intent);
    }
}
