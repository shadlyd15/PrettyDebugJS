
# Example

## multiple-stream.js
In this example a debug instance is created. To demonstrate multiple stream, a TCP server is created. Then the TCP socket is attached as a stream instance to the debug module. So when a client connects to that TCP server, debug output will also be shown on the client console. Health check scheduler is also demonstrated in this example. 

```javascript
const net 	= require('net');
const debug = require('./PrettyDebugJS.js');

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

debug.info('Hello Pretty World');

debug.scheduleHealthCheck(function(){
	debug.memoryWatermark();
	debug.sysMemoryMonitor();
	debug.nodeMemoryMonitor({
			heapTotal: { upperLimit : 5 }
		}, function(){
			debug.critical('Memory Usage Alarm : Total heap usage is above 5 MB');
			// Do other things like send email!
		});
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
}, 666)
```
## Sample Output

<div><img src ="https://raw.githubusercontent.com/shadlyd15/PrettyDebugJS/master/images/screenshot.png" style='width:100%;' border="0" alt ="Sample Output"/></div>

## Run Example
To the above example simply put this command
```sh
$ node basic.js
```
