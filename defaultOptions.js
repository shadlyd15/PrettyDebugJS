const ansiColors = require('./ansiColors');

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
		color: ansiColors.bgRed
	},
	nodeMemoryMonitor:{
		tag: "NODE MONITOR",
		color: ansiColors.blue,
		text: "Node Monitor",
		fields:{
			rss: true,
			heapTotal: true, 
			heapUsed: true,
			external: true
		}
	},
	sysMemoryMonitor:{
		tag: "SYSTEM MONITOR",
		color: ansiColors.blue,
		text: "System Monitor",
		fields:{
			MemTotal: true,
			MemAvailable: true,
			SwapTotal: true,
			SwapFree: true
		}
	},
	memoryWatermark:{
		tag: "WATERMARK",
		color: ansiColors.cyan,
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