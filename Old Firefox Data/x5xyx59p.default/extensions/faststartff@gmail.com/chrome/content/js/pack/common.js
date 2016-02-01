Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");

//Local Language Function
    var getI18nMsg = function(msgname) {
        //newTab plus Properties
        var newtabplsuProperties = {
            _bundles: {},

            _bundle: function (file) {
                if (!(file in this._bundles)) {
                    try {
                        this._bundles[file] = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://quick_start/locale/' + file + '.properties');
                    } catch (ex) {
                        return null;
                    }
                }

                return this._bundles[ file ];
            },

            getString: function (file, string) {
                var bundle = this._bundle(file);
                if (!bundle) {
                    return null;
                }
                var txt;
                try {
                    txt = bundle.GetStringFromName(string);
                }
                catch (ex) {
//				console.log( "Fail get " + string + " from " + file + "("+ex+")\r\n" );
                    txt = string;
                }
                return txt;
            },

            getIterator: function (file) {
                var bundle = this._bundle(file);
                if (!bundle) {
                    return null;
                }
                return bundle.getSimpleEnumeration();
            },
            getLocale: function () {
                var nav = window.navigator;
                var _language = "en";
                if (typeof nav.language == "undefined" && typeof nav.browserLanguage == "undefined") {
                    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService).getBranch("general.useragent.");
                    _language = prefs.getCharPref('locale').toLowerCase();
                } else {
                    // With the HTML language page judgment standard
                    var _languages = (typeof nav.language == "undefined" ? nav.browserLanguage : nav.language).split("-");
                    _language = _languages[0].toLowerCase();
                    if (_languages.length > 1) {
                        _language = _languages[0].toLowerCase() + "-" + _languages[1].toUpperCase();
                    }
                }
                return _language;
            }
        }
        try {
            return newtabplsuProperties.getString("locale", msgname);
        } catch (err) {
            return msgname;
        }
    };

    var localStorageData = {
        get_localFile:function(key){
            var result = "";
            try {
                var file = FileUtils.getFile("ProfD", ["lightning.sqlite"]);
                if (file.exists()) {
                    var dbConn = Services.storage.openDatabase(file);
                    var statement = dbConn.createStatement("SELECT value from  lightnings where name = '" + key + "'");
                    if (statement.executeStep()) {
                        result = statement.row.value;
                    }
                } else {
                    var dbConn = Services.storage.openDatabase(file);
                    dbConn.executeSimpleSQL("CREATE TABLE lightnings (name varchar(100),value text )");
                }
                statement.reset();
                statement.finalize();
                dbConn.close();
                return result;
            } catch (e) {
            }
            return result;
        },
        set_localFile:function(key, value) {
            if (typeof value == 'string' || value instanceof String) {
                value = value.replace(/\'/g, "");
            }
            try {
                var file = FileUtils.getFile("ProfD", ["lightning.sqlite"]);
                var dbConn = Services.storage.openDatabase(file);
                if (file.exists()) {
                    if (this.get_localFile(key) == undefined || this.get_localFile(key) == "") {
                        var sql = "INSERT INTO lightnings(name,value) values('" + key + "','" + value + "')";
                        dbConn.executeSimpleSQL(sql);
                    } else {
                        var sql = "UPDATE lightnings set value = '" + value + "' where name = '" + key + "'";
                        dbConn.executeSimpleSQL(sql);
                    }
                }
                dbConn.close();
            } catch (e) {
    //        console.error(e);
            }
    },
        del_localFile:function(key) {
            try {
                var file = FileUtils.getFile("ProfD", ["lightning.sqlite"]);
                if (file.exists()) {
                    var dbConn = Services.storage.openDatabase(file);
                    var sql = "DELETE FROM lightnings where name = '" + key + "'";
                    dbConn.executeSimpleSQL(sql);
                    dbConn.close();
                }
            }catch (e) {
            }
    },
        get: function (dataKey) {
            return this.get_localFile(dataKey);
        },
        set: function (key, value) {
            this.set_localFile(key, value);
        },
        remove: function (key) {
            this.del_localFile(key);
        }
    };

    var storage = {
        get: function (key) {
            try {
                return JSON.parse(localStorageData.get(key) || '{}');
            } catch (e) {
                return {};
            }
        },
        set: function (key, subkey, val) {
            var data = this.get(key);
            data[subkey] = val;
            localStorageData.set(key, JSON.stringify(data));
        }
    };

//Get Now Time //2014022011
    var getNowTime = {
        hour: function () {
            var d = new Date();
            var nowTimeDec = d.getFullYear().toString() + this._checkTime(d.getMonth() + 1).toString() + this._checkTime(d.getDate()).toString() + this._checkTime(d.getHours()).toString();
            return nowTimeDec;
        },
        date: function () {
            var d = new Date();
            var nowTimeDec = d.getFullYear().toString() + this._checkTime(d.getMonth() + 1).toString() + this._checkTime(d.getDate()).toString();
            return nowTimeDec;
        },
        _checkTime: function (i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    };

// Extend $.live() function
(function($) {
    $.extend($.fn, {
        live: function(event, fn) {
            $(document).delegate(this.selector, event, fn);
            return this;
        },
        die: function(event, fn) {
            $(document).undelegate(this.selector, event, fn);
            return this;
        },
        swap: function(b) {
            b = $(b)[0];
            var a = this[0];
            if (a && b) {
                var t = a.parentNode.insertBefore(document.createTextNode(''), a);
                b.parentNode.insertBefore(a, b);
                t.parentNode.insertBefore(b, t);
                t.parentNode.removeChild(t);
            }
            return this;
        }
    });
})($);

// www function
var ANURL = function(url) {
    if (typeof url == 'undefined') {
        url = location.href;
    }
    if (url.indexOf("http://goo.gl/") == 0 || url.indexOf("http://goo.mx/") == 0) {
        if (transforURl[url]) {
            url = transforURl[url];
        }
    }
    var segment = url.match(/^(\w+\:\/\/)?([\w-\d]+(?:\.[\w-]+)*)?(?:\:(\d+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/);
    if (!segment[3]) {
        segment[3] = '80';
    }
    var param = {};
    if (segment[5]) {
        var pse = segment[5].match(/([^=&]+)=([^&]+)/g);
        if (pse) {
            for (var i = 0; i < pse.length; i++) {
                param[pse[i].split('=')[0]] = pse[i].split('=')[1];
            }
        }
    }
    return {
        url: segment[0],
        sechme: segment[1],
        host: segment[2],
        port: segment[3],
        path: segment[4],
        queryString: segment[5],
        fregment: segment[6],
        param: param
    };
};

var app ={
    version:'4.3.0',
    get_uid:function() {
        var uid;
        try {
            if (localStorageData.get_localFile("uid") && (localStorageData.get_localFile("uid") != 'undefined')) {
                uid = localStorageData.get_localFile("uid");
            } else {
                uid = this.getEntry(this.APP_DATA_REGISTREY_PATH, this.APP_DATA_UID_KEY);
                if ((!uid) || (uid == 'undefined')) {
                    uid = this.generateGUID().replace(/{|}/g, "");
                }
                localStorageData.set_localFile("uid", uid);
            }
        } catch (e) {
            uid = this.generateGUID().replace(/{|}/g, "");
            localStorageData.set_localFile("uid", uid);
        }
        return uid;
    },
    get_ptid:function() {
        try {
            var ptid = this.getEntry(this.APP_DATA_REGISTREY_PATH, this.APP_DATA_PTID_KEY);
            if (ptid == null || ptid == undefined) {
                ptid = "firefox";
            }
        } catch (e) {
        }
        return ptid;
    },
    generateGUID:function() {
        var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
            .getService(Components.interfaces.nsIUUIDGenerator);
        return uuidGenerator.generateUUID().toString();
    },
    getEntry:function(path, key) {
        var value;
        try {
            var wrk = Components.classes["@mozilla.org/windows-registry-key;1"].createInstance(Components.interfaces.nsIWindowsRegKey);
            wrk.open(wrk.ROOT_KEY_CURRENT_USER, path, wrk.ACCESS_READ);
            value = wrk.readStringValue(key);
            wrk.close();
            return value;
        } catch (e) {
            //        console.error(e);
        }
        return value;
    },
    APP_DATA_REGISTREY_PATH:"SOFTWARE\\Mozilla\\Extends",
    APP_DATA_UID_KEY:"uid",
    APP_DATA_PTID_KEY:"ptid"
};

var conf = {
    country: localStorageData.get('set_country') || "us",
    //country: "tw",
    vtime: new Date().getFullYear().toString()+new Date().getMonth().toString()+new Date().getDate().toString(),
    uid:app.get_uid(),
    browser:"firefox"
};

