const net 	= require('net');
const debug = require('./PrettyDebugJS.js');

var PORT = 6969;
var HOST = '0.0.0.0';

debug.setOptions({
	fileLocation:{
		// show: true,
		// color: debug.color.red
	}
});

debug.info('Hello Pretty World');

debug.scheduleHealthCheck(function(){
	debug.sysMemoryMonitor();
	debug.nodeMemoryMonitor({
			heapTotal: { upperLimit : 5 }
		}, function(){
			debug.critical('Chude Gese');
		});
	debug.memoryWatermark();
}, .02);

net.createServer(function(sock){
	debug.attachStream(sock);
	sock.on('end', function() {
		debug.detachStream(sock);
	}); 
}).listen(PORT, HOST);

function generateRandomLog(){
	debug.log('The quick brown fox jumps over the lazy dog');
	debug.info('The quick brown fox jumps over the lazy dog');
	debug.alert('The quick brown fox jumps over the lazy dog');
	debug.warn('The quick brown fox jumps over the lazy dog');
	debug.error('The quick brown fox jumps over the lazy dog');
	debug.critical('The quick brown fox jumps over the lazy dog');
}

setInterval(function(){
	generateRandomLog();
}, 511)