/**
 * @fileOverview Attach Multiple Stream Example
 * @author Shadly Salahuddin
 * @link mailto:shadlyd15@gmail.com
 * @version 2.0.1
 */

const net = require('net');
const debug = require('.././PrettyDebugJS.js');

var PORT = 6969;
var HOST = '0.0.0.0';

debug.setOptions({
	nodeMemoryMonitor:{
		fields: {
			rss: false,
			external: false
		}
	}
});

debug.info('Example : Attach Multiple Stream');

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
}, 678)