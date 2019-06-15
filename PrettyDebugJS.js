const fs	=	require('fs');
const util	=	require('util');

const ansiColorCodes = {
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

const debugColors = {
	info 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? ansiColorCodes.green		:	'',
	error 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? ansiColorCodes.red		:	'',
	time 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? ansiColorCodes.yellow		:	'',
	fileName		: !process.env.DISABLE_DEBUG_COLOR == 1 ? ansiColorCodes.magenta	:	'',
	functionName 	: !process.env.DISABLE_DEBUG_COLOR == 1 ? ansiColorCodes.cyan		:	'',
	reset 			: !process.env.DISABLE_DEBUG_COLOR == 1 ? ansiColorCodes.reset		:	'',
	message 		: !process.env.DISABLE_DEBUG_COLOR == 1 ? ansiColorCodes.yellow		:	'',
	memory 		 	: !process.env.DISABLE_DEBUG_COLOR == 1 ? ansiColorCodes.yellow		:	''
}

function paintText(text, color, resetColor = ''){
	return color + text + resetColor;
}

const timeOptions = {
    year: "numeric", month: "short", day: "numeric", 
    hour: "2-digit", minute: "2-digit", second: "2-digit", millis: "2-digit"
};

function renderTextSegment(text, color, resetColor = ''){
	return paintText('[' + text + ']', color, resetColor);
}

function renderMessage(tag, functionName, fileName, message){
	let color = debugColors;
	return 	renderTextSegment(new Date().toLocaleTimeString("en-us", timeOptions), color['time'], ' ')
			+ renderTextSegment(functionName, color['functionName'], ' ')
			+ renderTextSegment(fileName, color['fileName'], ' ')
			+ renderTextSegment(tag, color[tag.toLowerCase()], ' : ')
			+ renderTextSegment(message, color[tag.toLowerCase()])
}

function renderMemInfo(){

}

const fileInfo = {
	currentLocation: function currentLocation(){
		var err = new Error();
		const regexFile = /\((.*)\)$/;
		const matchFile = regexFile.exec(err.stack.split(/\r\n|\n/, 4)[3]);
		const fileName = matchFile[1].replace(/^.*[\\\/]/, '');

		const matchFunc = err.stack.toString().split(/\r\n|\n/, 4)[3];
		const functionName = matchFunc.replace(/    at |(?=\()(.*)(?<=\))/g, '');
		
		return {
			functionName : functionName,
			fileName : fileName
		}
	}
}

module.exports = {
	debugStream : [],
	attachStream: function attachStream(stream = process.stdout){
		if(stream){
			this.debugStream.push(stream);
		}
	},

	detachStream: function detachStream(stream){
		let filteredStream = this.debugStream.filter(function(value){
		    return ( value != stream );
		});
		this.debugStream = filteredStream;
	},

	print: function print(){
	  debugStream.write(util.format.apply(this, arguments) + '\n');
	},

	printToAllStreams : function printAllStreams(){
		let ctx = this;
		let args = arguments;
		this.debugStream.forEach(function(stream){
			if(stream){
				stream.write(util.format.apply(ctx, args) + '\n');
			}
		});
	},

	info: function info(message){
		if(process.env.DEBUG != 1) return;
		const currentLocationInfo = fileInfo.currentLocation();
		this.printToAllStreams(renderMessage('INFO',
											 currentLocationInfo.functionName, 
											 currentLocationInfo.fileName, 
											 message)
		);
	},

	error: function error(message){
		if(process.env.DEBUG != 1) return;
		const currentLocationInfo = fileInfo.currentLocation();
		this.printToAllStreams(renderMessage('ERROR',
											 currentLocationInfo.functionName, 
											 currentLocationInfo.fileName, 
											 message)
		);
	},

	nodeMemoryUsage : function nodeMemoryUsage(){
		if(process.env.DEBUG != 1) return;
		const nodeMemInfo = process.memoryUsage();
		this.printToAllStreams(renderMessage(	'MEMORY',
												'Node', 
												'Process', 
												(	'RSS : ' 		+ Math.round(nodeMemInfo.rss  		/ 1024 / 1024 * 100) / 100 	+ ' MB, ' +
													'Heap Total : '	+ Math.round(nodeMemInfo.heapTotal  / 1024 / 1024 * 100) / 100 	+ ' MB, ' +
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

			ctx.printToAllStreams(renderMessage('MEMORY',
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