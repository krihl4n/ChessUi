const { preprocessTypescript } = require('@nrwl/cypress/plugins/preprocessor');
const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');

module.exports = (on, config) => {
  // we register our plugin using its register method:
  addMatchImageSnapshotPlugin(on, config);

  on('file:preprocessor', preprocessTypescript(config));

  // force color profile
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      launchOptions.args.push('--force-color-profile=srgb');
    }
  });
};