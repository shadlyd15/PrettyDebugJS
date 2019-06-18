/**
 * @fileOverview Pretty Debug Javascript
 * @author Shadly Salahuddin
 * @link mailto:shadlyd15@gmail.com
 * @version 2.0.1
 */

const fs	=	require('fs');
const util	=	require('util');
const options = require('./defaultOptions');
const ansiColors = require('./ansiColors');

function _updateOptions(obj, options = {}) {
    for (var key in options) {
        if (typeof options[key] === "object") {
            _updateOptions(obj[key], options[key]);   
        } else {
            obj[key] = options[key];
        }
    }
}

function _checkUniqueStream(targetArray, targetValue){ 
    for(let i = 0; i < targetArray.length; i++){
    	if(targetArray[i] === targetValue) return false;    	
    }
    return true;
}

function _paintText(text, color, resetColor = ''){
	return color + text + resetColor;
}

function _renderTextSegment(text, color, resetColor = ''){
	if(text === undefined) return '';
	return _paintText('[' + text + ']', options.enableColor?color:'', options.enableColor?resetColor:'');
}

function _getCurrentDateTime(){
	if(options['dateTime']['show'] !== true) return undefined;
	return new Date().toLocaleTimeString('en-US', options['dateTime']['format']);
}

function _renderMessage(tag, functionName, fileLocation, message, color){
	return	_renderTextSegment(_getCurrentDateTime(), options['dateTime']['color'], ' ')
			+ _renderTextSegment(functionName, options['funcName']['color'], ' ')
			+ _renderTextSegment(fileLocation, options['fileLocation']['color'], ' ')
			+ _renderTextSegment(tag, color, ' : ')
			+ _renderTextSegment(message, color, ansiColors.reset);
}

function _getFunctionCallLocation(){
	var err = new Error();
	Error.captureStackTrace(err);
	let fileLocation;
	let functionName;

	if(options.fileLocation.show === true){
		const regexFile = /\((.*)\)$/;
		const matchFile = regexFile.exec(err.stack.split(/\r\n|\n/, 4)[3]);
		if((matchFile != null) && (matchFile.length > 1)){
			fileLocation = matchFile[1].replace(/^.*[\\\/]/, '');
		}
	}
	if(options.funcName.show === true && fileLocation){
		functionName = err.stack
						.split('\n', 4)[3]
						.replace(/^\s+at\s+(.+?)\s.+/g, '$1' );
    } else{
    	functionName = 'Callback';
    }
	return {
		functionName : functionName,
		fileLocation : fileLocation
	}
}

function _bytesToMb(kilo){
	return Math.round(kilo / 1024 / 1024 * 100) / 100;
}

function _setWaterMark(watermark, currentValue){
	watermark.now = currentValue;
	if(watermark.peak <= currentValue){
		watermark.peak = currentValue;
		watermark.time 	= new Date().toLocaleTimeString('en-US', options['memoryWatermark']['dateTime']['format']);
	}
}

function _checkAlarmPolicy(policy, currentValue){
	for (var key in policy) {
		if (policy[key]['lowerLimit'] > currentValue[key]){ 
			return true;
		}
		if (policy[key]['upperLimit'] < currentValue[key]){
			return true;
		}
	}
}

function _generateFunction(tag){
	return function(){
		if((options.enable != true) || options[tag]['level'] > options['debugLevel']) return;
		const currentLocationInfo = _getFunctionCallLocation();
		_printToAllStreams(_renderMessage(	options[tag]['tag'],
											currentLocationInfo['functionName'], 
											currentLocationInfo['fileLocation'], 
											util.format.apply(this, arguments),
											options[tag].color)
		);
	};
}

function _generateTextFromObj(obj, callback){
	let text = '';
	for(let key in obj){
		if(obj[key]){
			text = text + callback(key) ;
		}
	}
	return text;
}

const debugStreams = [process.stdout];

function _printStream(stream, message){
	if(stream){
		stream.write(message + '\n');
	}
};

function _printToAllStreams(message){
	debugStreams.forEach(function(stream){
		_printStream(stream, message);
	});
};


/**
 * @module pretty-debug
 * @desc A highly configurable & lightweight debug library that prints debug messages beautifully. 
 * It works in Node.js and Web browser environments with very low memory footprint. 
 */

module.exports = {

  /**
	* @type {Object.<string>}
	* @property {string} reset		- Text Color Reset
    * @property {string} black 		- Text Color Block
    * @property {string} red 		- Text Color Red
    * @property {string} green 		- Text Color Green
    * @property {string} yellow 	- Text Color Yellow
    * @property {string} blue 		- Text Color Blue
    * @property {string} magenta 	- Text Color Magenta
    * @property {string} cyan 		- Text Color Cyan
    * @property {string} white 		- Text Color Cyan
	* @property {string} bgBlack 	- Background Color Black
	* @property {string} bgRed 		- Background Color Red
	* @property {string} bgGreen 	- Background Color Green
	* @property {string} bgYellow 	- Background Color Yellow
	* @property {string} bgBlue 	- Background Color Blue
	* @property {string} bgMagenta 	- Background Color Magenta
	* @property {string} bgCyan 	- Background Color Cyan
	* @property {string} bgWhite 	- Background Color White
	*/
	color : ansiColors,

  /**
	* Overwrites default options and debug text formats
	* @param {Object.<userOptions>} userOptions - Options User specific options
	*/
	setOptions: function setOptions(userOptions){
		_updateOptions(options, userOptions);
	},

  /**
	* Generates policy for different memory monitors
	* @param {number} lowerLimit - Lower limit
	* @param {number} upperLimit - Upper limit
	* @return {Object.<policy>}
	*/
	generatePolicy: function generatePolicy(lower = 0, upper = 100){
		return {
			lowerLimit : `${lower}`,
			upperLimit : `${upper}`
		};
	},

  /**
	* Attaches stream to pipe debug output
	* @param {Object.<stream>} stream - Stream to attach
	*/
	attachStream: function attachStream(stream){
		if(stream && _checkUniqueStream(debugStreams, stream)){
			debugStreams.push(stream);
			this.alert('New Debug Stream Attached');
		}
	},

  /**
	* Detaches stream from debug output
	* @param {Object.<stream>} stream - Stream to detach
	*/
	detachStream: function detachStream(stream){
		let filteredStreams = debugStreams.filter(function(value){
		    return ( value != stream );
		});
		debugStreams = filteredStreams;
		this.info('Debug Stream Detached');
	},

  /**
	* Prints log messages in level 6
	* @function
	* @param {...*} var_args Variadic Argument
	* @example
	* debug.log("Just a simple log message");
	* @example
	* const policy = { upperLimit : 70, lowerLimit : 20 };
	* debug.log(policy);
	*/
	log			: _generateFunction('log'),

  /**
	* Prints info messages in level 5
	* @function
	* @param {...*} var_args Variadic Argument
	* @example
	* debug.info("Here is an info message.");
	* @example
	* const birthTimestamp = { date : "15/12/1993", time : "12:05 AM" };
	* debug.info(birthTimestamp);
	*/
	info		: _generateFunction('info'),

  /**
	* Prints alert messages in level 4
	* @function
	* @param {...*} var_args Variadic Argument
	* @example
	* debug.alert("An alert message!");
	* @example
	* const birthTimestamp = { date : "15/12/1993", time : "12:05 AM" };
	* debug.alert(birthTimestamp);
	*/
	alert		: _generateFunction('alert'),
  
  /**
	* Prints warn messages in level 3
	* @function
	* @param {...*} var_args Variadic Argument
	* @example
	* debug.warn("This is your last warning.");
	* @example
	* const resource = { RAM : 10, CPU : 60 };
	* debug.warn(resource);
	*/
	warn		: _generateFunction('warn'),

  /**
	* Prints error messages in level 2
	* @function
	* @param {...*} var_args Variadic Argument
	* @example
	* debug.error("Error in recording server");
	* @example
	* const errorMessage = { message : "Some Error", errorCode : 4 };
	* debug.error(errorMessage);
	*/
	error		: _generateFunction('error'),

  /**
	* Prints critical messages in level 1
	* @function
	* @param {...*} var_args Variadic Argument
	* @example
	* debug.critical("API server critical error");
	* @example
	* const criticalMessage = { message : "Some Critical Error" };
	* debug.critical(criticalMessage);
	*/
	critical	: _generateFunction('critical'),

  /**
	* Prints RAM usage by Node.js
	* @param {Object.<stream>} stream - Stream Object
	* @param {function} callback - Callback function to invoke when alarm triggers
	* @example
	* debug.nodeMemoryMonitor({
	*		heapTotal: { upperLimit : 100 }
	* 	}, function(){
	*		debug.critical('Memory Usage Alarm : Total heap usage is above 100 MB');
	*	}
	* );
	*/
	nodeMemoryMonitor: function nodeMemoryMonitor(alarmPolicy = {}, callback = null){
		if(options.enable != true) return;
		const nodeMemInfo = process.memoryUsage();

		let message = _renderMessage(	'MEMORY',
										'Node', 
										undefined, 
										_generateTextFromObj(options.nodeMemoryMonitor.fields, function(key){
											return `| ${key} : ${_bytesToMb(nodeMemInfo[key])} MB |`;
										}),
										options['nodeMemoryMonitor']['color']);

		_setWaterMark(options.memoryWatermark.fields['Node'], _bytesToMb(nodeMemInfo.heapUsed));
		_printToAllStreams(message);

		if(_checkAlarmPolicy(alarmPolicy, nodeMemInfo) && callback) callback();
	},

  /**
	* Prints RAM usage by operating system
	* @param {Object.<alarmPolicy>} alarmPolicy - Policy object to trigger alarm
	* @param {function} callback - Callback function to invoke when alarm triggers	
	* @example
	* debug.sysMemoryMonitor({
	*		MemTotal: { upperLimit : 700 }
	* 	}, function(){
	*		debug.critical('Memory Usage Alarm : Total system memory usage is above 700 MB');
	*	}
	* );
	*/
	sysMemoryMonitor: function sysMemoryMonitor(alarmPolicy = {}, callback = null){
		if(options.enable != true) return;
		fs.readFile('/proc/meminfo', function (err, data){
			if (err) throw err;
			var info = {};
			data.toString().split(/\n/g).forEach(function(line){
			   line = line.split(':');
			   if (line.length < 2){
			       return;
			   }	
			   info[line[0]] = Math.round(parseInt(line[1].trim(), 10) / 1024);
			});

			let message = _renderMessage(	'MEMORY',
											'System', 
											undefined,
											_generateTextFromObj(options.sysMemoryMonitor.fields, function(key){
												return `| ${key} : ${info[key]} MB |`;
											}),
											options['sysMemoryMonitor'].color);

			_setWaterMark(options.memoryWatermark.fields['Swap'], info['SwapTotal'] - info['SwapFree']);
			_setWaterMark(options.memoryWatermark.fields['RAM'], info['MemTotal'] - info['MemAvailable']);

			_printToAllStreams(message);

			if(_checkAlarmPolicy(alarmPolicy, info) && callback) callback();
		});
	},

  /**
	* Prints highest RAM usage in application. Scheduled healthcheck is needed to set watermark.
	* @example memoryWatermark();
	*/
	memoryWatermark: function memoryWatermark(){
		if(options.enable != true) return;
		let message = _renderMessage(	'Watermark',
										undefined, 
										undefined,
										_generateTextFromObj(options.memoryWatermark.fields, function(key){
											return `| ${key} : ${options.memoryWatermark.fields[key].peak} MB @ ${options.memoryWatermark.fields[key].time} |`;
										}),
										options['memoryWatermark'].color);

		_printToAllStreams(message);
	},

  /**
	* Set Schedule to perform healthcheck
	* @param {function} inputFunc - Healthcheck function
	* @param {numbers} timeInMinutes - Interval in minutes
	* @example
	* debug.scheduleHealthCheck(function(){
	* 	debug.memoryWatermark();
	* 	debug.sysMemoryMonitor();
	* 	debug.nodeMemoryMonitor({
	* 		heapTotal: { upperLimit : 5 }
	* 	}, function(){
	* 		debug.critical('Memory Usage Alarm : Total heap usage is above 5 MB');
	* 	});
	* }, 10);
	*/
	scheduleHealthCheck: function scheduleHealthCheck(inputFunc, timeInMinutes){
		if(options.enable != true) return;
		setTimeout(function(){
			if(options['enableGC'] && global.gc){
				global.gc();
			}
			if(inputFunc){
				inputFunc();
				scheduleHealthCheck(inputFunc, timeInMinutes);
			}
		}, timeInMinutes * 60 * 1000);
	}
};



