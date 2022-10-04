# ***********  Generating d.ts and js (plugin) ***********

1. Optimove is set as a global object on window by `plugin.xml`.
2. Types come from `plugins/index.d.ts`. This file is generated manually by combining interfaces from `plugins/src/core/declarations`. We cannot use generated declarations directly because they contain `import/export` and, thus, are not ambient. We don't want to import cordova plugin as a module because cordova projects dont support module imports out of the box.
3. `index.d.ts` declares a constant `declare const Optimove: Optimove;`. This is available in typescript apps as ambient declaration. In javascript apps VScode is also able to give suggestions because `index.d.ts` is in the root directory of the plugin.
4. To generate minified js bundle and type declarations do `cd plugins` and `npm run build`. If you updated interfaces copy generated interfaces into `plugins/index.d.ts`.



