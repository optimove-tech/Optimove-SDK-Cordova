const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const cleanOnly = args.includes('--clean');
const skipCleanup = args.includes('--no-cleanup');
const testIOS = args.includes('--ios') || !args.includes('--android');
const testAndroid = args.includes('--android') || !args.includes('--ios');
const verbose = args.includes('--verbose');

// Define test configurations
const TEST_CONFIGS = {
    standard: {
        name: 'Standard Initialization',
        config: {
            optimoveCredentials: 'TEST_OPTIMOVE_CREDENTIALS',
            optimoveMobileCredentials: 'TEST_OPTIMOBILE_CREDENTIALS',
            inAppConsentStrategy: 'auto-enroll',
            android: {
                pushNotificationIconName: 'ic_notification'
            }
        }
    },
    delayed: {
        name: 'Delayed Initialization',
        config: {
            delayedInitialization: {
                enable: true,
                region: 'DEV',
                featureSet: {
                    enableOptimove: true,
                    enableOptimobile: true
                }
            },
            inAppConsentStrategy: 'explicit-by-user',
            android: {
                pushNotificationIconName: 'ic_notification'
            }
        }
    },
    minimal: {
        name: 'Minimal Configuration',
        config: {
            optimoveCredentials: 'TEST_OPTIMOVE_CREDENTIALS',
            inAppConsentStrategy: 'in-app-disabled'
        }
    }
};

// Set up paths
const repoRoot = __dirname;
const exampleAppDir = path.join(repoRoot, 'ExampleApp');
const cordovaSdkDir = path.join(repoRoot, 'cordova-sdk');
const testOutputDir = path.join(repoRoot, '.test-output');
const androidValuesDir = path.join(testOutputDir, 'platforms', 'android', 'app', 'src', 'main', 'res', 'values');
const iosPlistPath = path.join(testOutputDir, 'optimove.plist');

// Test results tracking
const results = {
    android: {
        tested: false,
        success: false,
        configs: {}
    },
    ios: {
        tested: false,
        success: false,
        configs: {}
    }
};

// Verbose logging
function log(...args) {
    if (verbose) {
        console.log(...args);
    }
}

// Clean up function
function cleanup() {
    if (fs.existsSync(testOutputDir)) {
        console.log(`Cleaning up test directory: ${testOutputDir}`);
        try {
            fs.rmSync(testOutputDir, { recursive: true, force: true });
            console.log('Cleanup successful');
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    } else {
        console.log('No test directory to clean up');
    }
}

// If clean only, just clean and exit
if (cleanOnly) {
    cleanup();
    process.exit(0);
}

console.log('Starting Optimove config validation test...');
console.log(`Testing platforms: ${testAndroid ? 'Android' : ''}${testAndroid && testIOS ? ' and ' : ''}${testIOS ? 'iOS' : ''}`);

// Android XML generation test
function testAndroidConfig(configName, configData) {
    console.log(`\n=== Testing Android config: ${configName} ===`);

    // Prepare test directory
    fs.mkdirSync(androidValuesDir, { recursive: true });

    // Copy config.xml
    const configXmlSource = path.join(exampleAppDir, 'config.xml');
    const configXmlDest = path.join(testOutputDir, 'config.xml');
    fs.copyFileSync(configXmlSource, configXmlDest);

    // Get package ID and create Java dir structure
    const packageId = parsePackageId(configXmlDest);
    const packagePath = packageId.replace(/\./g, '/');
    const javaDir = path.join(testOutputDir, 'platforms', 'android', 'app', 'src', 'main', 'java', packagePath);
    fs.mkdirSync(javaDir, { recursive: true });

    // Write optimove.json
    const optimoveJsonPath = path.join(testOutputDir, 'optimove.json');
    fs.writeFileSync(optimoveJsonPath, JSON.stringify(configData, null, 2));
    log(`Created optimove.json with config: ${configName}`);

    // Create and run the Android XML generator script
    const generatorPath = path.join(testOutputDir, 'android-generator.js');
    fs.writeFileSync(generatorPath, createAndroidGeneratorScript(optimoveJsonPath, androidValuesDir));

    try {
        execSync(`node "${generatorPath}"`, { stdio: verbose ? 'inherit' : 'pipe' });

        // Check if XML was created
        const xmlPath = path.join(androidValuesDir, 'optimove.xml');
        if (fs.existsSync(xmlPath)) {
            console.log(`✅ SUCCESS: Android XML created for config: ${configName}`);
            if (verbose) {
                console.log('XML content:');
                console.log(fs.readFileSync(xmlPath, 'utf8'));
            }
            results.android.configs[configName] = true;
            return true;
        } else {
            console.error(`❌ ERROR: Android XML not created for config: ${configName}`);
            results.android.configs[configName] = false;
            return false;
        }
    } catch (error) {
        console.error(`❌ ERROR: Failed to generate Android XML for config: ${configName}`);
        if (verbose) console.error(error);
        results.android.configs[configName] = false;
        return false;
    }
}

// iOS plist generation test
function testIOSConfig(configName, configData) {
    console.log(`\n=== Testing iOS config: ${configName} ===`);

    // Prepare test directory
    fs.mkdirSync(path.dirname(iosPlistPath), { recursive: true });

    // Write optimove.json
    const optimoveJsonPath = path.join(testOutputDir, 'optimove.json');
    fs.writeFileSync(optimoveJsonPath, JSON.stringify(configData, null, 2));
    log(`Created optimove.json with config: ${configName}`);

    // Create and run the iOS plist generator script
    const generatorPath = path.join(testOutputDir, 'ios-generator.js');
    fs.writeFileSync(generatorPath, createIOSGeneratorScript(optimoveJsonPath, iosPlistPath));

    try {
        execSync(`node "${generatorPath}"`, { stdio: verbose ? 'inherit' : 'pipe' });

        // Check if plist was created
        if (fs.existsSync(iosPlistPath)) {
            console.log(`✅ SUCCESS: iOS plist created for config: ${configName}`);
            if (verbose) {
                console.log('Plist content:');
                console.log(fs.readFileSync(iosPlistPath, 'utf8'));
            }
            results.ios.configs[configName] = true;
            return true;
        } else {
            console.error(`❌ ERROR: iOS plist not created for config: ${configName}`);
            results.ios.configs[configName] = false;
            return false;
        }
    } catch (error) {
        console.error(`❌ ERROR: Failed to generate iOS plist for config: ${configName}`);
        if (verbose) console.error(error);
        results.ios.configs[configName] = false;
        return false;
    }
}

// Extract package ID from config.xml
function parsePackageId(configPath) {
    try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        const match = configContent.match(/widget\s+id="([^"]+)"/);
        return match ? match[1] : 'com.optimove.cordova.ExampleApp';
    } catch (error) {
        console.error('Error reading package ID from config.xml:', error);
        return 'com.optimove.cordova.ExampleApp';
    }
}

// Create script for Android XML generation
function createAndroidGeneratorScript(jsonPath, outputDir) {
    return `
const fs = require('fs');
const path = require('path');

// Function to read optimove.json and create Android XML
function generateAndroidXml() {
  const optimoveJsonPath = '${jsonPath.replace(/\\/g, '\\\\')}';
  const outputDir = '${outputDir.replace(/\\/g, '\\\\')}';
  const xmlOutputPath = path.join(outputDir, 'optimove.xml');
  
  // Read optimove.json
  let config;
  try {
    const jsonContent = fs.readFileSync(optimoveJsonPath, 'utf8');
    config = JSON.parse(jsonContent);
  } catch (error) {
    console.error('Error reading optimove.json:', error);
    process.exit(1);
  }
  
  // Create XML content
  const xmlEntries = [];
  
  // Add string resources
  
  // optimoveCredentials
  if (config.optimoveCredentials) {
    xmlEntries.push(\`  <string name="optimoveCredentials">\${config.optimoveCredentials}</string>\`);
  }
  
  // optimoveMobileCredentials
  if (config.optimoveMobileCredentials) {
    xmlEntries.push(\`  <string name="optimoveMobileCredentials">\${config.optimoveMobileCredentials}</string>\`);
  }
  
  // inAppConsentStrategy
  if (config.inAppConsentStrategy) {
    xmlEntries.push(\`  <string name="optimoveInAppConsentStrategy">\${config.inAppConsentStrategy}</string>\`);
  }
  
  // Android-specific: pushNotificationIconName
  if (config.android && config.android.pushNotificationIconName) {
    xmlEntries.push(\`  <string name="android.pushNotificationIconName">\${config.android.pushNotificationIconName}</string>\`);
  }
  
  // enableDeferredDeepLinking
  if (config.enableDeferredDeepLinking !== undefined) {
    xmlEntries.push(\`  <string name="optimoveEnableDeferredDeepLinking">\${config.enableDeferredDeepLinking}</string>\`);
  }
  
  // Delayed initialization
  if (config.delayedInitialization) {
    // Enable flag
    if (config.delayedInitialization.enable !== undefined) {
      xmlEntries.push(\`  <string name="delayedInitialization.enable">\${config.delayedInitialization.enable}</string>\`);
    }
    
    // Region
    if (config.delayedInitialization.region) {
      xmlEntries.push(\`  <string name="delayedInitialization.region">\${config.delayedInitialization.region}</string>\`);
    }
    
    // Feature set
    if (config.delayedInitialization.featureSet) {
      if (config.delayedInitialization.featureSet.enableOptimove !== undefined) {
        xmlEntries.push(\`  <string name="delayedInitialization.featureSet.enableOptimove">\${config.delayedInitialization.featureSet.enableOptimove}</string>\`);
      }
      
      if (config.delayedInitialization.featureSet.enableOptimobile !== undefined) {
        xmlEntries.push(\`  <string name="delayedInitialization.featureSet.enableOptimobile">\${config.delayedInitialization.featureSet.enableOptimobile}</string>\`);
      }
    }
  }
  
  // Create XML document
  const xmlContent = \`<?xml version="1.0" encoding="utf-8"?>
<resources>
\${xmlEntries.join('\\n')}
</resources>\`;
  
  // Write XML file
  try {
    fs.writeFileSync(xmlOutputPath, xmlContent);
    console.log('Successfully created Android XML file');
    return true;
  } catch (error) {
    console.error('Error writing XML file:', error);
    return false;
  }
}

// Execute
try {
  const result = generateAndroidXml();
  process.exit(result ? 0 : 1);
} catch (error) {
  console.error('Unexpected error in XML generation:', error);
  process.exit(1);
}
  `;
}

// Create script for iOS plist generation
function createIOSGeneratorScript(jsonPath, plistPath) {
    return `
const fs = require('fs');
const path = require('path');

// Function to read optimove.json and create iOS plist
function generateIOSPlist() {
  const optimoveJsonPath = '${jsonPath.replace(/\\/g, '\\\\')}';
  const plistOutputPath = '${plistPath.replace(/\\/g, '\\\\')}';
  
  // Read optimove.json
  let config;
  try {
    const jsonContent = fs.readFileSync(optimoveJsonPath, 'utf8');
    config = JSON.parse(jsonContent);
    console.log('Successfully read optimove.json');
  } catch (error) {
    console.error('Error reading optimove.json:', error);
    process.exit(1);
  }
  
  // Create plist content based on optimove.json
  const plistEntries = [];
  
  // Add credentials
  if (config.optimoveCredentials) {
    plistEntries.push('<key>optimoveCredentials</key>');
    plistEntries.push('<string>' + config.optimoveCredentials + '</string>');
  }
  
  if (config.optimoveMobileCredentials) {
    plistEntries.push('<key>optimoveMobileCredentials</key>');
    plistEntries.push('<string>' + config.optimoveMobileCredentials + '</string>');
  }
  
  // Add inAppConsentStrategy if defined
  if (config.inAppConsentStrategy) {
    plistEntries.push('<key>optimoveInAppConsentStrategy</key>');
    plistEntries.push('<string>' + config.inAppConsentStrategy + '</string>');
  }
  
  // Add enableDeferredDeepLinking if defined
  if (config.enableDeferredDeepLinking !== undefined) {
    plistEntries.push('<key>optimoveEnableDeferredDeepLinking</key>');
    plistEntries.push(config.enableDeferredDeepLinking ? '<true/>' : '<false/>');
  }
  
  // Add cname if defined
  if (config.cname) {
    plistEntries.push('<key>optimoveDdlCname</key>');
    plistEntries.push('<string>' + config.cname + '</string>');
  }
  
  // Add delayedInitialization if defined
  if (config.delayedInitialization) {
    if (config.delayedInitialization.enable !== undefined) {
      plistEntries.push('<key>delayedInitialization.enable</key>');
      plistEntries.push(config.delayedInitialization.enable ? '<true/>' : '<false/>');
    }
    
    if (config.delayedInitialization.region) {
      plistEntries.push('<key>delayedInitialization.region</key>');
      plistEntries.push('<string>' + config.delayedInitialization.region + '</string>');
    }
    
    if (config.delayedInitialization.featureSet) {
      const featureSet = config.delayedInitialization.featureSet;
      
      if (featureSet.enableOptimove !== undefined) {
        plistEntries.push('<key>delayedInitialization.featureSet.enableOptimove</key>');
        plistEntries.push(featureSet.enableOptimove ? '<true/>' : '<false/>');
      }
      
      if (featureSet.enableOptimobile !== undefined) {
        plistEntries.push('<key>delayedInitialization.featureSet.enableOptimobile</key>');
        plistEntries.push(featureSet.enableOptimobile ? '<true/>' : '<false/>');
      }
    }
  }
  
  // Create plist content
  const plistContent = \`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  \${plistEntries.join('\\n  ')}
</dict>
</plist>\`;
  
  // Write plist file
  try {
    fs.writeFileSync(plistOutputPath, plistContent);
    console.log('Successfully created optimove.plist');
    return true;
  } catch (error) {
    console.error('Error writing plist file:', error);
    return false;
  }
}

// Execute
try {
  const result = generateIOSPlist();
  process.exit(result ? 0 : 1);
} catch (error) {
  console.error('Unexpected error in plist generation:', error);
  process.exit(1);
}
  `;
}

// Run tests for each platform and configuration
async function runTests() {
    // Create fresh test directory
    if (fs.existsSync(testOutputDir)) {
        fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testOutputDir);

    // Test each configuration for Android
    if (testAndroid) {
        results.android.tested = true;
        let allAndroidSuccess = true;

        for (const [configKey, configData] of Object.entries(TEST_CONFIGS)) {
            const success = testAndroidConfig(configData.name, configData.config);
            allAndroidSuccess = allAndroidSuccess && success;

            // Clean up between tests
            fs.rmSync(path.join(testOutputDir, 'optimove.json'), { force: true });
            fs.rmSync(androidValuesDir, { recursive: true, force: true });
            fs.mkdirSync(androidValuesDir, { recursive: true });
        }

        results.android.success = allAndroidSuccess;
    }

    // Test each configuration for iOS
    if (testIOS) {
        results.ios.tested = true;
        let allIOSSuccess = true;

        for (const [configKey, configData] of Object.entries(TEST_CONFIGS)) {
            const success = testIOSConfig(configData.name, configData.config);
            allIOSSuccess = allIOSSuccess && success;

            // Clean up between tests
            fs.rmSync(path.join(testOutputDir, 'optimove.json'), { force: true });
            fs.rmSync(iosPlistPath, { force: true });
        }

        results.ios.success = allIOSSuccess;
    }

    // Print summary
    console.log('\n==========================================');
    console.log('       OPTIMOVE CONFIG TEST RESULTS       ');
    console.log('==========================================');

    if (results.android.tested) {
        console.log('\nANDROID RESULTS:');
        console.log(results.android.success ? '✅ PASSED' : '❌ FAILED');

        Object.entries(results.android.configs).forEach(([name, success]) => {
            console.log(`  ${success ? '✅' : '❌'} ${name}`);
        });
    }

    if (results.ios.tested) {
        console.log('\niOS RESULTS:');
        console.log(results.ios.success ? '✅ PASSED' : '❌ FAILED');

        Object.entries(results.ios.configs).forEach(([name, success]) => {
            console.log(`  ${success ? '✅' : '❌'} ${name}`);
        });
    }

    console.log('\n==========================================');

    // Clean up unless skipped
    if (!skipCleanup) {
        cleanup();
    }

    // Return overall success/failure
    const overallSuccess =
        (!results.android.tested || results.android.success) &&
        (!results.ios.tested || results.ios.success);

    return overallSuccess;
}

// Run the tests and exit with appropriate code
runTests().then(success => {
    process.exit(success ? 0 : 1);
});