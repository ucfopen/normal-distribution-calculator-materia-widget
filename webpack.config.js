const path = require('path');
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')
const rules = widgetWebpack.getDefaultRules()
const entries = widgetWebpack.getDefaultEntries();

// remove some default entries
delete entries['creator.js'];
delete entries['creator.css'];
delete entries['player.js'];

// add our player controller
entries['player.js'] = [path.join(__dirname, 'src', 'player.js')];

// All JS passed through Babel
babelJS = {
  test: /\.js$/i,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader' // note: using .babelrc for presets
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
