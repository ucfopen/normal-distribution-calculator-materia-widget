const path = require('path');

const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const rules = widgetWebpack.getDefaultRules()
const entries = widgetWebpack.getDefaultEntries();

// cusomize the config
delete entries['creator.js'];
delete entries['creator.css'];
delete entries['player.js'];

entries['controllers/player.js'] = [path.join(__dirname, 'src', 'controllers', 'player.js')];

// All JS passed through Babel
babelJS = {
  test: /\.js$/i,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['env']
    }
  }
};

let customRules = [
	rules.copyImages,
	rules.loadHTMLAndReplaceMateriaScripts,
	rules.loadAndPrefixCSS,
	rules.loadAndPrefixSASS,
	babelJS, // <--- Babel loader for JS Files
];

// options for the build
let options = {
	entries: entries,
	moduleRules: customRules,
};

module.exports = widgetWebpack.getLegacyWidgetBuildConfig(options);;


