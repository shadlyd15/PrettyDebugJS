const net 	= require('net');
const debug = require('pretty-debug');

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

function generateRandomLog(){
	let UUID = Math.random().toString(36).substr(2, 40);
	if(Math.floor(Math.random() * Math.floor(9)) % 3){
		debug.info('Correct UUID : ' + UUID);
	} else{
		debug.error('Incorrect UUID : ' + UUID);
	}
}

setInterval(function(){
	generateRandomLog();
}, 1111)