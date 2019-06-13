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

const color = {
	info 		: colorCodes.COLOR_GREEN,
	error 		: colorCodes.COLOR_RED,
	time 		: colorCodes.COLOR_YELLOW,
	location 	: colorCodes.COLOR_CYAN,
	reset 		: colorCodes.COLOR_RESET
};

const timeOptions = {
    year: "numeric", month: "short", day: "numeric", 
    hour: "2-digit", minute: "2-digit", second: "2-digit", millis: "2-digit"
};

function paintText(text, paintColor, reset = true){
	return paintColor + text + (reset?color.reset:'');
}

function printDebugMessage(color, fileInfo, functionName, tag, message){
	if(!functionName) functionName = 'Anonymous';
	console.log(
		colorCodes.COLOR_YELLOW	+
		' [' +
		new Date().toLocaleTimeString("en-us", timeOptions) +
		'] ' +		
		colorCodes.COLOR_CYAN +
		'[' +
		functionName +
		' ' +
		fileInfo.filename +
		':' +
		fileInfo.line +
		'] ' +
		color +
		' [' +
		tag +
		']' +
		colorCodes.COLOR_YELLOW +
		'\t:\t' +
		color +
		message +
		colorCodes.COLOR_RESET
	);
}

const fileInfo = {
	currentLocation: function currentLocation(){
		var err = new Error();
		const regexFile = /\((.*)\)$/;
		const matchFile = regexFile.exec(err.stack.split(/\r\n|\n/, 4)[3]);
		const fileName = matchFile[1].replace(/^.*[\\\/]/, '');

		const matchFunc = err.stack.toString().split(/\r\n|\n/, 4)[3];
		const functionName = matchFunc.replace(/at |(?=\()(.*)(?<=\))/g, '');
		
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
		this.printToAllStreams(paintText(currentLocationInfo.functionName, color.info) + '(' + currentLocationInfo.fileName + ')');
		// printDebugMessage(colorCodes.COLOR_GREEN, callerInfo, info.caller.name, 'INFO', message);
	},

	error: function error(message) {	
		if(process.env.DEBUG != 1) return;
		const currentLocationInfo = fileInfo.currentLocation();
		this.printToAllStreams(currentLocationInfo.functionName + '(' + currentLocationInfo.fileName + ')');
		// printDebugMessage(colorCodes.COLOR_GREEN, callerInfo, info.caller.name, 'INFO', message);
	},

	nodeMemoryUsage : function nodeMemoryUsage() {
		if(process.env.DEBUG != 1) return;
		const used = process.memoryUsage();
		this.printToAllStreams(used);
		const infos = [];
		for (let key in used) {
		  infos.push(`${key} : ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
		}
		this.printToAllStreams(infos);
	},

	sysMemoryUsage : function sysMemoryUsage() {
		if(process.env.DEBUG != 1) return;
		var info = {};
	    var data = fs.readFileSync('/proc/meminfo').toString();
	    data.split(/\n/g).forEach(function(line){
	        line = line.split(':');
	        if (line.length < 2) {
	            return;
	        }
	        info[line[0]] = Math.round(parseInt(line[1].trim(), 10) / 1024);
	    });
	    this.printToAllStreams(	'MemTotal' 	+ ' : ' + info['MemTotal'] 	+ ' MB, ' + 
							   	'MemFree' 	+ ' : ' + info['MemFree'] 	+ ' MB, ' + 
							   	'SwapTotal' + ' : ' + info['SwapTotal'] + ' MB, ' +
							   	'SwapFree' 	+ ' : ' + info['SwapFree'] 	+ ' MB '  );
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