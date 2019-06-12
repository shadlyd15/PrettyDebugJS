const debug = require('./PrettyDebugJS.js');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports.loga = function(iteration, max){
	for (var i = 0; i < iteration; i++) {
		if(getRandomInt(max)){
			debug.info("This is test no : " + i + " Rand Value : " + Math.random());
		} else{
			debug.error("This is test no : " + i + " Rand Value : " + Math.random());
		}
	}
};