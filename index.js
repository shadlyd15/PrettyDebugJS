var net = require('net');

console.time('someFunction');
const debug = require('./PrettyDebugJS.js');
const mid = require('./middle.js');

debug.attachStream(process.stdout);

function test(){
	mid.loga(10, 10);
}

test();

debug.scheduleHealthCheck(()=>{
	debug.sysMemoryUsage();
	debug.nodeMemoryUsage();
}, .01);

var HOST = '0.0.0.0';
var PORT = 6969;

net.createServer(function(sock) {
	sock.on('end', function() {
		debug.detachStream(sock);
	});
	console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);  
	// sock.write('Hello');
	debug.attachStream(sock);

}).listen(PORT, HOST);
