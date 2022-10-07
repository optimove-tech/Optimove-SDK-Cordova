### Description of Changes

(briefly outline the reason for changes, and describe what's been done)

### Breaking Changes

-   None

### Release Checklist

Prepare:

-   [ ] `cd cordova-sdk` and `npm run build` to produce minified artifacts
-   [ ] `cd ExampleApp` and `npm run build` to update `index.js`
-   [ ] Detail any breaking changes. Breaking changes require a new major version number
-   [ ] Update type declarations in `cordova-sdk/index.d.ts`

Bump versions in:

-   [ ] package.json
-   [ ] plugin.xml
-   [ ] src/ios/OptimoveSDKPlugin.swift
-   [ ] src/android/OptimoveInitProvider.java

Release:

-   [ ] Squash and merge to master
-   [ ] Delete branch once merged
-   [ ] Create tag from master matching chosen version
-   [ ] Fill out release notes
-   [ ] Run `npm publish`

Update wiki:

- [ ] https://github.com/optimove-tech/Optimove-SDK-Cordova/wiki

