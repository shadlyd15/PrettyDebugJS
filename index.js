const net 	= require('net');
const mid 	= require('./middle.js');
const debug = require('./PrettyDebugJS.js');

var PORT = 6969;
var HOST = '0.0.0.0';

debug.info('This is a test application');

debug.scheduleHealthCheck(function(){
	debug.sysMemoryUsage();
	debug.nodeMemoryUsage();
}, .5);

net.createServer(function(sock){
	debug.attachStream(sock);
	sock.on('end', function() {
		debug.detachStream(sock);
	}); 
}).listen(PORT, HOST);

// (function test(){
// 	debug.info('Here debug context is test()');
// 	mid.loga(10, 10);
// })();

setInterval(function(){
	let UUID = Math.random().toString(36).substr(2, 40);
	if(Math.floor(Math.random() * Math.floor(9)) % 3){
		debug.info('Correct UUID : ' + UUID);
	} else{
		debug.error('Incorrect UUID : ' + UUID);
	}
}, 1111)