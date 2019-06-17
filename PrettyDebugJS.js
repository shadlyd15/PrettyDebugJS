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
			fileLocation = matchFile[1].replace(/^.*[[\/|\\]]/, '');
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
		this._printToAllStreams(_renderMessage(	options[tag]['tag'],
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

module.exports = {
	color : ansiColors,
	debugStreams : [process.stdout],

	_printStream: function _printStream(stream, message){
		if(stream){
			stream.write(message + '\n');
		}
	},

	_printToAllStreams : function _printAllStreams(message){
		this.debugStreams.forEach(function(stream){
			this._printStream(stream, message);
		}, this);
	},

	setOptions: function setOptions(userOptions){
		_updateOptions(options, userOptions);
	},

	generatePolicy: function generatePolicy(lower = 0, upper = 100){
		return {
			lowerLimit : `${lower}`,
			upperLimit : `${upper}`
		};
	},

	attachStream: function attachStream(stream){
		if(stream && _checkUniqueStream(this.debugStreams, stream)){
			this.debugStreams.push(stream);
			this.alert('New Debug Stream Attached');
		}
	},

	detachStream: function detachStream(stream){
		let filteredStreams = this.debugStreams.filter(function(value){
		    return ( value != stream );
		});
		this.debugStreams = filteredStreams;
		this.info('Debug Stream Detached');
	},
	
	log			: _generateFunction('log'),
	info		: _generateFunction('info'),
	alert		: _generateFunction('alert'),
	warn		: _generateFunction('warn'),
	error		: _generateFunction('error'),
	critical	: _generateFunction('critical'),

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
		this._printToAllStreams(message);

		if(_checkAlarmPolicy(alarmPolicy, nodeMemInfo) && callback) callback();
	},

	sysMemoryMonitor: function sysMemoryMonitor(alarmPolicy = {}, callback = null){
		if(options.enable != true) return;
		var ctx = this;
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

			ctx._printToAllStreams(message);
		});
	},

	memoryWatermark: function memoryWatermark(){
		let message = _renderMessage(	'Watermark',
										undefined, 
										undefined,
										_generateTextFromObj(options.memoryWatermark.fields, function(key){
											return `| ${key} : ${options.memoryWatermark.fields[key].peak} MB @ ${options.memoryWatermark.fields[key].time} |`;
										}),
										options['memoryWatermark'].color	);

		this._printToAllStreams(message);
	},

	scheduleHealthCheck: function scheduleHealthCheck(inputFunc, timeInMinutes){
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

/* TODO : 	1. Investigate if memory is optimized
 *			2. Implement RAM High Watermark
 *			3. Beautify sysMemoryMonitor() and nodeMemoryMonitor()
 *			4. Set Policies
 */