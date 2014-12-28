// conf.js
exports.config = {
	capabilities: {
		browserName: 'chrome',
		maxInstances: 1 
	},
	seleniumAddress: 'http://localhost:4444/wd/hub', 
	specs: ['farmer.js', 'populate-database.js'],
	allScriptsTimeout: 100000,

}