(function(){if(!window.XA){XA={_url:"http://xa.xingcloud.com/v4/",_actions:[],_updates:[],_sending:false,init:function(option){if(!option.app){throw new Error("App is required.")}XA._app=option.app;XA._uid=option.uid||"random"},setUid:function(uid){XA._uid=uid},action:function(){for(var i=0,l=arguments.length;i<l;i++){XA._actions.push(arguments[i])}XA._asyncSend()},update:function(){for(var i=0,l=arguments.length;i<l;i++){XA._updates.push(arguments[i])}XA._asyncSend()},_asyncSend:function(){setTimeout(function(){var rest=XA._url+XA._app+"/"+XA._uid+"?",item=null,strItem="",index=0,length=XA._updates.length+XA._actions.length;if(length==0||XA._sending){return}XA._sending=true;while(item=XA._updates.shift()){strItem="update"+index+++"="+encodeURIComponent(item)+"&";if(rest.length+strItem.length>=1980){XA._updates.unshift(item);break}else{rest=rest+strItem}}index=0;while(item=XA._actions.shift()){strItem="action"+index+++"="+encodeURIComponent(item)+"&";if(rest.length+strItem.length>=1980){XA._actions.unshift(item);break}else{rest=rest+strItem}}(new Image()).src=rest+"_ts="+new Date().getTime();if(XA._updates.length+XA._actions.length>0){XA._asyncSend()}XA._sending=false},0)}}}})();

var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-46199151-1"]);
_gaq.push(["_trackPageview"]);

(function() {
    var ga = document.createElement("script");
    ga.type = "text/javascript";
    ga.async = true;
    ga.src = "chrome://quick_start/content/js/pack/ga.js";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(ga, s)
})();

function get_tab_ts(){
    return localStorageData.get_localFile("tab_ts");
}

function get_locale(){
    var _language = window.navigator;
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService).getBranch("general.useragent.");
    _language = prefs.getCharPref('locale').toLowerCase();
    return _language;
}

function getRequest(name) {
   var url = decodeURI(window.location.hash); /*获取url中"#"符后的字串*/
   var theValue = ""; 
   var strs = url.split("#");      
   theValue=strs[1];
   return theValue;
}
/*初始化统计*/
(function(){
	/*如果获取不到uid，退出行云统计*/
	if(!XA) return;
    var appid = "quick-start";
    $(document).ready(function(){
		XA.init({app: appid, uid: app.get_uid() });
		XA.action('visit.main');
		XA.update('version,'+ app.version);
        var xaCountry = localStorageData.get('set_country');
		if(xaCountry){
			XA.update('nation,' + xaCountry);
		}else{
            XA.update('nation,' + get_locale());
        }
        XA.update('language,' + window.navigator.language);
        XA.update("platform,firefox");
        XA.update('ref1,'+ app.get_ptid());
        var rv = navigator.userAgent.toLowerCase().split(' ');
        XA.update('ref,'+ rv[rv.length-1]);
        var userInfo = navigator.userAgent.replace(/\(|\)/gi,";");
        var userInfoArray = navigator.userAgent.replace(/\(|\)/gi,";").split(";");
        //获取判断操作系统的版本
        if(userInfo.indexOf("Windows")>=0){
            for (var i = 0; i < userInfoArray.length; i++) {
                if(userInfoArray[i].indexOf("Windows") >= 0){
                    switch (userInfoArray[i])
                    {
                        case "Windows NT 6.3":
                            XA.update("ref0, Windows 8.1");
                            break;
                        case "Windows NT 6.2":
                            XA.update("ref0, Windows 8");
                            break;
                        case "Windows NT 6.1":
                            XA.update("ref0, Windows 7");
                            break;
                        case "Windows NT 6.0":
                            XA.update("ref0, Windows Vista");
                            break;
                        case "Windows NT 5.2":
                            XA.update("ref0, Windows XP");
                            break;
                        case "Windows NT 5.1":
                            XA.update("ref0, Windows XP");
                            break;
                        case "Windows NT 5.0":
                            XA.update("ref0, Windows 2000");
                            break;
                        default:
                            XA.update("ref0,"+userInfoArray[i]);
                    }
                }
            }
        }else if(userInfo.indexOf("Macintosh")>=0 || userInfo.indexOf("Mac")>=0){
            XA.update("ref0, Mac OS");
        }else if(userInfo.indexOf("Linux")>=0){
            XA.update("ref0, Linux");
        }else{
            XA.update("ref0, Other");
        }

        //获取屏幕分辨率
        if(window.screen){
            XA.update("ref2,"+screen.width + '×' + screen.height);
        }
        XA.update();
	});
})();

// google和行云统计打点方法封装
function postPoint(obj){
	var gatag = obj.gatag;
	var xatag=obj.xatag;
	value=obj.value||0;
	if (gatag && typeof gatag == "object") {
		_gaq.push(["_trackEvent", gatag[0], gatag[1], gatag[2], value]);
	}
	if(xatag && typeof xatag =="object"){
		var tagsTring=xatag.join(".");
		window.XA && XA.action('pay.' + tagsTring+ ',' + value);
	}
}