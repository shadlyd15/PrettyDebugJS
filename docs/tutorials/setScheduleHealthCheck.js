/**
 * @external
 * @fileOverview Set Schedule Healthcheck Example
 * @author Shadly Salahuddin
 * @link mailto:shadlyd15@gmail.com
 * @version 2.0.1
 */

const net = require('net');
const debug = require('.././PrettyDebugJS.js');

debug.info('Example : Set Schedule');

function healthcheck(){
	debug.memoryWatermark();
	debug.sysMemoryMonitor();
	debug.nodeMemoryMonitor();
}

debug.scheduleHealthCheck(healthcheck, 1);