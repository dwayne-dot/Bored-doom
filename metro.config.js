// Metro = the bundler that packs the app for Expo Go.
// We add "html" so the interactive prototype can be shipped as an asset.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
if (!config.resolver.assetExts.includes('html')) config.resolver.assetExts.push('html');

// three >= 0.187's CommonJS entry (three.cjs) calls process.emitWarning, which
// doesn't exist in React Native and crashes the 3D room on load. Always resolve
// "three" to its ES module build instead (also guarantees a single copy).
const threeModule = path.resolve(__dirname, 'node_modules/three/build/three.module.js');
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'three') return { type: 'sourceFile', filePath: threeModule };
  return (defaultResolve ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
