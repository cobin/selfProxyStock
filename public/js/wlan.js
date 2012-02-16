$(document).ready(function() {
	
});
var wlanSubmit=function(obj){
	var param = "?";
	var sprefix=obj.id;
	$.each(obj,function(f,v){
		if(v.type != "submit" && v.name!=""){
			if(param.length>1) param+="&";
			param+=(v.name+"="+v.value);
		}
	});
	wlanAjax(obj.action+param,function(json){				
		if(sprefix=="out"){
			$("#outmsg").html("<font color=red>Exit Success</font>");
		}else if(sprefix=="stockadd"){
			 $("#"+sprefix+"msg").html("添加<<font color=red>"+json.status[0].sc+"</font>>成功.");
		}else if(sprefix=="stockremove"){
			 $("#"+sprefix+"msg").html("删除<<font color=red>"+json.status[0].sc+"</font>>成功.");
		}else if(sprefix=="stocklist"){
			 $("#"+sprefix+"msg").html("列表<<font color=red>"+json.reason+"</font>>.");
		}else{
			$.each(json,function(f,v){
				if(f.indexOf("session")!=-1){ $("#"+sprefix+"session").val(v);}
				else if(f.indexOf("captcha")!=-1){$("#"+sprefix+"code").val(v);}
				else if(f.indexOf("message")!=-1) {alert(v);}
			});	
		}
	});
	return false;
}

var wlanAjax=function(url,cb){
	//alert(url);
	$.ajax({
  		type: "GET",  		
  		url:url,
  		beforeSend:function(xhr){     			
  			xhr.setRequestHeader('x-guid','A497F2472C897D9238a4695487744477ad');
  		},
  		 cache: false,
  		 dataType:'text',
  			success: function(msg){
  				//alert(msg);
  				if(msg.indexOf("{")!=-1){	
  					try{
		  				var json = $.parseJSON(msg);  				
		  				if(json.result=="SUCCESS"){
								if(typeof(cb)=="function"){ 
									cb(json);
								}else{
									var s = "(X)";
			  					$.each(json,function(f,v){
			  						s+=v+",";  						
			  					});
			  					alert(s);
								}
							}else{
								var s = "(Y)";
		  					$.each(json,function(f,v){
		  						if(typeof(v)=="object"){
		  							s += msg;
		  							return false;
		  						}else
		  							s+=v+",";  						
		  					});
		  					alert(s);						
							}  
						}catch(e){
							alert(msg);	
						}
					}else{
						alert(msg);
					}				
		   }
  		});
}