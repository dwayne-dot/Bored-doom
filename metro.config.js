// Metro = the bundler that packs the app for Expo Go.
// We add "html" so the interactive prototype can be shipped as an asset.
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
if (!config.resolver.assetExts.includes('html')) config.resolver.assetExts.push('html');
module.exports = config;
