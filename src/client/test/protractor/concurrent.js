//Concurrent Browsers, Firefox and Chrome 
exports.config = {
	multiCapabilities: [{
		browserName: 'chrome',
	},
	{
		browserName:'firefox'
	}],
	seleniumAddress: 'http://localhost:4444/wd/hub', 
	specs: ['spec.js'],
	allScriptsTimeout: 100000,
}