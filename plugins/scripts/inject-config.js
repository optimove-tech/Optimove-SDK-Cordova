
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
    optimoveConfig.enableDeferredDeepLinking
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

  writeGoogleServicesJson(context);
}

function createJsonWithDefaultValues(optimoveCredentials, optimoveMobileCredentials , inAppConsentStrategy, enableDeferredDeepLinking) {
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
      enableDeferredDeepLinking === 'true' || enableDeferredDeepLinking === true
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