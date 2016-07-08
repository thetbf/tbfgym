module.exports = {
	signup: function(x, successCb){
	var WebSocket = require('ws');
	var ws = new WebSocket('ws://localhost:32820/TBFWebSocket2/echo');

	ws.on('open', function open() {
	  ws.send(x);
	});

	ws.on('message'
		, function incoming(message) {
		if(message === 'Connection Established') {
					return;
		}
		successCb(JSON.parse(JSON.stringify(message)));
		ws.close();
	});

	ws.on('close', function close() {
		return ;
	});

	}
}