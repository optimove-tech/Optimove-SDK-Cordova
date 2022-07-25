package com.optimove.android.cordova;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import com.optimove.android.Optimove;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class OptimobileSDKPlugin extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
      switch(action){
        case "setUserId":
                          String userId = args.getString(0);
                          this.setUserId(userId, callbackContext);
                          return true;
        case "setUserEmail":
                            String email = args.getString(0);
                            this.setUserEmail(email, callbackContext);
                            return true;
                           
      }
      
      
        return false;
    }

    private void setUserId(String userId, CallbackContext callbackContext) {
      try{
        Optimove.getInstance().setUserId(userId);
      }catch(Exception e){
         callbackContext.error(e.getMessage());   
      }
        
      callbackContext.success();
 
    }
    private void setUserEmail(String email, CallbackContext callbackContext){
      try{
        Optimove.getInstance().setUserEmail(email);
      }catch(Exception e){
         callbackContext.error(e.getMessage());   
      }
      callbackContext.success();
    }
}