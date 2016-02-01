var siteGrid = {
    init: function () {
        this.grid();
        this.xaClick();
    },
    grid: function () {
        var dataObj = this.getHistorySite();
        var tmpl = document.getElementById('website-grid').innerHTML;
        var doTtmpl = doT.template(tmpl);
        //console.log(doTtmpl(dataObj));
        //$('#gridBox').html(doTtmpl(dataObj));
        for(var i=0;i<8;i++){
            //console.log(dataObj[i]);
            //console.log(doTtmpl(dataObj[i]));
            $('#gridBox').append(doTtmpl(dataObj[i]));
        }
    },
    getHistorySite: function () {
        function getHistoryByTime(days) {
            var historySvc = Components.classes["@mozilla.org/browser/nav-history-service;1"].getService(Components.interfaces.nsINavHistoryService);
            if (days == null || days == undefined) {
                days = 7;
            }
            var list = new Array();
            var query = historySvc.getNewQuery();

            query.searchTerms = "firefox";
            var query2 = historySvc.getNewQuery();

            query2.beginTimeReference = query2.TIME_RELATIVE_NOW;
            query2.beginTime = -24 * parseInt(days) * 60 * 60 * 1000000;
            query2.endTimeReference = query2.TIME_RELATIVE_NOW;
            query2.endTime = 0;
            var options = historySvc.getNewQueryOptions();

            options.sortingMode = historySvc.SORT_BY_VISITCOUNT_DESCENDING;
            options.queryType = historySvc.QUERY_TYPE_HISTORY;
            options.maxResults = 10;
            options.resultType = historySvc.RESULTS_AS_VISIT;
            var result = historySvc.executeQueries([query, query2], 2, options);
            var cont = result.root;
            cont.containerOpen = true;
            for (var i = 0; i < cont.childCount; i++) {
                var node = cont.getChild(i);
                if (node != null && node != undefined) {
                    if (node.uri && !node.uri.indexOf("file") == 0) {
                        var entry = {
                            title: node.title == null ? node.uri : node.title,
                            pic: 'http://icon.lightningnewtab.com/v4_logo/' + ANURL(node.uri).host.replace('www.', '') + '.png',
                            icon: node.icon,
                            url: node.uri
                        };
                        list.push(entry);
                    }
                }
            }
            cont.containerOpen = false;
            return list;
        }
        var data = getHistoryByTime(1);
        console.log(data);
        return data;
    },
    xaClick:function(){
        $('#gridBox li a[href]').bind('click', function(e) {
            var xaname = ANURL($(this).attr("href")).host.replace(/\./g, "_");
            postPoint({
                "xatag": ["click", "sites", xaname],
                "gatag": ["click", "sites", xaname],
                "varlue": 0
            });
        });
    }
};




