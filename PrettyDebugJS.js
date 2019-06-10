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
    day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"  
};  

function getFileName(caller) {
  	const STACK_FUNC_NAME = new RegExp(/at\s+((\S+)\s)?\((\S+):(\d+):(\d+)\)/);
	let err = new Error();
	if(typeof Error.captureStackTrace === 'function'){
		Error.captureStackTrace(err);
	}

	let callerInfo = null;
	let stacks = err.stack.split('\n').slice(1);
	for (let i = 0; i < stacks.length; i++) {
		callerInfo = STACK_FUNC_NAME.exec(stacks[i]);
		if (callerInfo[2] === caller) {
			return {
				filename: callerInfo[3].replace(/^.*[\\\/]/, '') || null,
				line: callerInfo[4] || null,
				column: callerInfo[5] || null,
			};
		}
	}
	return null;
}

function printDebugMessage(color, fileInfo, functionName, tag, message){
	console.log(
		color +
		' [' +
		tag +
		'] \t' +
		colorCodes.COLOR_YELLOW	+
		' [' +
		new Date().toLocaleTimeString("en-us", timeOptions) +
		'] ' +
		colorCodes.COLOR_CYAN +
		'[' +
		fileInfo.filename +
		':' +
		fileInfo.line +
		'] ' +
		colorCodes.COLOR_MAGENTA +
		'[' +
		functionName +
		']' +
		colorCodes.COLOR_YELLOW +
		' \t:: ' +
		color +
		message +
		colorCodes.COLOR_RESET
	);
}

module.exports = {
	info: function info(message) {
		const callerInfo = getFileName(info.caller.name);
		printDebugMessage(colorCodes.COLOR_GREEN, callerInfo, info.caller.name, 'INFO', message);
	},

	error: function error(message) {
		const callerInfo = getFileName(error.caller.name);
		printDebugMessage(colorCodes.COLOR_RED, callerInfo, error.caller.name, 'ERROR', message);
	},
};

// function TestFunction() {
// 	debug.info('Testing My Information ');
// 	debug.error('This is an error message');
// }

// TestFunction();	