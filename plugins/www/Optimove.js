

var exec = require('cordova/exec');



const Optimove = {

    setUserId: function (userId, success, error) {

        exec(success, error, 'OptimoveSDKPlugin', 'setUserId', [userId]);
    },
    setUserEmail: function (userEmail, success, error) {
        exec(success, error, 'OptimoveSDKPlugin', 'setUserEmail', [userEmail]);
    },

    /* eventParams is nullable*/
    reportEvent: function (eventName, eventParams, success, error) {
        exec(success, error, 'OptimoveSDKPlugin', 'reportEvent', [eventName, eventParams]);
    },

    /* screenCategory parameter is nullable*/
    reportScreenVisit: function (screenName, screenCategory, success, error) {
        exec(success, error, 'OptimoveSDKPlugin', 'reportScreenVisit', [screenName, screenCategory]);
    },
    registerUser: function (userId, userEmail, success, error) {
        exec(success, error, 'OptimoveSDKPlugin', 'registerUser', [userId, userEmail]);
    },

    getVisitorId: function (success, error) {
        exec(success, error, 'OptimoveSDKPlugin', 'getVisitorId', []);
    },

    getCurrentUserIdentifier: function (success, error) {
        exec(success, error, 'OptimoveSDKPlugin', 'getCurrentUserIdentifier', []);
    }
}
module.exports = Optimove;