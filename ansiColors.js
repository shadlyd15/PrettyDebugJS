/**
 * @fileOverview ANSI color codes
 * @author Shadly Salahuddin
 * @link mailto:shadlyd15@gmail.com
 * @version 2.0.1
 */

/**
 * @module ansiColors
 * @desc Definition of common colors in ansi escape code
 * @exports {ansiColors}
 */

/**
 * Default options for Pretty Debug library
 * @typedef {Object} ansiColors
 * @property {string} reset='\x1B[00m' ANSI color code : reset
 * @property {string} black='\x1B[30m' ANSI color code : black
 * @property {string} red='\x1B[31m' ANSI color code : red
 * @property {string} red='\x1B[32m' ANSI color code : red
 * @property {string} yellow='\x1B[33m' ANSI color code : yellow
 * @property {string} blue='\x1B[34m' ANSI color code : blue
 * @property {string} magenta='\x1B[35m' ANSI color code : magenta
 * @property {string} cyan='\x1B[36m' ANSI color code : cyan
 * @property {string} white='\x1B[37m' ANSI color code : white
 * @property {string} bgBlack='\x1B[40m' ANSI color code : bgBlack
 * @property {string} bgRed='\x1B[41m' ANSI color code : bgRed
 * @property {string} bgGreen='\x1B[42m' ANSI color code : bgGreen
 * @property {string} bgYellow='\x1B[43m' ANSI color code : bgYellow
 * @property {string} bgBlue='\x1B[44m' ANSI color code : bgBlue
 * @property {string} bgMagenta='\x1B[45m' ANSI color code : bgMagenta
 * @property {string} bgCyan='\x1B[46m' ANSI color code : bgCyan
 * @property {string} bgWhite='\x1B[47m' ANSI color code : bgWhite
 */

module.exports = {
    reset		: 	'\x1B[00m',

    black     	: 	'\x1B[30m',
    red       	: 	'\x1B[31m',
    green     	: 	'\x1B[32m',
    yellow    	: 	'\x1B[33m',
    blue      	: 	'\x1B[34m',
    magenta   	: 	'\x1B[35m',
    cyan      	: 	'\x1B[36m',
    white     	: 	'\x1B[37m',

	bgBlack		:	'\x1B[40m',
	bgRed		:	'\x1B[41m',
	bgGreen		:	'\x1B[42m',
	bgYellow	:	'\x1B[43m',
	bgBlue		:	'\x1B[44m',
	bgMagenta	:	'\x1B[45m',
	bgCyan		:	'\x1B[46m',
	bgWhite		:	'\x1B[47m'
};