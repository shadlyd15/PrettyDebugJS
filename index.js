var net = require('net');

console.time('someFunction');
const debug = require('./PrettyDebugJS.js');
const mid = require('./middle.js');

debug.setStream(process.stdout);

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
	// We have a connection - a socket object is assigned to the connection automatically
	console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);  
	// sock.write('Hello');
	debug.setStream(sock);

}).listen(PORT, HOST);
