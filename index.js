const debug = require('./PrettyDebugJS.js');

var testVar = {
	name : 'shadly',
	age : 16
}

function test(){
	debug.info('Test ' + JSON.stringify(testVar));
}

test();