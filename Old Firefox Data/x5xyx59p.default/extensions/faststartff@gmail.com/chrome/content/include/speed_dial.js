Components.utils.import("resource://quick_start.modules/misc.js");
Components.utils.import("resource://quick_start.modules/settings.js");
Components.utils.import("resource://quick_start.modules/addonmanager.js");
Components.utils.import("resource://quick_start.modules/properties.js");


var fvd_speed_dial_speedDialSSD = {
    init: function(){
        this.registry = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("fvd.sd.");
    },
	uninit: function(){
		try{
			var container = gBrowser.tabContainer;
			container.removeEventListener("TabSelect", this._tabSelectListener, false);
			container.removeEventListener("TabClose", this._tabCloseListener, false);

			fvd_speed_dial_gFVDSSDSettings.removeObserver( fvd_speed_dial_sd_prefObserverInst );
			fvd_speed_dial_gFVDSSDSettings.removeObserver( fvd_speed_dial_sd_prefObserverInst, "browser." );
			for( var i = 0; i != this.childWindows.length; i++ ){
				try{
					this.childWindows[i].close();
				}
				catch( ex ){
				}
			}

			this.observer.notifyObservers(null, "FVD.Toolbar-SD-Dial-Page-Closed", this.id);
		}
		catch( ex ){

		}
	},
	changeCustomSize: function(){
		fvd_speed_dial_gFVDSSDSettings.displayWindow( "change_custom_size" );
	}
};



