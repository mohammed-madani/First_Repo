var fvd_speed_dial_gFVDSSDAboutBlankHook = {
	
	aboutBlankUrl: "chrome://quick_start/content/index.html",
	
	aboutBlankReplaced: false,
	initialPagesUpdated: false,
	defaultNewTabHandler: window.BrowserOpenTab,
	defaultTMP_BrowserOpenTab: window.TMP_BrowserOpenTab,
	
	_original_BrowserOnAboutPageLoad: window.BrowserOnAboutPageLoad,
	
	_tabLoadListener: function(){
			
		if( gBrowser.contentDocument.location.href == "about:newtab" ){
			gBrowser.contentDocument.location.href = fvd_speed_dial_gFVDSSDAboutBlankHook.aboutBlankUrl;
		}
		
	},
	
	setupInitialPages: function(){
		if( !this.initialPagesUpdated ){
			if ('gInitialPages' in window && window.gInitialPages instanceof Array){
				window.gInitialPages.push( this.aboutBlankUrl );
			}
			this.initialPagesUpdated = true;
		}
	},
	
	replaceAboutBlank: function(){
		
		document.getElementById( "appcontent" ).addEventListener("DOMContentLoaded", this._tabLoadListener, true);
		
		var browserRoot = fvd_speed_dial_gFVDSSDSettings.branch("browser.");
		browserRoot.setCharPref( "newtab.url", "chrome://quick_start/content/index.html" );
			if( window.BrowserOpenTab == this.newTabHandler ){
				return;
			}		
				
			if(window.TMP_BrowserOpenTab){
				// compatibility with tabMix
				window.TMP_BrowserOpenTab = this.newTabHandler;
			}
			window.BrowserOpenTab = this.newTabHandler;

	},
	
	restoreAboutBlank: function(){
		
		document.getElementById( "appcontent" ).removeEventListener("DOMContentLoaded", this._tabLoadListener, true);
		
		var browserRoot = fvd_speed_dial_gFVDSSDSettings.branch("browser.");

			var browserRoot = fvd_speed_dial_gFVDSSDSettings.branch("browser.");
			
			if( browserRoot.getCharPref( "newtab.url" ) == this.aboutBlankUrl ){
				browserRoot.clearUserPref( "newtab.url" );	
			}

			if( window.BrowserOpenTab != this.newTabHandler ){
				return;
			}		

			if(window.TMP_BrowserOpenTab){
				// compatibility with tabMix
				window.TMP_BrowserOpenTab = this.defaultTMP_BrowserOpenTab;
			}
	
			// simple replace native browser function
			window.BrowserOpenTab = this.defaultNewTabHandler;
	},
	
	newTabHandler: function(){
		// open new tab
		try{			
		    if (!gBrowser) {
		        window.openDialog(fvd_speed_dial_gFVDSSDAboutBlankHook.aboutBlankUrl, "_blank", "chrome,all,dialog=no", "about:blank");
		        return;
		    }
		    gBrowser.loadOneTab(fvd_speed_dial_gFVDSSDAboutBlankHook.aboutBlankUrl, {inBackground: false});
		    focusAndSelectUrlBar();			
		}
		catch( ex ){
		}

	}
}
