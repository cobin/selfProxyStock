var fs = require('fs');
var _ = require("underscore");

var logger = require('./lib/logger').logger;
var utils = require('./lib/utils');

// 读取配置
var config = __dirname + '/etc/settings.json';
var settings = JSON.parse(fs.readFileSync(config, 'utf8'));

var _logger = logger(__dirname + '/' + settings.log.file);

var selfstock = require('./lib/selfstock').createSelfProxyStock(settings,_logger);

var express = require('express');

var app = express.createServer();
app.use(express.static(__dirname + '/public'));

fs.writeFileSync(__dirname + '/proxy-server.pid', process.pid.toString(), 'ascii');

//自选股服务处理总接口，包含增加，删除，修改，下载，上传等动作
app.get('/:fakecode/Stocks', function(req, res) {
	_logger.info([ 'SelfStock', req.url ]);
	res.header("Content-Type","application/json; charset=utf-8");
	var sAction = req.query.action;
	
	if(sAction==='list'){ //查询自选股回应内容：600000,600001
		selfstock.query(req,res);
	}else if(sAction==='add'){ //添加自选股	
		selfstock.add(req,res);
	}else if(sAction==='remove'){ //删除自选股
		selfstock.deletes(req,res);
	}else if (sAction==="sync") {
		selfstock.sync(req,res);
	}else{
		res.send('{"error":"无效的请求","result":null}');
	}
});

app.listen(settings.selfport);

console.log('SelfStock Proxy Server Port('+settings.selfport+') Started ' + new Date().toLocaleString());

process.on('uncaughtException', function(e){
    console.log(['uncaughtException:', e]);
});

process.on('exit',function(){
    console.log("Exit SelfStock Proxy Server.");
});