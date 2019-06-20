<a name="module_pretty-debug"></a>

## pretty-debug
A highly configurable & lightweight debug library that prints debug messages beautifully. 
It works in Node.js and Web browser environments with very low memory footprint.


* [pretty-debug](#module_pretty-debug)
    * [.color](#module_pretty-debug.color) : <code>Object.&lt;string&gt;</code>
    * [.setOptions(userOptions)](#module_pretty-debug.setOptions)
    * [.generatePolicy(lowerLimit, upperLimit)](#module_pretty-debug.generatePolicy) ⇒ <code>Object.&lt;policy&gt;</code>
    * [.attachStream(stream)](#module_pretty-debug.attachStream)
    * [.detachStream(stream)](#module_pretty-debug.detachStream)
    * [.log(...var_args)](#module_pretty-debug.log)
    * [.info(...var_args)](#module_pretty-debug.info)
    * [.alert(...var_args)](#module_pretty-debug.alert)
    * [.warn(...var_args)](#module_pretty-debug.warn)
    * [.error(...var_args)](#module_pretty-debug.error)
    * [.critical(...var_args)](#module_pretty-debug.critical)
    * [.nodeMemoryMonitor(stream, callback)](#module_pretty-debug.nodeMemoryMonitor)
    * [.sysMemoryMonitor(alarmPolicy, callback)](#module_pretty-debug.sysMemoryMonitor)
    * [.memoryWatermark()](#module_pretty-debug.memoryWatermark)
    * [.scheduleHealthCheck(inputFunc, timeInMinutes)](#module_pretty-debug.scheduleHealthCheck)

<a name="module_pretty-debug.color"></a>

### pretty-debug.color : <code>Object.&lt;string&gt;</code>
**Kind**: static property of [<code>pretty-debug</code>](#module_pretty-debug)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| reset | <code>string</code> | Text Color Reset |
| black | <code>string</code> | Text Color Block |
| red | <code>string</code> | Text Color Red |
| green | <code>string</code> | Text Color Green |
| yellow | <code>string</code> | Text Color Yellow |
| blue | <code>string</code> | Text Color Blue |
| magenta | <code>string</code> | Text Color Magenta |
| cyan | <code>string</code> | Text Color Cyan |
| white | <code>string</code> | Text Color Cyan |
| bgBlack | <code>string</code> | Background Color Black |
| bgRed | <code>string</code> | Background Color Red |
| bgGreen | <code>string</code> | Background Color Green |
| bgYellow | <code>string</code> | Background Color Yellow |
| bgBlue | <code>string</code> | Background Color Blue |
| bgMagenta | <code>string</code> | Background Color Magenta |
| bgCyan | <code>string</code> | Background Color Cyan |
| bgWhite | <code>string</code> | Background Color White |

<a name="module_pretty-debug.setOptions"></a>

### pretty-debug.setOptions(userOptions)
Overwrites default options and debug text formats

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| userOptions | <code>Object.&lt;userOptions&gt;</code> | Options User specific options |

<a name="module_pretty-debug.generatePolicy"></a>

### pretty-debug.generatePolicy(lowerLimit, upperLimit) ⇒ <code>Object.&lt;policy&gt;</code>
Generates policy for different memory monitors

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| lowerLimit | <code>number</code> | Lower limit |
| upperLimit | <code>number</code> | Upper limit |

<a name="module_pretty-debug.attachStream"></a>

### pretty-debug.attachStream(stream)
Attaches stream to pipe debug output

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| stream | <code>Object.&lt;stream&gt;</code> | Stream to attach |

<a name="module_pretty-debug.detachStream"></a>

### pretty-debug.detachStream(stream)
Detaches stream from debug output

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| stream | <code>Object.&lt;stream&gt;</code> | Stream to detach |

<a name="module_pretty-debug.log"></a>

### pretty-debug.log(...var_args)
Prints log messages in level 6

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| ...var_args | <code>\*</code> | Variadic Argument |

**Example**  
```js
debug.log("Just a simple log message");
```
**Example**  
```js
const policy = { upperLimit : 70, lowerLimit : 20 };
debug.log(policy);
```
<a name="module_pretty-debug.info"></a>

### pretty-debug.info(...var_args)
Prints info messages in level 5

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| ...var_args | <code>\*</code> | Variadic Argument |

**Example**  
```js
debug.info("Here is an info message.");
```
**Example**  
```js
const birthTimestamp = { date : "15/12/1993", time : "12:05 AM" };
debug.info(birthTimestamp);
```
<a name="module_pretty-debug.alert"></a>

### pretty-debug.alert(...var_args)
Prints alert messages in level 4

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| ...var_args | <code>\*</code> | Variadic Argument |

**Example**  
```js
debug.alert("An alert message!");
```
**Example**  
```js
const birthTimestamp = { date : "15/12/1993", time : "12:05 AM" };
debug.alert(birthTimestamp);
```
<a name="module_pretty-debug.warn"></a>

### pretty-debug.warn(...var_args)
Prints warn messages in level 3

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| ...var_args | <code>\*</code> | Variadic Argument |

**Example**  
```js
debug.warn("This is your last warning.");
```
**Example**  
```js
const resource = { RAM : 10, CPU : 60 };
debug.warn(resource);
```
<a name="module_pretty-debug.error"></a>

### pretty-debug.error(...var_args)
Prints error messages in level 2

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| ...var_args | <code>\*</code> | Variadic Argument |

**Example**  
```js
debug.error("Error in recording server");
```
**Example**  
```js
const errorMessage = { message : "Some Error", errorCode : 4 };
debug.error(errorMessage);
```
<a name="module_pretty-debug.critical"></a>

### pretty-debug.critical(...var_args)
Prints critical messages in level 1

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| ...var_args | <code>\*</code> | Variadic Argument |

**Example**  
```js
debug.critical("API server critical error");
```
**Example**  
```js
const criticalMessage = { message : "Some Critical Error" };
debug.critical(criticalMessage);
```
<a name="module_pretty-debug.nodeMemoryMonitor"></a>

### pretty-debug.nodeMemoryMonitor(stream, callback)
Prints RAM usage by Node.js

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| stream | <code>Object.&lt;stream&gt;</code> | Stream Object |
| callback | <code>function</code> | Callback function to invoke when alarm triggers |

**Example**  
```js
debug.nodeMemoryMonitor({
		heapTotal: { upperLimit : 100 }
	}, function(){
		debug.critical('Memory Usage Alarm : Total heap usage is above 100 MB');
	}
);
```
<a name="module_pretty-debug.sysMemoryMonitor"></a>

### pretty-debug.sysMemoryMonitor(alarmPolicy, callback)
Prints RAM usage by operating system

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| alarmPolicy | <code>Object.&lt;alarmPolicy&gt;</code> | Policy object to trigger alarm |
| callback | <code>function</code> | Callback function to invoke when alarm triggers |

**Example**  
```js
debug.sysMemoryMonitor({
		MemTotal: { upperLimit : 700 }
	}, function(){
		debug.critical('Memory Usage Alarm : Total system memory usage is above 700 MB');
	}
);
```
<a name="module_pretty-debug.memoryWatermark"></a>

### pretty-debug.memoryWatermark()
Prints highest RAM usage in application. Scheduled healthcheck is needed to set watermark.

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  
**Example**  
```js
memoryWatermark();
```
<a name="module_pretty-debug.scheduleHealthCheck"></a>

### pretty-debug.scheduleHealthCheck(inputFunc, timeInMinutes)
Set Schedule to perform healthcheck

**Kind**: static method of [<code>pretty-debug</code>](#module_pretty-debug)  

| Param | Type | Description |
| --- | --- | --- |
| inputFunc | <code>function</code> | Healthcheck function |
| timeInMinutes | <code>numbers</code> | Interval in minutes |

**Example**  
```js
debug.scheduleHealthCheck(function(){
	debug.memoryWatermark();
	debug.sysMemoryMonitor();
	debug.nodeMemoryMonitor({
		heapTotal: { upperLimit : 5 }
	}, function(){
		debug.critical('Memory Usage Alarm : Total heap usage is above 5 MB');
	});
}, 10);
```
