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

let timeOptions = {  
    year: "numeric", month: "short",  
    day: "numeric", hour: "2-digit", minute: "2-digit"  
};  

const debug = {
	info: function info(message) {
		const callerInfo = getFileName(info.caller.name);
		console.log(
			colorCodes.COLOR_YELLOW	+
			' [' +
			new Date().toLocaleTimeString("en-us", timeOptions) + 
			' ] ' +
			colorCodes.COLOR_GREEN	+
			'[ INFO ] : ' +
			// new Date().toLocaleTimeString("en-us", timeOptions) + 
			// ' | ' +
			callerInfo.filename +
			':' +
			callerInfo.line +
			' > ' +
			info.caller.name +
			'() :: ' +
			message +
			colorCodes.COLOR_RESET
		);
	},

	error: function error(message) {
		const callerInfo = getFileName(error.caller.name);
		console.log(
			colorCodes.COLOR_RED	+
			' ' +
			'[ ERROR ] \t : ' +
			new Date().toLocaleTimeString("en-us", timeOptions) + 
			' | ' +
			callerInfo.filename +
			':' +
			callerInfo.line +
			' > ' +
			error.caller.name +
			'() :: ' +
			message +
			colorCodes.COLOR_RESET
		);
	},
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


function iWantToLog() {
	debug.info('Testing My Information ');
	debug.error('This is an error message');
}

iWantToLog();

// console.log(process.env.COLORTERM)

		// console.log(
		// 	colorCodes.COLOR_RED + 
		// 	' ' +
		// 	'[ ERROR ] \t : ' +
		// 	colorCodes.COLOR_YELLOW + 
		// 	new Date().toLocaleTimeString(timeOptions) +
		// 	' : ' +
		// 	colorCodes.COLOR_RESET + 
		// 	callerInfo.filename +
		// 	':' +
		// 	callerInfo.line +
		// 	':' +
		// 	callerInfo.column +
		// 	' ' +
		// 	error.caller.name +
		// 	'() ' +
		// 	message
		// );