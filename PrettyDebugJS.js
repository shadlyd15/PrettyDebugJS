const fs	=	require('fs');
const util	=	require('util');

const colorCodes = {
    COLOR_BLACK     :	'\x1B[30m',
    COLOR_RED       :	'\x1B[31m',
    COLOR_GREEN     :	'\x1B[32m',
    COLOR_YELLOW    :	'\x1B[33m',
    COLOR_BLUE      :	'\x1B[34m',
    COLOR_MAGENTA   :	'\x1B[35m',
    COLOR_CYAN      :	'\x1B[36m',
    COLOR_WHITE     :	'\x1B[37m',
    COLOR_RESET     :	'\x1B[00m'
};

const timeOptions = {
    year: "numeric", month: "short", day: "numeric", 
    hour: "2-digit", minute: "2-digit", second: "2-digit", millis: "2-digit"
};

function renderTextSegment(paintColor, text, resetColor = ''){ 
	return ' ' + paintColor + '[' + text + ']' + resetColor + ' ';
}

function getColorsIfEnabled(){
	if(process.env.DISABLE_DEBUG_COLOR !== 1){
		return {
			info 			: colorCodes.COLOR_GREEN,
			error 			: colorCodes.COLOR_RED,
			time 			: colorCodes.COLOR_YELLOW,
			fileName		: colorCodes.COLOR_MAGENTA,
			functionName 	: colorCodes.COLOR_CYAN,
			reset 			: colorCodes.COLOR_RESET,
			message 		: colorCodes.COLOR_YELLOW,
			memory 		 	: colorCodes.COLOR_BLUE
		};
	} else{
		return {
			info 			: '',
			error 			: '',
			time 			: '',
			fileName		: '',
			functionName 	: '',
			reset 			: '',
			message 		: '',
			memory 		 	: ''
		};
	}
}

function renderMessage(tag, functionName, fileName, message){
	let color = getColorsIfEnabled();
	return 	renderTextSegment(color['time'], new Date().toLocaleTimeString("en-us", timeOptions))
			+ renderTextSegment(color['functionName'], functionName)
			+ renderTextSegment(color['fileName'], fileName)
			+ renderTextSegment(color[tag.toLowerCase()], tag)
			+ renderTextSegment(color[tag.toLowerCase()], ' ' + message + ' ', color.reset)
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
		let context = this;
		let args = arguments;
		this.debugStream.forEach(function(stream){
			if(stream){
				stream.write(util.format.apply(context, args) + '\n');
			}
		});
	},

	info: function info(message) {
		if(process.env.DEBUG != 1) return;
		const currentLocationInfo = fileInfo.currentLocation();
		this.printToAllStreams(renderMessage('INFO',
											 currentLocationInfo.functionName, 
											 currentLocationInfo.fileName, 
											 message)
		);
	},

	error: function error(message) {	
		if(process.env.DEBUG != 1) return;
		const currentLocationInfo = fileInfo.currentLocation();
		this.printToAllStreams(renderMessage('ERROR',
											 currentLocationInfo.functionName, 
											 currentLocationInfo.fileName, 
											 message)
		);
	},

	nodeMemoryUsage : function nodeMemoryUsage() {
		if(process.env.DEBUG != 1) return;
		const nodeMemInfo = process.memoryUsage();
		this.printToAllStreams(renderMessage(	'MEMORY',
												'Node', 
												'Process', 
												(	'RSS : ' 		+ Math.round(nodeMemInfo.rss  		/ 1024 / 1024 * 100) / 100 	+ ' MB, ' +
													'Heap Total : '	+ Math.round(nodeMemInfo.heapTotal  / 1024 / 1024 * 100) / 100 	+ ' MB, ' +
													'Heap Used : ' 	+ Math.round(nodeMemInfo.heapUsed  	/ 1024 / 1024 * 100) / 100 	+ ' MB, ' +
													'External : ' 	+ Math.round(nodeMemInfo.external  	/ 1024 / 1024 * 100) / 100 	+ ' MB  ' )));
	},

	sysMemoryUsage : function sysMemoryUsage() {
		if(process.env.DEBUG != 1) return;
		var context = this;
		fs.readFile('/proc/meminfo', function (err, data) {
			if (err) throw err;
			var info = {};
			data.toString().split(/\n/g).forEach(function(line){
			   line = line.split(':');
			   if (line.length < 2) {
			       return;
			   }
			   info[line[0]] = Math.round(parseInt(line[1].trim(), 10) / 1024);
			});

			context.printToAllStreams(renderMessage('MEMORY',
									 'System', 
									 'Process', 
									 (	'MemTotal' 	+ ' : ' + info['MemTotal'] 	+ ' MB, ' + 
							   			'MemFree' 	+ ' : ' + info['MemFree'] 	+ ' MB, ' + 
							   			'SwapTotal' + ' : ' + info['SwapTotal'] + ' MB, ' +
							   			'SwapFree' 	+ ' : ' + info['SwapFree'] 	+ ' MB ' )));
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