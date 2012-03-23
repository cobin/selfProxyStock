var request = require('request');

var SelfProxyStock = function(settings,logger){
		var _self = this;
		this.selfstock = settings.selfstock;
		this.logger = logger;

		var requestRemoteSelfStock=function(param,req,res,ntype){
			request({ uri:_self.selfstock.fakecodeurl+req.params.fakecode, timeout:10000 }, function (error, response, body) {
				var msisdn = req.params.fakecode;
				var next = true;
				if(error ||  response.statusCode != 200) {
					console.log(["request-error",_self.selfstock.fakecodeurl,req.params.fakecode,error?error:response.statusCode]);
				}else{
					if(body){
						try{
							var json = JSON.parse(body);
							if(!json.error){
								if(json.msisdn===null || json.msisdn.length<11){
									console.log(["mobile-error",req.params.fakecode,body]);
								}else{
									msisdn = json.msisdn;
								}
							}
						}catch(e){
								console.log(["mobile-ERR",req.params.fakecode,e]);
						}
					}
				}
					
				if(next){
					var sUrl = _self.selfstock.url[parseInt(Math.random()*_self.selfstock.url.length,10)]+_self.selfstock.query;
					sUrl+="?msisdn="+msisdn+param;
					request({ uri:sUrl, timeout:30000 }, function (error, response, body) {
						console.log(["INFO",sUrl,error,body]);
						if(error || response.statusCode != 200) {
							console.log(["request-error",sUrl,error?error:response.statusCode]);
							res.send('{"error":"获取自选股失败","result":null}');
						} else {
							try {
								logger.info(["info",msisdn,param,"remote:"+body]);
								console.log(["proxy-info",req.params.fakecode,msisdn,body]);
								var sStr = '{"error":null,"result":[';
								if(body){
									var isNext = false;
									var sCode;
									var im;
									if(ntype===1){
										sCode = body.split(",");
										for(im=0;im<sCode.length;im++){
											if(sCode[im].length>2){
												if(isNext) sStr+=",";
												sStr +='"'+sCode[im]+'"';
												isNext = true;
											}
										}
									}else{
										var _stockCode = ","+body+",";
										sCode = req.query.stocks.split(",");
										for(im=0;im<sCode.length;im++){
											if(sCode[im].length>2){
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
				
			});
		};
		
		this.query = function(req,res) {
			var param = "&type=1";
			requestRemoteSelfStock(param,req,res,1);
		};
		
		this.add = function(req,res) {
			var param = "&type=2&stocklist="+req.query.stocks;
			requestRemoteSelfStock(param,req,res,2);
		};
		
		this.deletes = function(req,res) {
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

		this.sync = function(req,res){
			var msisdn = req.params.fakecode;
			var param = "&type=1";
			var sUrl = _self.selfstock.url[parseInt(Math.random()*_self.selfstock.url.length,10)]+_self.selfstock.query;
			//sUrl+="?msisdn="+msisdn+param;
			request({ uri:sUrl+"?msisdn="+msisdn+param, timeout:30000 }, function (error, response, body) {//请求获取伪码对应的股票列表
				if(error || response.statusCode != 200) {
					console.log(["request-error-1",sUrl,msisdn,error?error:response.statusCode]);
					res.send('{"error":"获取自选股失败","result":null}');
				} else {
					if(body && body.length>5){
						msisdn = req.query.msisdn;
						var fstocks = body.replace(/,{1,}$/g,'').replace(/^,{1,}/g,'');//得到伪码对应的股票代码列表
						param = "&type=1";
						console.log(["INFO-FAKE-Query",req.params.fakecode,msisdn,fstocks]);
						request({ uri:sUrl+"?msisdn="+msisdn+param, timeout:30000 }, function (error, response, body) {//请求获取手机号码对应的股票列表
							if(error || response.statusCode != 200) {
								console.log(["request-error-2",sUrl,msisdn,error?error:response.statusCode]);
								res.send('{"error":"获取自选股失败","result":null}');
							} else {
								var mstocks=body.replace(/,{1,}$/g,'').replace(/^,{1,}/g,'').split(',');//得到手机号码对应的股票列表
								var mfstocks = ','+fstocks+',';
								for(var j=0;j<mstocks.length;j++){
									mfstocks = mfstocks.replace(","+mstocks[j]+",",",");
								}
								mfstocks = mfstocks.replace(/,{1,}$/g,'').replace(/^,{1,}/g,'');
								param = "&type=2&stocklist="+mfstocks;
								console.log(["INFO-FAKE-Add",req.params.fakecode,msisdn,mfstocks]);
								request({ uri:sUrl+"?msisdn="+msisdn+param, timeout:30000 }, function (error, response, body) {
									if(error || response.statusCode != 200) {
										console.log(["request-error-2",sUrl,error?error:response.statusCode]);
										res.send('{"error":"获取自选股失败","result":null}');
									} else {
										msisdn = req.params.fakecode;
										param = "&type=3&stocklist="+fstocks;
										request({ uri:sUrl+"?msisdn="+msisdn+param, timeout:30000 }, function (error, response, body) {
											if(error || response.statusCode != 200) {
												console.log(["request-error-2",sUrl,error?error:response.statusCode]);
												res.send('{"error":"获取自选股失败","result":null}');
											} else {
												res.send('{"error":null,"result":"OK"}');
											}
										});
									}
								});
							}
						});
					}else{
						res.send('{"error":null,"result":null}');
					}
				}
			});
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
};