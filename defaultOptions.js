/**
 * @fileOverview Default Options
 * @external Default Options
 * @author Shadly Salahuddin
 * @link mailto:shadlyd15@gmail.com
 * @version 2.0.1
 */

const ansiColors = require('./ansiColors');

/**
* Default date & time format
* @typedef {Object} format
* @property {string} year="numeric" Current year
* @property {string} month="short" Current month
* @property {string} day="numeric" Current day
* @property {string} hour="2-digit" Current hour
* @property {string} minute="2-digit" Current minute
* @property {string} second="2-digit" Current second
* @property {string} timeZone Time Zone
*/

/**
* Default options for dateTime segment
* @typedef {Object} dateTime
* @property {boolean} show=true Show/hide time & date
* @property {number} color=ansiColors.yellow Date & time color
* @property {format} Default date & time format
*/

/**
* File location segment properties
* @typedef {fileLocation}
* @property {boolean} show=true Show/hide file name
* @property {number} color=ansiColors.magenta Date & time color
*/

/**
* Function name segment properties
* @typedef {funcName}
* @property {boolean} show=true Show/hide function name
* @property {number} color=ansiColors.cyan Date & time color
*/

/**
* Pinrt function options : log
* @typedef {log}
* @property {number} level=6 Log Level
* @property {string} tag="LOG" Tag to print
* @property {color}=ansiColor.green Print color at this log level
*/

/**
* Pinrt function options : info
* @typedef {info}
* @property {number} level=5 Log Level
* @property {string} tag="INFO" Tag to print
* @property {color}=ansiColor.green Print color at this log level
*/

/**
* Pinrt function options : alert
* @typedef {alert}
* @property {number} level=4 Log Level
* @property {string} tag="ALERT" Tag to print
* @property {color}=ansiColor.yellow Print color at this log level
*/

/**
* Pinrt function options : warn
* @typedef {warn}
* @property {number} level=3 Log Level
* @property {string} tag="WARN" Tag to print
* @property {color}=ansiColor.yellow Print color at this log level
*/

/**
* Pinrt function options : error
* @typedef {error}
* @property {number} level=2 Log Level
* @property {string} tag="ERROR" Tag to print
* @property {color}=ansiColor.red Print color at this log level
*/

/**
* Pinrt function options : critical
* @typedef {critical}
* @property {number} level=1 Log Level
* @property {string} tag="CRITICAL" Tag to print
* @property {color}=ansiColor.red Print color at this log level
*/

module.exports = {
	enable: true,
	enableColor: true,
	enableGC: false,
	debugLevel: 6,
	dateTime:{
		show: true,
		color: ansiColors.yellow,
		format: {
		    year: "numeric", month: "short", day: "numeric", 
		    hour: "2-digit", minute: "2-digit", second: "2-digit",
		    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
		}
	},
	fileLocation:{
		show: true,
		color: ansiColors.magenta		
	},
	funcName:{
		show: true,
		color: ansiColors.cyan
	},
	log:{
		level: 6,
		tag: "LOG",
		color: ansiColors.green
	},
	info:{
		level: 5,
		tag: "INFO",
		color: ansiColors.green
	},
	alert:{
		level: 4,
		tag: "ALERT",
		color: ansiColors.yellow
	},
	warn:{
		level: 3,
		tag: "WARN",
		color: ansiColors.yellow
	},
	error:{
		level: 2,
		tag: "ERROR",
		color: ansiColors.red
	},
	critical:{
		level: 1,
		tag: "CRITICAL",
		color: ansiColors.reset + ansiColors.bgRed
	},
	nodeMemoryMonitor:{
		tag: "NODE",
		type: "MONITOR",
		color: ansiColors.blue,
		fields:{
			rss: true,
			heapTotal: true, 
			heapUsed: true,
			external: true
		}
	},
	sysMemoryMonitor:{
		tag: "SYSTEM",
		type: "MONITOR",
		color: ansiColors.blue,
		fields:{
			MemTotal: true,
			MemAvailable: true,
			SwapTotal: true,
			SwapFree: true
		}
	},
	memoryWatermark:{
		tag: "WATERMARK",
		color: ansiColors.yellow,
		text: "RAM Watermark",
		fields:{
			RAM 	: {time : '', peak : 0},
			Swap 	: {time : '', peak : 0},
			Node 	: {time : '', peak : 0},
		},
		dateTime:{
			show: true,
			format: {
			    year: "2-digit", month: "numeric", day: "numeric", 
			    hour: "2-digit", minute: "2-digit",
			    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
			}
		}
	},
	saveLog: false
};