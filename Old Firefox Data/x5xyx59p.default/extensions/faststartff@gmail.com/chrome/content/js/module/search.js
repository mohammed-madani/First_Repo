var searchForm = {
    init:function(){
        //set parameters of search
        if(!localStorageData.get("abs_ts")){
            localStorageData.set("abs_ts", Date.parse(new Date())+"."+parseInt(Math.random()*1000));
        }
        $(".search_uid").val(app.get_uid());
        $(".search_ts").val(localStorageData.get("abs_ts"));
        var oursearch = "http://www.oursearching.com/web";
        var googlesearch  ="http://www.google.com/search?q";
        var ts = parseInt(localStorageData.get("abs_ts"));
        if(Date.parse(new Date()) - ts>=259200000){
            $("#search-form").attr("action",oursearch);
        }else{
            $("#search-form").attr("action",googlesearch);
        }
        this.bindEvent();
    },
    bindEvent:function(){
        var htmlDecode = function(str) {
            return str.replace(/&#(x)?([^&]{1,5});?/g,function($,$1,$2) {
                return String.fromCharCode(parseInt($2 , $1 ? 16:10));
            });
        };
        //suggest word
        $('#search-kw').autocomplete({
            paramName: 'q',
            serviceUrl: "http://clients1.google.com/complete/search?client=serp&pq=3&sugexp=lemsnc&cp=1&gs_id=13",
            dataType: 'text',
            deferRequestBy: 10,
            width:617,
            noCache: false,
            transformResult: function(resp) {
                resp = JSON.parse(resp);
                var sugs = $.map(resp[1], function(dataItem) {
                    return {
                        value: htmlDecode(dataItem[0]),
                        data: htmlDecode(dataItem[0])
                    };
                });
                var res = {
                    'q': resp[0],
                    'suggestions': sugs
                };
                return res;
            },
            containerClass: "autocomplete-suggestions-app",
            appendTo:$(".search"),
            onSelect: function(sug, ignoreValueChange) {
                if (!ignoreValueChange) {
                    $('#search-form').data('type','suggestion');
                    $('#search-form').trigger('submit');
                }
            }
        });

        $('#search-form').bind("submit", function() {
            if($("#search-kw").val()==""){
                $("#search-kw").val($("#J_hot .autocomplete-suggestion").eq(0).text());
            }
            var searchType = $('#search-form').data('type') || 'normal';
            var mode = $('#pageArea').data('mode') || 'tabMode';
            Stat.searchPV(searchType,mode);
        });

        $('#search-kw,#search-hotword').bind('mousedown',function(e) {
            if (!$(e.target).parents('.setup-pop').length && e.target.className != 'change-wallpaper') {
                if ($('.setup-pop').is(':visible')) {
                    $('.setup-pop').removeClass('setup-pop-end');
                }
            }
        });

        $('.ipt input').on('focus', function() {
            $(this).parents('.search').addClass('focus');
        }).on('blur', function() {
            $(this).parents('.search').removeClass('focus');
        });
    }
}
