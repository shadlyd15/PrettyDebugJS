/**
 * @fileOverview Default Options
 * @author Shadly Salahuddin
 * @link mailto:shadlyd15@gmail.com
 * @version 2.0.1
 */

const ansiColors = require('./ansiColors');

/**
 * @module defaultOptions
 * @desc <strong>Predefined options for pretty-debug library.</strong><br>
 * By changing this options :
 * - Turn on/off debug print.
 * - Turn on/off color debug print.
 * - Turn on/off Automatic grabage collection.
 * - User can show or hide any segment.
 * - User can change the default colors of different segments.
 * @exports {defaultOptions}
 */
module.exports = {
	/** 
	* Enable pretty-debug (Default : true)
	* @type {boolean}
	*/
	enable: true,

	/** 
	* Enable pretty-debug color output (Default : true)
	* @type {boolean}
	*/
	enableColor: true,

	/** 
	* Enable pretty-debug automatic grbage collection. (Default : false)( NB: If turned true --expose-gc flag is needed )
	* @type {boolean}
	*/
	enableGC: false,

	/** 
	* Highest debug level to output (Default : 6)
	* @type {number}
	*/
	debugLevel: 6,

	/** 
	* Date & time display options
	* @type {dateTime}
	*/
	dateTime:{
		show: true,
		color: ansiColors.yellow,
		format: {
		    year: "numeric", month: "short", day: "numeric", 
		    hour: "2-digit", minute: "2-digit", second: "2-digit",
		    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
		}
	},

	/** 
	* File location display options
	* @type {fileLocation}
	*/
	fileLocation:{
		show: true,
		color: ansiColors.magenta		
	},

	/** 
	* Function name display options
	* @type {funcName}
	*/
	funcName:{
		show: true,
		color: ansiColors.cyan
	},

	/** 
	* Print function options : log
	* @type {debugPrintOptions}
	* @property {number} level=6 Log Level
	* @property {string} tag="LOG" Tag to print
	* @property {string} color=ansiColor.green Print color at this log level
	*/
	log:{
		level: 6,
		tag: "LOG",
		color: ansiColors.green
	},

	/** 
	* Print function options : info
	* @type {debugPrintOptions}
	* @property {number} level=5 Log Level
	* @property {string} tag="INFO" Tag to print
	* @property {string} color=ansiColor.green Print color at this log level
	*/
	info:{
		level: 5,
		tag: "INFO",
		color: ansiColors.green
	},

	/** 
	* Print function options : alert
	* @type {debugPrintOptions}
	* @property {number} level=4 Log Level
	* @property {string} tag="ALERT" Tag to print
	* @property {string} color=ansiColor.yellow Print color at this log level
	*/
	alert:{
		level: 4,
		tag: "ALERT",
		color: ansiColors.yellow
	},

	/** 
	* Print function options : warn
	* @type {debugPrintOptions}
	* @property {number} level=5 Log Level
	* @property {string} tag="WARN" Tag to print
	* @property {string} color=ansiColor.yellow Print color at this log level
	*/
	warn:{
		level: 3,
		tag: "WARN",
		color: ansiColors.yellow
	},

	/** 
	* Print function options : error
	* @type {debugPrintOptions}
	* @property {number} level=5 Log Level
	* @property {string} tag="ERROR" Tag to print
	* @property {string} color=ansiColor.red Print color at this log level
	*/
	error:{
		level: 2,
		tag: "ERROR",
		color: ansiColors.red
	},

	/** 
	* Print function options : critical
	* @type {debugPrintOptions}
	* @property {number} level=5 Log Level
	* @property {string} tag="CRITICAL" Tag to print
	* @property {string} color=ansiColor.red Print color at this log level
	*/
	critical:{
		level: 1,
		tag: "CRITICAL",
		color: ansiColors.reset + ansiColors.bgRed
	},

	/**
	 * Node memory monitor options
	 * @type {memoryMonitorOptions}
	 * @property {string} tag="NODE" Tag to print
	 * @property {string} type="MONITOR" Type of monitor
	 * @property {string} color=ansiColor.blue Print color in this segment
	 * @property {Object} fields Available fields
	 * @property {boolean} fields.rss=true Show/hide rss
	 * @property {boolean} fields.heapTotal=true Show/hide heapTotal
	 * @property {boolean} fields.heapUsed=true Show/hide heapUsed
	 * @property {boolean} fields.external=true Show/hide external
	 */
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

	/**
	 * System memory monitor options
	 * @type {memoryMonitorOptions}
	 * @property {string} tag="SYSTEM" Tag to print
	 * @property {string} type="MONITOR" Type of monitor
	 * @property {string} color=ansiColor.blue Print color in this segment
	 * @property {Object} fields Available fields
	 * @property {boolean} fields.MemTotal=true Show/hide MemTotal
	 * @property {boolean} fields.MemAvailable=true Show/hide MemAvailable
	 * @property {boolean} fields.SwapTotal=true Show/hide SwapTotal
	 * @property {boolean} fields.SwapFree=true Show/hide SwapFree
	 */
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

	/**
	 * System memory watermark options
	 * @type {memoryWatermark}
	 * @property {string} tag="WATERMARK" Tag to print
	 * @property {string} text="RAM Watermark" Type of monitor
	 * @property {string} color=ansiColor.yellow Print color in this segment
	 * @property {Object} fields Available fields
	 * @property {boolean} fields.RAM Value of highest RAM ussage
	 * @property {boolean} fields.Swap Value of highest Swap ussage
	 * @property {boolean} fields.Node Value of highest Node.js ussage
	 * @property {dateTime} dateTime Date & time segment options
	 */
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
* @property {format} format - Default date & time format
*/

/**
* File location segment properties
* @typedef {Object} fileLocation
* @property {boolean} show=true Show/hide file name
* @property {number} color=ansiColors.magenta Date & time color
*/

/**
* Function name segment properties
* @typedef {Object} funcName
* @property {boolean} show=true Show/hide function name
* @property {number} color=ansiColors.cyan Date & time color
*/

/**
* Generic debug print function option
* @typedef {Object} debugPrintOptions
* @property {number} level Log Level
* @property {string} tag  Tag to print
* @property {string} color Print color at this log level
*/

/**
 * Generic memory monitor options
 * @typedef {Object} memoryMonitorOptions
 * @property {string} tag Tag to print
 * @property {string} type Type of monitor
 * @property {string} color Print color in this segment
 * @property {Object} fields Available fields
 */

/**
 * System memory watermark options
 * @typedef {Object} memoryWatermark
 * @property {string} tag="WATERMARK" Tag to print
 * @property {string} text="RAM Watermark" Type of monitor
 * @property {string} color=ansiColor.yellow Print color in this segment
 * @property {Object} fields Available fields
 * @property {boolean} fields.RAM Value of highest RAM ussage
 * @property {boolean} fields.Swap Value of highest Swap ussage
 * @property {boolean} fields.Node Value of highest Node.js ussage
 * @property {dateTime} dateTime Date & time segment options
 */