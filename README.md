# Pretty Debug JavaScript
A **lightweight debug library** that prints debug messages beautifully. It works in Node.js and Web browsers with very low memory footprint. 

<div style="text-align:center"><img src ="https://raw.githubusercontent.com/shadlyd15/PrettyDebugJS/master/images/prettyDebug.png" alt ="Sample Output"/></div>

## Features
- Very low memory footprint
- Beautifully colored and formatted
- Attach different streams on runtime
- Node process and System process health check
- No third party library dependencies

## TODO
- Implement memory high watermark
- Serve debug log as html

## Install
```bash
npm install prettyDebugJs
```

## Usage

Pretty Debug exposes a debug object. Just attach any stream you want to the module to pipe debug messages. process.stdout is the default steam which prints output to console. Any other stream like TCP socket or request to an HTTP server can be attached on runtime to pipe the debug output. 

## Example
In this example a debug instance is created. For multiple stream demonstration, a TCP server is created. TCP socket is attached to the debug module. So when a client connects to that TCP server, color debug output will be shown on the client console. Health check scheduler is also demonstrated in this example. 
```javascript
const net 	= require('net');
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
```
## Sample Output

<div style="text-align:center"><img src ="https://raw.githubusercontent.com/shadlyd15/PrettyDebugJS/master/images/prettyDebug.png" alt ="Sample Output"/></div>

## Run Example
To the above example simply put this command
```bash
ENABLE_DEBUG=1 node example.js
```
## Environment Variable
```bash
ENABLE_DEBUG : To enable/disable debug print
```
```bash
DISABLE_DEBUG_COLOR : To enable/disable debug color
```
