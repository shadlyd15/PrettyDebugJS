/**
 * @external
 * @fileOverview Set Alarm Example
 * @author Shadly Salahuddin
 * @link mailto:shadlyd15@gmail.com
 * @version 2.0.1
 */

const net = require('net');
const debug = require('.././PrettyDebugJS.js');

debug.info('Example : Set Alarm');

debug.scheduleHealthCheck(function(){
	debug.memoryWatermark();
	debug.sysMemoryMonitor();
	debug.nodeMemoryMonitor({
		heapTotal: { upperLimit : 5 }
	}, function(){
		debug.critical('Memory Usage Alarm : Total heap usage is above 5 MB');
		// Do other things like sending email!
	});
}, 1);
