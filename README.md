
# Pretty Debug JavaScript
A **highly configurable & lightweight debug library** that prints debug messages beautifully. It works in Node.js and Web browser environments with very low memory footprint. 

<div><img src ="https://raw.githubusercontent.com/shadlyd15/PrettyDebugJS/master/images/screenshot.png" style='width:100%;' border="0" alt ="Sample Output"/></div>

## Features
- Highly configurable
- Very low memory footprint
- Beautifully colored and formatted
- Attach multiple streams on runtime and pipe output
- Node process and System process health check
- Alarm on crossing memory thresholds
- Monitor system memory high watermark
- No third party library dependencies

## Install
```sh
npm install pretty-debug
```

## Usage

Pretty Debug exposes a debug object. Just attach any stream you want to the module to pipe debug messages. process.stdout is the default steam which prints output to console. Any other streams like TCP socket or request to an HTTP server can be attached on runtime to pipe the debug output.

## API Documention

```javascript
	const debug = require('./PrettyDebugJS.js');
```

## Customization
As it was mentioned earlier, this library is highly configurable. 
### Show/Hide Section

### Change Section Color
Let's say we want to change the color of **Timestamp** to Green and hide the File Name section. 


## Example
In this example a debug instance is created. For multiple stream demonstration, a TCP server is created. TCP socket is attached to the debug module. So when a client connects to that TCP server, color debug output will be shown on the client console. Health check scheduler is also demonstrated in this example. 

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
node example.js
```
