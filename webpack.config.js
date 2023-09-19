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

let customRules = [
	rules.copyImages,
	rules.loadHTMLAndReplaceMateriaScripts,
	rules.loadAndPrefixCSS,
	rules.loadAndPrefixSASS,
];

// options for the build
let options = {
	entries: entries,
	moduleRules: customRules,
};

module.exports = widgetWebpack.getLegacyWidgetBuildConfig(options);;
