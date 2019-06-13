var net = require('net');

console.time('someFunction');
const debug = require('./PrettyDebugJS.js');
const mid = require('./middle.js');

debug.attachStream(process.stdout);
debug.info('This is a test application');
function test(){
	debug.info('In test');
	mid.loga(10, 10);
}

test();

debug.scheduleHealthCheck(function(){
	debug.sysMemoryUsage();
	debug.nodeMemoryUsage();
}, .01);

var HOST = '0.0.0.0';
var PORT = 6969;

net.createServer(function(sock){
	debug.attachStream(sock);
	sock.on('end', function() {
		debug.detachStream(sock);
	}); 
}).listen(PORT, HOST);
