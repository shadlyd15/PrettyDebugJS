
# Pretty Debug JS
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
$ npm install pretty-debug
```

## Usage

Pretty Debug exposes a debug object. Just attach any stream you want to the module to pipe debug messages. process.stdout is the default steam which prints output to console. Any other streams like TCP socket or request to an HTTP server can be attached on runtime to pipe the debug output.

## API

* [pretty-debug](module-pretty-debug.html#module_pretty-debug)
    * [.color](module-pretty-debug.html#module_pretty-debug.color) : <code>Object.&lt;string&gt;</code>
    * [.setOptions(userOptions)](#module_pretty-debug.setOptions) - Overwrites default options and debug text formats
    * [.generatePolicy(lowerLimit, upperLimit)](module-pretty-debug.html#module_pretty-debug.generatePolicy) ⇒ <code>Object.&lt;policy&gt;</code>
    * [.attachStream(stream)](module-pretty-debug.html#module_pretty-debug.attachStream)
    * [.detachStream(stream)](module-pretty-debug.html#module_pretty-debug.detachStream)
    * [.log(...var_args)](module-pretty-debug.html#module_pretty-debug.log)
    * [.info(...var_args)](module-pretty-debug.html#module_pretty-debug.info)
    * [.alert(...var_args)](module-pretty-debug.html#module_pretty-debug.alert)
    * [.warn(...var_args)](module-pretty-debug.html#module_pretty-debug.warn)
    * [.error(...var_args)](module-pretty-debug.html#module_pretty-debug.error)
    * [.critical(...var_args)](module-pretty-debug.html#module_pretty-debug.critical)
    * [.nodeMemoryMonitor(stream, callback)](module-pretty-debug.html#module_pretty-debug.nodeMemoryMonitor)
    * [.sysMemoryMonitor(alarmPolicy, callback)](module-pretty-debug.html#module_pretty-debug.sysMemoryMonitor)
    * [.memoryWatermark()](module-pretty-debug.html#module_pretty-debug.memoryWatermark)
    * [.scheduleHealthCheck(inputFunc, timeInMinutes)](module-pretty-debug.html#module_pretty-debug.scheduleHealthCheck)

**For detail information, please see [API Documentation.](module-pretty-debug.html#module_pretty-debug)**

<!-- ## Customization
As it was mentioned earlier, this library is highly configurable. 
### Show/Hide Section

### Change Section Color
Let's say we want to change the color of **Timestamp** to Green and hide the File Name section. 
 -->

## Basic usage

- **Create debug instance :**
	```javascript
	const debug = require('./PrettyDebugJS.js');
	```
<a name="module_pretty-debug.setOptions"></a>
- **Set options :**
	```javascript
	debug.setOptions({ 
		enable: true,		// Turning on debug print
		enableColor: true,	// Enabling color output
		enableGC: true,		// Enabling autometic gerbage collection
		debugLevel: 6, 		// Setting debug level 6 (Upto INFO)
		}  
	});
	```

- **Attach stream :**
	```javascript
	debug.attachStream(sock); 	// Attaching new stream to serve debug messages
	```
- **Detach stream :**
	```javascript
	debug.detachStream(sock); 	// Detaching stream
	```
- **Set options :**
	```javascript
	debug.setOptions({ 
		enable: true,		// Turning on debug print
		enableColor: true,	// Enabling color output
		enableGC: true,		// Enabling autometic gerbage collection
		debugLevel: 6, 		// Setting debug level 6 (Upto INFO)
		}  
	});
	```
- **Print in different debug levels :**
	```javascript
	debug.log('The quick brown fox jumps over the lazy dog');
	debug.info('The quick brown fox jumps over the lazy dog');
	debug.alert('The quick brown fox jumps over the lazy dog');
	debug.warn('The quick brown fox jumps over the lazy dog');
	debug.error('The quick brown fox jumps over the lazy dog');
	debug.critical('The quick brown fox jumps over the lazy dog');
	```
- **Show highest RAM usage :**
	```javascript
	debug.memoryWatermark();
	```
- **Show memory used by OS :**
	```javascript
	debug.sysMemoryMonitor();
	```
- **Show memory used by Node.js :**
	```javascript
	debug.nodeMemoryMonitor(();
	```
- **Set alarm policy for RAM usage :**
	```javascript
	debug.nodeMemoryMonitor({
		heapTotal: { upperLimit : 5 }
	}, function(){
		debug.critical('Memory Usage Alarm : Total heap usage is above 5 MB');
		// Do other things like send email!
	});
	```


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
$ node example.js
```
