const fs	=	require('fs');
const util	=	require('util');

const _timeOptions = {
    year: "numeric", month: "short", day: "numeric", 
    hour: "2-digit", minute: "2-digit", second: "2-digit", millis: "2-digit"
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
	info 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.green		:	'',
	error 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.red		:	'',
	time 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.yellow	:	'',
	fileLocation	: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.magenta	:	'',
	functionName 	: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.cyan		:	'',
	reset 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.reset		:	'',
	message 		: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.yellow	:	'',
	memory 		 	: !process.env.DISABLE_DEBUG_COLOR == 1 ? _ansiColorCodes.yellow	:	''
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
	let color = _debugColors;
	return 	_renderTextSegment(new Date().toLocaleTimeString("en-us", _timeOptions), color['time'], ' ')
			+ _renderTextSegment(functionName, color['functionName'], ' ')
			+ _renderTextSegment(fileLocation, color['fileLocation'], ' ')
			+ _renderTextSegment(tag, color[tag.toLowerCase()], ' : ')
			+ _renderTextSegment(message, color[tag.toLowerCase()], _debugColors.reset);
}

function _getFunctionCallLocation(){
	var err = new Error();
	const regexFile = /\((.*)\)$/;
	const matchFile = regexFile.exec(err.stack.split(/\r\n|\n/, 4)[3]);
	const fileLocation = matchFile[1].replace(/^.*[\\\/]/, '');

	const functionName = err.stack
			                .split('\n', 4)[3]
			                .replace(/^\s+at\s+(.+?)\s.+/g, '$1' );
	return {
		functionName : functionName,
		fileLocation : fileLocation
	}
}

module.exports = {
	debugStreams : [process.stdout],
	attachStream: function attachStream(stream){
		if(stream && _checkUniqueStream(this.debugStreams, stream)){
			this.debugStreams.push(stream);
		}
	},

	detachStream: function detachStream(stream){
		let filteredStream = this.debugStreams.filter(function(value){
		    return ( value != stream );
		});
		this.debugStreams = filteredStream;
	},

	print: function print(){
	  debugStreams.write(util.format.apply(this, arguments) + '\n');
	},

	printToAllStreams : function printAllStreams(){
		let ctx = this;
		let args = arguments;
		this.debugStreams.forEach(function(stream){
			if(stream){
				stream.write(util.format.apply(ctx, args) + '\n');
			}
		});
	},

	info: function info(message){
		if(process.env.DEBUG != 1) return;
		const currentLocationInfo = _getFunctionCallLocation();
		this.printToAllStreams(_renderMessage('INFO',
											 currentLocationInfo.functionName, 
											 currentLocationInfo.fileLocation, 
											 message)
		);
	},

	error: function error(message){
		if(process.env.DEBUG != 1) return;
		const currentLocationInfo = _getFunctionCallLocation();
		this.printToAllStreams(_renderMessage('ERROR',
											 currentLocationInfo.functionName, 
											 currentLocationInfo.fileLocation, 
											 message)
		);
	},

	nodeMemoryUsage : function nodeMemoryUsage(){
		if(process.env.DEBUG != 1) return;
		const nodeMemInfo = process.memoryUsage();
		this.printToAllStreams(_renderMessage(	'MEMORY',
												'Node', 
												'Process', 
												(	'RSS : ' 		+ Math.round(nodeMemInfo.rss  		/ 1024 / 1024 * 100) / 100 	+ ' MB, ' +
													'Total Heap : '	+ Math.round(nodeMemInfo.heapTotal  / 1024 / 1024 * 100) / 100 	+ ' MB, ' +
													'Heap Used : ' 	+ Math.round(nodeMemInfo.heapUsed  	/ 1024 / 1024 * 100) / 100 	+ ' MB, ' +
													'External : ' 	+ Math.round(nodeMemInfo.external  	/ 1024 / 1024 * 100) / 100 	+ ' MB' )));
	},

	sysMemoryUsage : function sysMemoryUsage(){
		if(process.env.DEBUG != 1) return;
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

			ctx.printToAllStreams(_renderMessage(	'MEMORY',
													'System', 
													'Process', 
													(	'MemTotal' 	+ ' : ' + info['MemTotal'] 	+ ' MB, ' + 
														'MemFree' 	+ ' : ' + info['MemFree'] 	+ ' MB, ' + 
														'SwapTotal' + ' : ' + info['SwapTotal'] + ' MB, ' +
														'SwapFree' 	+ ' : ' + info['SwapFree'] 	+ ' MB' )));
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


/* TODO : 	1. Print the function name which invoked the fucntion containing debug.info
 *			2. Redesign printDebugMessage() 
 *			3. Investigate if memory is optimized
 *			4. Optimize file and function name regex operation
 *			5. Beautify sysMemoryUsage() and nodeMemoryUsage()
 */