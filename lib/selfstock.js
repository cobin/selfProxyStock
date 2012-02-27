var request = require('request');

var SelfProxyStock = function(settings,logger){
		var _self = this;
	  this.selfstock = settings.selfstock;
	  this.logger = logger;

		var requestRemoteSelfStock=function(param,req,res,ntype){			
			request({ uri:_self.selfstock.fakecodeurl+req.params.fakecode, timeout:10000 }, function (error, response, body) {
				 if(error ||  response.statusCode != 200) {
				 		console.log(["request-error",_self.selfstock.fakecodeurl,req.params.fakecode,error?error:response.statusCode]); 
				 		res.send('{"error":"伪码异常","result":null}');
				 }else{
						var msisdn = body;
						if(body==null || body.length<11){
							console.log(["mobile-error",body]); 
				 			res.send('{"error":"无效的手机号码","result":null}');
						}else{
							var sUrl = _self.selfstock.url[parseInt(Math.random()*_self.selfstock.url.length)]+_self.selfstock.query;
							sUrl+="?msisdn="+msisdn+param;
							request({ uri:sUrl, timeout:30000 }, function (error, response, body) {
						      if(error || response.statusCode != 200) {
						          console.log(["request-error",sUrl,error?error:response.statusCode]); 
						          res.send('{"error":"获取自选股失败","result":null}');
						      } else {
						          try {
						          	logger.info(["info",msisdn,param,"remote:"+body]);
						          	console.log(["proxy-info",req.params.fakecode,msisdn,body]);						          	
						          	var sStr = '{"error":null,"result":[';
						          	var isNext = false;
						          	if(ntype==1){
						          		var sCode = body.split(",");
						          		for(var im=0;im<sCode.length;im++){
						          			if(sCode[im].length>2){
							          			if(isNext) sStr+=",";
							          			sStr +='"'+sCode[im]+'"';
							          			isNext = true;
						          			}	
						          		}
						          	}else{
						          		var _stockCode = ","+body+",";
						          		var sCode = req.query.stocks.split(",");
						          		for(var im=0;im<sCode.length;im++){
							          		if(sCode.length>2){	
							          			if(isNext) sStr+=",";
							          			sStr +='{"sotckcode":"'+sCode[im]+'","status":"';	
							          			if(_stockCode.indexOf(","+sCode[im]+",")!=-1){
							          				sStr+='success';
							          			}else{
							          				sStr+='fail';
							          			}
							          			sStr+='"}';
							          			isNext = true;
							          		}
						          		}
						          	}
						          	sStr +=']}';
						            res.send(sStr);
						          } catch(err) {
						            console.log(["try-error",sUrl,err]);
						            res.send('{"error":"处理自选股异常","result":null}');
						          }
						      }
						  });	
						}
				}
			});	
		}
		
		this.query = function(req,res) {
			var param = "&type=1";
		  requestRemoteSelfStock(param,req,res,1);  
		};
		
		this.add = function(req,res) {
			var param = "&type=2&stocklist="+req.query.stocks;
		  requestRemoteSelfStock(param,req,res,2);  
		};
		
		this.delete = function(req,res) {
			var param = "&type=3&stocklist="+req.query.stocks;
			requestRemoteSelfStock(param,req,res,1);  
		};
		
		this.clear = function(req,res) {
			var param = "&type=4";
			requestRemoteSelfStock(param,req,res,1);  		  
		};
		
		this.upload = function(req,res) {
			var param = "&type=7&stocklist="+req.query.stocks;
			requestRemoteSelfStock(param,req,res,2); 
		};
		
		this.download = function(req,res) {
			var param = "&type=8";
			requestRemoteSelfStock(param,req,res,1);
		};
		
		this.multi = function(req,res) {
			var param = "&type=9&stocklist="+req.query.stocks;
			requestRemoteSelfStock(param,req,res,2);  		
		};
		
		this.wlan = function(req,res) {
			var bephone=req.query.msisdn_before;
			var afphone=req.query.msisdn_after;
			
		};
};

exports.createSelfProxyStock =function(settings,logger){
	return new SelfProxyStock(settings,logger);
}