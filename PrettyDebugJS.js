
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
    year: "numeric", month: "short",  
    day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", millis: "2-digit"
};  

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
		// colorCodes.COLOR_WHITE +
		// '[' +
		// functionName +
		// ']' +
		colorCodes.COLOR_YELLOW +
		'\t:\t' +
		color +
		message +
		colorCodes.COLOR_RESET
	);
}


const fileInfo = {
	_getErrorObject : function _getErrorObject(){
	    try { throw Error('') } catch(err) { return err; }
	},

	currentLocation: function currentLocation(){
		var err = this._getErrorObject();

		const regexFile = /\((.*)\)$/;
		const matchFile = regexFile.exec(err.stack.split(/\r\n|\n/)[4]);
		const fileName = matchFile[1].replace(/^.*[\\\/]/, '');

		const matchFunc = err.stack.toString().split(/\r\n|\n/)[5];
		const functionName = matchFunc.replace(/(?=\()(.*)(?<=\))/, '');
		
		return {
			functionName : functionName,
			fileName : fileName
		}
	}
}

module.exports = {
	info: function info(message) {
        // console.log(colorCodes.COLOR_GREEN + 'File Name : ' + _getCallerFile() + colorCodes.COLOR_RESET);

        const currentLocationInfo = fileInfo.currentLocation();
		
		console.log(currentLocationInfo.functionName + '(' + currentLocationInfo.fileName + ')');
		// printDebugMessage(colorCodes.COLOR_GREEN, callerInfo, info.caller.name, 'INFO', message);
	},

	error: function error(message) {
		// console.log(colorCodes.COLOR_RED + 'File Name : ' + _getCallerFile() + colorCodes.COLOR_RESET);

		// var err = getErrorObject();

		// const regex = /\((.*):(\d+):(\d+)\)$/
		// const match = regex.exec(err.stack.split("\n")[3]);
		// console.log(match[1] + ' ' + match[2] + ' ' + match[3] + ' ');

		// console.log('caller_line : ' + err.stack.toString().split(/\r\n|\n/)[4]);   
		// console.log('Stack Trace : ' + err.stack.toString().split(/\r\n|\n/)[3]); 
		// console.log();
        
		// printDebugMessage(colorCodes.COLOR_RED, callerInfo, error.caller.name, 'ERROR', message);
	}
};

