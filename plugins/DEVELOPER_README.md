# ***********  Generating d.ts and js (plugin) ***********

1. In the ExampleApp we `declare var Optimove: Optimove;`.
2. Optimove is set as a global object on window by `plugin.xml`.
3. Types come from `plugins/src/core/declarations/ambient/interfaces.d.ts`. This file is generated manually by combining interfaces from `plugins/src/core/declarations/module`. We cannot use generated declarations directly because they contain `import/export` and, thus, are not ambient. We don't want to import cordova plugin as a module because cordova projects dont support module imports out of the box.
4. To generate minified js bundle and type declarations do `cd plugins; npm run build`. If you updated interfaces copy generated interfaces into `interfaces.d.ts`.



