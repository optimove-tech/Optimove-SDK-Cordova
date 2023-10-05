
const fs = require('fs');
const path = require('path');
const elementtree = require('elementtree');


// ===================== BOTH PLATFORMS ======================
module.exports = function injectOptimoveConfig(context) {
  const optimoveConfig = readOptimoveSettings(context);
  if (!optimoveConfig) {
      return;
  }

  const config = createJsonWithDefaultValues(
    optimoveConfig.optimoveCredentials,
    optimoveConfig.optimoveMobileCredentials,
    optimoveConfig.inAppConsentStrategy,
    optimoveConfig.enableDeferredDeepLinking,
    optimoveConfig.androidPushNotificationIconName
  );

  if (hasPlatform(context, 'android')) {
      console.info('Optimove: Preparing Android platform...');
      prepareAndroid(context, config);
  }

  if (hasPlatform(context, 'ios')) {
      console.info('Optimove: Preparing iOS platform...');
      prepareIos(context, config);
  }
};

function readOptimoveSettings(context) {
  const configFile = path.join(context.opts.projectRoot, "optimove.json");

  if (!fs.existsSync(configFile)) {
    console.warn(
      "Optimove: config file not found, please ensure optimove.json is present in your project root"
    );
    return false;
  }

  const configJson = fs.readFileSync(configFile, { encoding: "utf-8" });
  let config;

  try {
    config = JSON.parse(configJson);
  } catch (e) {
    console.error("Optimove: optimove.json file not valid JSON");
    return false;
  }

  if (!isValidConfig(config)) {
    return false;
  }

  return config;
}

function isValidConfig(config) {
  if (!config || typeof config != "object") {
    console.error("Optimove: optimove.json not a valid JSON object");
    return false;
  }
  if (
    (isEmpty(config.optimoveCredentials) ||
      !isString(config.optimoveCredentials)) &&
    (isEmpty(config.optimoveMobileCredentials) ||
      !isString(config.optimoveMobileCredentials))
  ) {
    console.error(
      "Optimove: invalid/missing optimove credentials or optimove mobile credentials entries in optimove.json"
    );
    return false;
  }
  const validInAppStrategies = [
    "auto-enroll",
    "explicit-by-user",
    "in-app-disabled",
  ];

  if (
    !isEmpty(config.inAppConsentStrategy) &&
    validInAppStrategies.indexOf(config.inAppConsentStrategy) < 0
  ) {
    console.error(
      "Optimove: invalid inAppConsentStrategy given in optimove.json, valid options are: " +
        validInAppStrategies.join(", ")
    );
    return false;
  } else if (isEmpty(config.inAppConsentStrategy)) {
    config.inAppConsentStrategy = "in-app-disabled";
  }

  return config;
}

function isEmpty(val) {
  return !val || !val.length;
}

function isString(val) {
  return typeof val === "string";
}

function hasPlatform(context, platform) {
  return context.opts.platforms.indexOf(platform) > -1;
}

function renderTemplate(name, values) {
  const templatePath = path.join(__dirname, name);
  const template = fs.readFileSync(templatePath, { encoding: "utf-8" });
  return replaceFields(template, values);
}

function replaceFields(str, fields) {
  return Object.keys(fields).reduce(
    (str, field) => str.replace(`{{${field}}}`, fields[field]),
    str
  );
}


// ===================== ANDROID SPECIFIC ======================

function prepareAndroid(context, config) {
  writeOptimoveXml(context, config);

  if (config.ENABLE_DEFERRED_DEEP_LINKING){
    createOptimoveMainActivity(context);
  }

  if (!isEmpty(config.ANDROID_PUSH_NOTIFICATION_ICON)){
    copyPushNotificationIcons(context, config);
    updatePushNotificationIconMetaData(context, config);
  }

  writeGoogleServicesJson(context);
}

function createJsonWithDefaultValues(
  optimoveCredentials, 
  optimoveMobileCredentials , 
  inAppConsentStrategy, 
  enableDeferredDeepLinking,
  androidPushNotificationIconName) {
  return {
    OPTIMOVE_CREDENTIALS:
      !isEmpty(optimoveCredentials) &&
      isString(optimoveCredentials)
        ? optimoveCredentials
        : "",
    OPTIMOVE_MOBILE_CREDENTIALS:
      !isEmpty(optimoveMobileCredentials) &&
      isString(optimoveMobileCredentials)
        ? optimoveMobileCredentials
        : "",
    IN_APP_STRATEGY: inAppConsentStrategy,
    ENABLE_DEFERRED_DEEP_LINKING:
      enableDeferredDeepLinking === true,
    ANDROID_PUSH_NOTIFICATION_ICON: 
      !isEmpty(androidPushNotificationIconName) &&
      isString(androidPushNotificationIconName)
        ? androidPushNotificationIconName
        : ""
 }
}

function writeOptimoveXml(context, config){
    const dest = path.join(
      context.opts.projectRoot,
      "platforms",
      "android",
      "app",
      "src",
      "main",
      "res",
      "values",
      "optimove.xml"
    );

    const realisedTemplate = renderTemplate(
      "optimove.xml",
      config
    );

    fs.writeFileSync(dest, realisedTemplate, { encoding: "utf-8" });
}

function createOptimoveMainActivity(context){
  const package = getPackage(context);
  const activityName = "OptimoveMainActivity.java";

  let parts = [context.opts.projectRoot, "platforms", "android", "app", "src",  "main",  "java"];
  parts = parts.concat(package.split('.'))
  parts.push(activityName);

  const activityDest = path.join(...parts);

  const activitySrc = renderTemplate(
    activityName, {
      APP_NAMESPACE: package
  });

  fs.writeFileSync(activityDest, activitySrc, { encoding: "utf-8" });
}

function getPackage(context){
  const config_xml = path.join(context.opts.projectRoot, 'config.xml');

  const data = fs.readFileSync(config_xml).toString();
  const etree = elementtree.parse(data);

  return etree.getroot().attrib.id;
}

function writeGoogleServicesJson(context){
  const gServicesJson = path.join(
    context.opts.projectRoot,
    "google-services.json"
  );

  if (fs.existsSync(gServicesJson)) {
    console.info("Optimove: found google-services.json, configuring FCM");
    const gServicesDest = path.join(
      context.opts.projectRoot,
      "platforms",
      "android",
      "app",
      "google-services.json"
    );

    fs.copyFileSync(gServicesJson, gServicesDest);
  } else {
    console.warn(
      "Optimove: google-services.json was not found, skipping FCM configuration"
    );
  }
}

function copyPushNotificationIcons(context, config) {
  const androidResourcesSrc = path.join(
    context.opts.projectRoot,
    "android-push-notification-icon"
  );

  if (!fs.existsSync(androidResourcesSrc)) {
    console.warn(
      `Optimove: ${androidResourcesSrc} path was not found, skipping push icon configuration`
    );
    return;
  }

  var folders = fs.readdirSync(androidResourcesSrc);

  const androidResourceDest = path.join(
    context.opts.projectRoot,
    "platforms",
    "android",
    "app",
    "src",
    "main",
    "res",
  );

  const fileName = `${config.ANDROID_PUSH_NOTIFICATION_ICON}.png`;

  folders.forEach(folder => {
    const iconDensitySrc = path.join(
      androidResourcesSrc,
      folder,
      fileName,
    );

    if (!fs.existsSync(iconDensitySrc)) {
      console.warn(
        `Optimove: ${iconDensitySrc} file was not found. Skipping push icon for ${folder} folder.`
      );
      return;
    };

    const iconDensityDest = path.join(
      androidResourceDest,
      folder,
      fileName,
    );
    
    fs.cp(iconDensitySrc, iconDensityDest, { recursive: true }, (err) => {
      if (err) {
        console.error(
          `Optimove: failed to copy ${iconDensitySrc} to ${iconDensityDest}`, err
        );
      }
    });
  });
}

function updatePushNotificationIconMetaData(context, config) {
  const metaDataName = 'com.optimove.android.cordova.OptimoveInitProvider.notification_icon';
  const metaDataResource = `@drawable/${config.ANDROID_PUSH_NOTIFICATION_ICON}`;

  // read the xml
  const plugin_xml = path.join(context.opts.plugin.dir, 'plugin.xml');
  const data = fs.readFileSync(plugin_xml).toString();
  const etree = elementtree.parse(data);

  const platform = etree.findall('./platform/[@name="android"]')[0];
  if (!platform) {
    console.error('Optimove: android platform tag not found, aborting push icon injection');
    return;
  }

  // find or create a config-file tag for the manifest
  const manifestConfigs = etree.findall(`*/config-file/[@target="app/src/main/AndroidManifest.xml"]`);
  if (manifestConfigs.length == 0) {
    console.info('Optimove: config file not found, creating');
    const configFile = elementtree.SubElement(platform, 'config-file');
    configFile.set('target', 'app/src/main/AndroidManifest.xml');
    configFile.set('parent', '/manifest/application');
    manifestConfigs.push(configFile);
  }

  // remove any existing meta-data tags with the same name
  manifestConfigs
    .forEach(configFile => {
      configFile
        .findall(`meta-data/[@android:name="${metaDataName}"]`)
        .forEach(metaData => {
          configFile.remove(metaData);
        });
  });

  // add the new meta-data tag
  const metaData = elementtree.SubElement(manifestConfigs[0], 'meta-data');
  metaData.set('android:name', metaDataName);
  metaData.set('android:resource', metaDataResource);

  // write the updated xml
  const xml = etree.write({'xml_declaration': true, 'indent': 4});
  fs.writeFileSync(plugin_xml, xml, { encoding: "utf-8" });
}

// ===================== IOS SPECIFIC ======================

function prepareIos(context, config) {
  const iosPath = path.join(context.opts.projectRoot, 'platforms', 'ios');
  const files = fs.readdirSync(iosPath);

  const xcodeProj = files.find(name => name.indexOf('.xcodeproj') > -1);
  const targetName = xcodeProj.replace('.xcodeproj', '');

  const configDest = path.join(
      iosPath,
      targetName,
      'Resources',
      'optimove.plist'
  );

  if (!fs.existsSync(configDest)) {
      console.error(
          'optimove: optimove.plist resource not found, aborting setup'
      );
      return;
  }

  const realisedTemplate = renderTemplate('optimove.plist', config);

  fs.writeFileSync(configDest, realisedTemplate, { encoding: 'utf-8' });
}