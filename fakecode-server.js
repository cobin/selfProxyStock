var http = require('http');
var url = require('url');
var fs = require('fs');
var _ = require("underscore");

var express = require('express');

var app = express.createServer();
app.use(express.static(__dirname + '/public'));

fs.writeFileSync(__dirname + '/fakecode-server.pid', process.pid.toString(), 'ascii');

app.get('/fakecode', function(req, res) {
	console.log([ 'fakecode', req.query.code ]);	
	var mobile = "";
	
	if(fakecode=="C57AZZ1") {
		mobile="13963632525";
	}else if(fakecode=="C57AZZ0") {
		mobile="13955882233";		
	}
	res.send(mobile);
});

app.listen(8101);

console.log('Fakecode Server Port(8101) Started ' + new Date().toLocaleString());

process.on('uncaughtException', function(e){
    console.log(['uncaughtException:', e]);
});
