

# How to use

## Install
```sh
$ npm install pretty-debug
```

## Basic usage

- **Create debug instance :**
	```javascript
	const debug = require('./PrettyDebugJS.js');
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
