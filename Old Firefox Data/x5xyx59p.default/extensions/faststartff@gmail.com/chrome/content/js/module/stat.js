var Stat = {
    init: function() {
        this.bindClickPV();
        this.screenPV(this.getScreen());
    },
    searchPV: function(type,mode) {
        postPoint({
            "xatag": ["search", "submit",type,mode],
            "gatag": ["search", "submit", type],
            "varlue": 0
        });
    },
    screenPV: function(pageId) {
        var filename;
        switch (pageId) {
            case 'mosts':
                postPoint({
                    "xatag": ["showPages", "mosts"],
                    "gatag": ["showPages", "mosts", "all"],
                    "varlue": 0
                });
                break;
            case 'customs':
                postPoint({
                    "xatag": ["showPages", "customs"],
                    "gatag": ["showPages", "customs", "all"],
                    "varlue": 0
                });
                break;
            case 'games':
                postPoint({
                    "xatag": ["showPages", "games"],
                    "gatag": ["showPages", "games", "all"],
                    "varlue": 0
                });
                break;
            case 'shopping':
                postPoint({
                    "xatag": ["showPages", "shopping"],
                    "gatag": ["showPages", "shopping", "all"],
                    "varlue": 0
                });
                break;
        }
        if (filename) {
            this.send(filename);
        }
    },
    bindClickPV: function() {
        var self = this;
        $('.page-list > .page a[href]').live('mouseup', function(e) {
            var xaname = ANURL($(this).attr("href")).host.replace(/\./g, "_");
            var actLink = $(this).attr("href");
            if (e.button == 0 || e.button == 1) {
                if (!$(e.target).hasClass('pin') && !$(e.target).hasClass('remove')&&!$(e.target).hasClass('edit')) {
                    if(googleSearchShow.judgeGoogle(actLink)){
                        postPoint({
                            "xatag": ["click", "sites", "google_search"],
                            "gatag": ["click", "sites", "google_search"],
                            "varlue": 0
                        });
                    }else{
                        postPoint({
                            "xatag": ["click", "sites", xaname],
                            "gatag": ["click", "sites", xaname],
                            "varlue": 0
                        });
                    }
                } else {
                    if ($(e.target).hasClass('pin')) {
                        postPoint({
                            "xatag": ["click", "pin", xaname],
                            "gatag": ["click", "pin", xaname],
                            "varlue": 0
                        });
                    } else if ($(e.target).hasClass('remove')) {
                        postPoint({
                            "xatag": ["click", "remove", xaname],
                            "gatag": ["click", "remove", xaname],
                            "varlue": 0
                        });
                    }else if($(e.target).hasClass('edit')){
                        postPoint({
                            "xatag": ["click", "edit", xaname],
                            "gatag": ["click", "edit", xaname],
                            "varlue": 0
                        });
                    }
                }
            }
        });
        $(".feedback").bind("click",function(){
            postPoint({
                "xatag": ["click", "rightbottom_buttion", "feedback"],
                "gatag": ["click", "rightbottom_buttion", "feedback"],
                "varlue": 0
            });
        });
        $(".giveComment").bind("click",function(){
            postPoint({
                "xatag": ["click", "rightbottom_buttion", "comment"],
                "gatag": ["click", "rightbottom_buttion", "comment"],
                "varlue": 0
            });
        });
    },
    addUrlPV: function(type) {
        if (!type) type = "select";
        postPoint({
            "xatag": ["add", "sites", type,url],
            "gatag": ["add", "sites", type],
            "varlue": 0
        });
    },
    getScreen: function() {
        var pageId;
        try {
            pageId = ($('.sliders>a.selected').attr('class').replace('selected', '').replace(/\s+/g, ''));
        } catch (e) {}
        return pageId;
    },
    send: function(filename) {
        //window._stat_request = new Image();
        // _stat_request.src = 'http://dd.browser.360.cn/static/a/' + filename + (filename.indexOf('?') > -1 ? '&' : '?') + Date.now() + Math.random().toString().replace('0.', '').substr(0, 10);
    }
};

$(window).on('newpages:firstPageOnLoad', function() {
    Stat.init()
});