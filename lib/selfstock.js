var request = require('request');

var SelfProxyStock = function(settings,logger){
		var _self = this;
	  this.selfstock = settings.selfstock;
	  this.logger = logger;

		var requestRemoteSelfStock=function(param,req,res){
			request({ uri:_self.selfstock.fakecodeurl+req.params.fakecode, timeout:10000 }, function (error, response, body) {
				 if(error || response.statusCode != 200) {
				 		console.log(["request-error",_self.selfstock.fakecodeurl,req.params.fakecode,error,response.statusCode]); 
				 		res.send("");
				 }else{
						var msisdn = body;
						if(body==null || body.length<11){
							console.log(["mobile-error",body]); 
				 			res.send("");
						}else{		
							var sUrl = _self.selfstock.url;
							sUrl+="?msisdn="+msisdn+param;
							request({ uri:sUrl, timeout:30000 }, function (error, response, body) {
						      if(error || response.statusCode != 200) {
						          console.log(["request-error",sUrl,error,response.statusCode]); 
						          res.send("");
						      } else {
						          try {
						          	logger.info(["info",msisdn,param,body]);
						            res.send(body);
						          } catch(err) {
						            console.log(["try-error",sUrl,err]);
						            res.send("");
						          }
						      }
						  });	
						}
				}
			});	
		}
		
		this.query = function(req,res) {
			var param = "&type=1";
		  requestRemoteSelfStock(param,req,res);  
		};
		
		this.add = function(req,res) {
			var param = "&type=2&stocklist="+req.query.stocks;
		  requestRemoteSelfStock(param,req,res);  
		};
		
		this.delete = function(req,res) {
			var param = "&type=3&stocklist="+req.query.stocks;
			requestRemoteSelfStock(param,req,res);  
		};
		
		this.clear = function(req,res) {
			var param = "&type=4";
			requestRemoteSelfStock(param,req,res);  		  
		};
		
		this.upload = function(req,res) {
			var param = "&type=7&stocklist="+req.query.stocks;
			requestRemoteSelfStock(param,req,res); 
		};
		
		this.download = function(req,res) {
			var param = "&type=8";
			requestRemoteSelfStock(param,req,res);
		};
		
		this.multi = function(req,res) {
			var param = "&type=9&stocklist="+req.query.stocks;
			requestRemoteSelfStock(param,req,res);  		
		};
		
		this.wlan = function(req,res) {
			var bephone=req.query.msisdn_before;
			var afphone=req.query.msisdn_after;
			
		};
};

exports.createSelfProxyStock =function(settings,logger){
	return new SelfProxyStock(settings,logger);
}