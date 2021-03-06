/**
 * @external
 * @fileOverview Set Options Example
 * @author Shadly Salahuddin
 * @link mailto:shadlyd15@gmail.com
 * @version 2.0.1
 */

const net = require('net');
const debug = require('.././PrettyDebugJS.js');

debug.setOptions({
	debugLevel: 2,
	funcName:{
		show: false
	},
	dateTime:{
		format: {
			month: "short"
		}
	},
});

debug.info('Example : Set Options');

function test(){
	debug.log('The is level 1 : LOG');
	debug.info('The is level 2 : INFO');
	debug.alert('The is level 3 : ALERT');
	debug.warn('The is level 4 : WARN');
	debug.error('The is level 5 : ERROR');
	debug.critical('The is level 6 : CRITICAL');
}

test();