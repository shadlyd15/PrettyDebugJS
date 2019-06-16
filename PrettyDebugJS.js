const fs	=	require('fs');
const util	=	require('util');

const _timeOptions = {
    year: "numeric", month: "short", day: "numeric", 
    hour: "2-digit", minute: "2-digit", second: "2-digit", millis: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

const _ansiColorCodes = {
    black     :	'\x1B[30m',
    red       :	'\x1B[31m',
    green     :	'\x1B[32m',
    yellow    :	'\x1B[33m',
    blue      :	'\x1B[34m',
    magenta   :	'\x1B[35m',
    cyan      :	'\x1B[36m',
    white     :	'\x1B[37m',
    reset     :	'\x1B[00m'
};

const _debugColors = {
	log 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.green		:	'',
	info 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.green		:	'',
	error 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.red		:	'',
	alert		 	: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.yellow	:	'',
	time 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.yellow	:	'',
	fileLocation	: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.magenta	:	'',
	functionName 	: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.cyan		:	'',
	memory 		 	: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.cyan		:	'',
	reset 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.reset		:	''
}

function _checkUniqueStream(targetArray, targetValue){ 
    for(let i = 0; i < targetArray.length; i++){
    	if(targetArray[i] === targetValue) return false;    	
    }
    return true;
}; 

function _paintText(text, color, resetColor = ''){
	return color + text + resetColor;
}

function _renderTextSegment(text, color, resetColor = ''){
	return _paintText('[' + text + ']', color, resetColor);
}

function _renderMessage(tag, functionName, fileLocation, message){
	return	_renderTextSegment(new Date().toLocaleTimeString('en-US', _timeOptions), _debugColors['time'], ' ')
			+ _renderTextSegment(functionName, _debugColors['functionName'], ' ')
			+ _renderTextSegment(fileLocation, _debugColors['fileLocation'], ' ')
			+ _renderTextSegment(tag, _debugColors[tag.toLowerCase()], ' : ')
			+ _renderTextSegment(message, _debugColors[tag.toLowerCase()], _debugColors.reset);
}

function _getFunctionCallLocation(){
	var err = new Error();
	const regexFile = /\((.*)\)$/;
	const matchFile = regexFile.exec(err.stack.split(/\r\n|\n/, 4)[3]);
	let fileLocation = '';
	if((matchFile != null) && (matchFile.length > 1)){
		fileLocation = matchFile[1].replace(/^.*[\\\/]/, '');
	}
	const functionName = err.stack
			                .split('\n', 4)[3]
			                .replace(/^\s+at\s+(.+?)\s.+/g, '$1' );
	return {
		functionName : functionName,
		fileLocation : fileLocation
	}
}

module.exports = {
	
	nodeHeapWatermark : {time : '', value : 0},
	systemSwapWatermark : {time : '', value : 0},
	systemMemoryWatermark : {time : '', value : 0},

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
	
	log: function log(){
		if(process.env.ENABLE_DEBUG != 1) return;
		const currentLocationInfo = _getFunctionCallLocation();
		this._printToAllStreams(_renderMessage(	'LOG',
												 currentLocationInfo.functionName, 
												 currentLocationInfo.fileLocation, 
												 util.format.apply(this, arguments))
		);
	},

	info: function info(){
		if(process.env.ENABLE_DEBUG != 1) return;
		const currentLocationInfo = _getFunctionCallLocation();
		this._printToAllStreams(_renderMessage(	'INFO',
												 currentLocationInfo.functionName, 
												 currentLocationInfo.fileLocation, 
												 util.format.apply(this, arguments))
		);
	},

	error: function error(){
		if(process.env.ENABLE_DEBUG != 1) return;
		const currentLocationInfo = _getFunctionCallLocation();
		this._printToAllStreams(_renderMessage(	'ERROR',
												 currentLocationInfo.functionName, 
												 currentLocationInfo.fileLocation, 
												 util.format.apply(this, arguments))
		);
	},

	alert: function alert(){
		if(process.env.ENABLE_DEBUG != 1) return;
		const currentLocationInfo = _getFunctionCallLocation();
		this._printToAllStreams(_renderMessage(	'ALERT',
												 currentLocationInfo.functionName, 
												 currentLocationInfo.fileLocation, 
												 util.format.apply(this, arguments))
		);
	},

	nodeMemoryUsage: function nodeMemoryUsage(){
		if(process.env.ENABLE_DEBUG != 1) return;
		const nodeMemInfo = process.memoryUsage();

		// let nodeHeapUsedCurrent = info['MemTotal'] - info['MemAvailable'];
		// (nodeHeapUsedCurrent.value > this.nodeHeapWatermark) ? this.nodeHeapWatermark = nodeHeapUsedCurrent.value;

		this._printToAllStreams(_renderMessage(	'MEMORY',
												'Node', 
												'Process', 
												(	'RSS : ' 		+ Math.round(nodeMemInfo.rss  		/ 1024 / 1024 * 100) / 100 	+ ' MB, ' +
													'Total Heap : '	+ Math.round(nodeMemInfo.heapTotal  / 1024 / 1024 * 100) / 100 	+ ' MB, ' +
													'Heap Used : ' 	+ Math.round(nodeMemInfo.heapUsed  	/ 1024 / 1024 * 100) / 100 	+ ' MB, ' +
													'External : ' 	+ Math.round(nodeMemInfo.external  	/ 1024 / 1024 * 100) / 100 	+ ' MB 	' +
													'Heap Peak : ')));

	},

	sysMemoryUsage: function sysMemoryUsage(){
		if(process.env.ENABLE_DEBUG != 1) return;
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

			ctx._printToAllStreams(_renderMessage(	'MEMORY',
													'System', 
													'Process', 
													(	'MemTotal' 		+ ' : ' + info['MemTotal']		+ ' MB, ' + 
														'MemAvailable' 	+ ' : ' + info['MemAvailable'] 	+ ' MB, ' + 
														'SwapTotal' 	+ ' : ' + info['SwapTotal']		+ ' MB, ' +
														'SwapFree' 		+ ' : ' + info['SwapFree']		+ ' MB' )));

			// let systemSwapUsedCurrent = info['MemTotal'] - info['MemAvailable'];
			// let systemMemoryUsedCurrent = info['MemTotal'] - info['MemAvailable'];

			// (systemSwapUsedCurrent.value > this.systemSwapWatermark) ? this.systemSwapWatermark = systemSwapUsedCurrent.value;
			// (systemMemoryUsedCurrent.value > this.systemMemoryWatermark) ? this.systemMemoryWatermark = systemMemoryUsedCurrent.value;
		});
	},

	scheduleHealthCheck : function scheduleHealthCheck(inputFunc, timeInMinutes){
		setTimeout(function(){
			if(global.gc){
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
 *			3. Beautify sysMemoryUsage() and nodeMemoryUsage()
 */