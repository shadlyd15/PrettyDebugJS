

<!-- <div><img src ="img/pretty-logo.svg" style='width:25%;' border="0" alt ="Sample Output"/></div> -->

[![logo](https://shadlyd15.github.io/PrettyDebugJS/img/pretty-logo.svg)](#)

[![npm package](https://nodei.co/npm/pretty-debug.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/pretty-debug)

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](#)
[![forthebadge](https://forthebadge.com/images/badges/powered-by-responsibility.svg)](#)

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#Intro)


## Intro
A **highly configurable & lightweight debug library** that prints debug messages beautifully. It works in Node.js and Web browser environments with very low memory footprint. 

## Features
- Beautifully colored and formatted output texts
- Pretty prints current file name, function and line number
- Pretty prints date, time with timezone and formatting
- Attach multiple streams and pipe the debug outputs
- Compatible with Node.js stream objects
- Node process and System process memory monitor
- Schedule health check
- Alarm on crossing memory usage thresholds
- System memory high watermark
- Highly configurable
- Very low memory footprint
- No third party library dependency

## Screenshot

<div><img src ="https://raw.githubusercontent.com/shadlyd15/PrettyDebugJS/gh-pages/img/screenshot.png" style='width:100%;' border="0" alt ="Sample Output"/></div>

## Install
```sh
$ npm install pretty-debug
```

## Usage

Pretty Debug exposes a debug object. Just attach any stream you want to the module to pipe debug messages. process.stdout is the default steam which prints output to console. Any other streams like TCP socket or request to an HTTP server can be attached on runtime to pipe the debug output.

## API Documentation

* [pretty-debug](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html)
    * [.color](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.color) : <code>Object.&lt;string&gt;</code>
    * [.setOptions(userOptions)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.setOptions)
    * [.generatePolicy(lowerLimit, upperLimit)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.generatePolicy) ⇒ <code>Object.&lt;policy&gt;</code>
    * [.attachStream(stream)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.attachStream)
    * [.detachStream(stream)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.detachStream)
    * [.log(...var_args)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.log)
    * [.info(...var_args)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.info)
    * [.alert(...var_args)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.alert)
    * [.warn(...var_args)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.warn)
    * [.error(...var_args)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.error)
    * [.critical(...var_args)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.critical)
    * [.nodeMemoryMonitor(stream, callback)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.nodeMemoryMonitor)
    * [.sysMemoryMonitor(alarmPolicy, callback)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.sysMemoryMonitor)
    * [.memoryWatermark()](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.memoryWatermark)
    * [.scheduleHealthCheck(inputFunc, timeInMinutes)](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html#.scheduleHealthCheck)

For detail information, please see [API Documentation.](https://shadlyd15.github.io/PrettyDebugJS/module-pretty-debug.html)

<!-- 
### Show/Hide Section

### Change Section Color
Let's say we want to change the color of **Timestamp** to Green and hide the File Name section. 
 -->

## Basic usage

- **Create debug instance :**
	```javascript
	const debug = require('pretty-debug');
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

- **Attach stream :**
	```javascript
	debug.attachStream(sock); 	// Attaching new stream to serve debug messages
	```
- **Detach stream :**
	```javascript
	debug.detachStream(sock); 	// Detaching stream
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
	debug.memoryWatermark();	// Shows highest RAM usage in MB.
	```
- **Show memory used by OS :**
	```javascript
	debug.sysMemoryMonitor();	// Shows memory information of operating system
	```
- **Show memory used by Node.js :**
	```javascript
	debug.nodeMemoryMonitor(();	// Shows memory information of Node.js system
	```
- **Set alarm policy for RAM usage :**
	```javascript
	debug.nodeMemoryMonitor({
		heapTotal: { upperLimit : 5 } // Trigger alarm when heap usage is greater than 5 MB
	}, function(){
		debug.critical('Memory Usage Alarm : Total heap usage is above 5 MB');
		// Do other things like send email!
	});
	```


## Example
In this example a debug instance is created. For multiple stream demonstration, a TCP server is created. TCP socket is attached to the debug module. So when a client connects to that TCP server, color debug output will be shown on the client console. Health check scheduler is also demonstrated in this example. 

```javascript
const net = require('net');
const debug = require('pretty-debug');

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
}, 678)
```

## Run Example
To run the example above, simply put this command and press Enter!
```sh
$ node Examples/example.js
```

## Sample Output
<div><img src ="https://raw.githubusercontent.com/shadlyd15/PrettyDebugJS/gh-pages/img/screenshot.png" style='width:100%;' border="0" alt ="Sample Output"/></div>

## Tutorials
All the tutorials and examples can be found in the link below :
-   [How To Use](https://shadlyd15.github.io/PrettyDebugJS/tutorial-0.%20How%20To%20Use.html)
-   [Basics](https://shadlyd15.github.io/PrettyDebugJS/tutorial-1.%20Basics.html)
-   [Memory Monitor](https://shadlyd15.github.io/PrettyDebugJS/tutorial-2.%20Memory%20Monitor.html)
-   [Shedule Healthcheck](https://shadlyd15.github.io/PrettyDebugJS/tutorial-3.%20Shedule%20Healthcheck.html)
-   [Set Alarm](https://shadlyd15.github.io/PrettyDebugJS/tutorial-4.%20Set%20Alarm.html)
-   [Set Options](https://shadlyd15.github.io/PrettyDebugJS/tutorial-5.%20Set%20Options.html)
-   [Attach Multiple Stream](https://shadlyd15.github.io/PrettyDebugJS/tutorial-6.%20Attach%20Multiple%20Stream.html)
-   [Send Email On Alarm](https://shadlyd15.github.io/PrettyDebugJS/tutorial-8.%20Send%20Email%20On%20Alarm.html)
-   [Summary](https://shadlyd15.github.io/PrettyDebugJS/tutorial-7.%20Summary.html)

## Customization
As it was mentioned earlier, this library is highly configurable.
For more details, please see [Default Options.](https://shadlyd15.github.io/PrettyDebugJS/module-defaultOptions.html)


## Contributing
If you are interested in requesting a feature, fixing issues and contributing directly to the code base, please do not hesitate.

## License
Licensed under the [MIT](LICENSE) License.
