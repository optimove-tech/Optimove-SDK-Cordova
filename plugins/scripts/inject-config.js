
const fs = require('fs');
const path = require('path');

function hasPlatform(context, platform) {
    return context.opts.platforms.indexOf(platform) > -1;
}

function replaceFields(str, fields) {
    return Object.keys(fields).reduce(
        (str, field) => str.replace(`{{${field}}}`, fields[field]),
        str
    );
}

function renderTemplate(name, values) {
    const templatePath = path.join(__dirname, name);
    const template = fs.readFileSync(templatePath, { encoding: 'utf-8' });
    return replaceFields(template, values);
}

function isEmpty(val) {
    return !val || !val.length;
}

function isString(val) {
    return typeof val === 'string';
}
function readOptimoveSettings(context) {
    const configFile = path.join(context.opts.projectRoot, 'optimove.json');

    if (!fs.existsSync(configFile)) {
        console.warn(
            'Optimove: config file not found, please ensure optimove.json is present in your project root'
        );
        return false;
    }

    const configJson = fs.readFileSync(configFile, { encoding: 'utf-8' });
    let config;

    try {
        config = JSON.parse(configJson);
    } catch (e) {
        console.error('Optimove: optimove.json file not valid JSON');
        return false;
    }

    if (!isValidConfig(config)) {
        return false;
    }

    return config;
}

function prepareAndroid(context, optimoveConfig) {
    const dest = path.join(
        context.opts.projectRoot,
        'platforms',
        'android',
        'app',
        'src',
        'main',
        'res',
        'values',
        'optimove.xml'
    );

    const config = renderTemplate('optimove.xml', {
        OPTIMOVE_CREDENTIALS: optimoveConfig.optimoveCredentials,
        OPTIMOVE_MOBILE_CREDENTIALS: optimoveConfig.optimoveMobileCredentials,
        IN_APP_STRATEGY: optimoveConfig.optimoveInAppConsentStrategy
    });

    fs.writeFileSync(dest, config, { encoding: 'utf-8' });
    
    const gServicesJson = path.join(
        context.opts.projectRoot,
        'google-services.json'
    );

    if (fs.existsSync(gServicesJson)) {
        console.info('Optimove: found google-services.json, configuring FCM');
        const gServicesDest = path.join(
            context.opts.projectRoot,
            'platforms',
            'android',
            'app',
            'google-services.json'
        );

        fs.copyFileSync(gServicesJson, gServicesDest);

    } else {
        console.warn(
            'Optimove: google-services.json was not found, skipping FCM configuration'
        );
    }

   
}
module.exports = function injectOptimoveConfig(context) {
    const optimoveConfig = readOptimoveSettings(context);
    if (!optimoveConfig) {
        return;
    }

    if (hasPlatform(context, 'android')) {
        console.info('Optimove: Preparing Android platform...');
        prepareAndroid(context, optimoveConfig);
    }
};

function isValidConfig(config) {
    if (!config || typeof config != 'object') {
        console.error('Optimove: optimove.json not a valid JSON object');
        return false;
    }
    if (
        isEmpty(config.optimoveCredentials) ||
        isEmpty(config.optimoveMobileCredentials) ||
        !isString(config.optimoveCredentials) ||
        !isString(config.optimoveMobileCredentials)
    ) {
        console.error(
            'Optimove: invalid/missing optimove credentials or optimove mobile credentials entries in optimove.json'
        );
        return false;
    }
    const validInAppStrategies = [
        'auto-enroll',
        'explicit-by-user',
        'in-app-disabled'
    ];

    if (
        !isEmpty(config.inAppConsentStrategy) &&
        validInAppStrategies.indexOf(config.inAppConsentStrategy) < 0
    ) {
        console.error(
            'Optimove: invalid inAppConsentStrategy given in optimove.json, valid options are: ' +
            validInAppStrategies.join(', ')
        );
        return false;
    } else if (isEmpty(config.inAppConsentStrategy)) {
        config.inAppConsentStrategy = 'in-app-disabled';
    }

    return config;
}