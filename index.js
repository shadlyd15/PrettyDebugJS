const util = require('util');

console.time('someFunction');
const debug = require('./PrettyDebugJS.js');
const mid = require('./middle.js');

debug.serStream();

function test(){
	mid.loga(10, 10);
}

test();
console.timeEnd('someFunction');

// process.stdout.write("Hello debug\n");

// debug.scheduleHealthCheck(()=>{
// 	debug.sysMemoryUsage();
// 	debug.nodeMemoryUsage();
// }, .01);

