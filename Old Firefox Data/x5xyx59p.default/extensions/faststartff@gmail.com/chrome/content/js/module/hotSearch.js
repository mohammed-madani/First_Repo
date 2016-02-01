var TheHotsearch=(function(){
    var suggestionBox = $('#J_hot .autocomplete-suggestion');
    var getHotword=function(first){
        $.get("http://107.170.66.153/newtab_trends_items?country_code="+conf.country, function(data){
            var _data=JSON.parse(data);
            localStorageData.set("hotsearch",JSON.stringify(_data));
            var uptime=getNowTime.hour();
            localStorageData.set("hotsearch_uptime",uptime);
            if(first){
                loadHotwords(data);
            }
        });
    }
    var loadHotwords=function(data){
        var _data=JSON.parse(data);
        var Hhtml="";
        var newnum=0;
        for(var i=0;i<10;i++){
            if(_data[i].new==1){
                Hhtml+='<div class="autocomplete-suggestion" data-link="'+_data[i].link+'" data-index="'+i+'">'+_data[i].title+'<span></span></div>';
                newnum++;
            }else{
                Hhtml+='<div class="autocomplete-suggestion" data-link="'+_data[i].link+'" data-index="'+i+'">'+_data[i].title+'</div>';
            }
        }
        var nowTime = getNowTime.hour();
        var hotSearchLooked = localStorageData.get("hotsearch_looked");
        var showTime = parseInt(nowTime-hotSearchLooked);
        if(newnum>0 && showTime>=2){
            $("#J_shuzi").show().html(newnum);
            postPoint({
                "xatag": ["hotsearch","showNew",newnum],
                "gatag": ["hotsearch","showNew"],
                "varlue": 0
            });

        }
        $("#J_hot").html(Hhtml);
        //$("#search-kw").attr("placeholder",getI18nMsg("searchHot").replace("S%",_data[0].title));
        $("#search-kw").attr("placeholder",_data[0].title);
    }
    var num = 0;
    var showwords=function(type){
        if($(".sanjiao").hasClass("up")){return;};
        $("#J_hot").show();
        $("#J_shuzi").hide();
        $(".sanjiao").removeClass("down").addClass("up");
        var _lookedtime=getNowTime.hour();
        localStorageData.set("hotsearch_looked",_lookedtime);
        if(!type){type="normal"}
        postPoint({
            "xatag": ["hotsearch","show",type],
            "gatag": ["hotsearch","show"],
            "varlue": 0
        });
    }
    var hiWords=function(){
        $("#J_hot").hide();
        $(".sanjiao").removeClass("up").addClass("down");
        num = 0 ;
        //suggestionBox.removeClass('autocomplete-selected');
    }
    var showHotSearch=function(){
        $("#J_hoticon").bind("click",function(e){
            if($(".sanjiao").hasClass("down")){
                showwords("buttionclick");
                //var temData=localStorageData.get("hotsearch").replace(/"new":1/gi,'"new":0');
                //localStorageData.set("hotsearch",temData);
            }else if($(".sanjiao").hasClass("up")){
                hiWords();
            }
            e.stopPropagation();
        });
        $("#search-kw").on("click",function(e){
            var _this=$(this);
            if( $('.autocomplete-hot').is(':hidden') && (_this.val()=="") ){
                showwords("inputclick");
            }else{
                hiWords();
            };
            // if($("#J_hot").is(":visible")){
            //     hiWords();
            // }
            e.stopPropagation();
        });
        $(document).on("click",function(){
            hiWords();
        });
    }
    //搜索提交
    var submitHotSearch=function(){
        $(".autocomplete-hot").on("click",".autocomplete-suggestion",function(e){
            var _this=$(this);
            if(_this.data("link")==""){
                $("#search-kw").val(_this.text());
                hiWords();
                $('#search-form').data('type','HotSearch');
                $('#search-form').trigger('submit');
                //Stat.searchPV("HotSearch");
            }else{
                window.location.href=_this.data("link");
            }
            var ifnew="notnew";
            if(_this.find("span").length>0){ifnew="new"};
            var _index=_this.index()+1||1;
            postPoint({
                "xatag": ["hotsearch","click",_index,ifnew],
                "gatag": ["hotsearch","click"],
                "varlue": 0
            });
            e.stopPropagation();
        });
        $("#search-kw").bind("keyup",function(e){
//            var _this=$(this);
//            if(_this.val()!==""){
//                hiWords();
//            }
            //alert(e.which);
            if($('.autocomplete-hot').is(':visible')){
                if(e.which == '40'){
                    $('.autocomplete-hot .autocomplete-suggestion').removeClass('autocomplete-selected');
                    $('.autocomplete-hot .autocomplete-suggestion').eq(num).addClass('autocomplete-selected');
                    $('#search-kw').val($('.autocomplete-hot .autocomplete-suggestion').eq(num).text());
                    if(num == 9){
                        num = 9;
                    }else{
                        num++;
                    }
                }else if(e.which == '38'){
                    if(num == 0){
                        num = 0;
                    }else{
                        num --;
                    }
                    $('.autocomplete-hot .autocomplete-suggestion').removeClass('autocomplete-selected');
                    $('.autocomplete-hot .autocomplete-suggestion').eq(num).addClass('autocomplete-selected');
                    $('#search-kw').val($('.autocomplete-hot .autocomplete-suggestion').eq(num).text());
                }else{
                    hiWords();
                }
            }
        });
    }
    return {
        init:function(){
            var _nowtime=getNowTime.hour();
            if(localStorageData.get("hotsearch")){
                if(localStorageData.get("hotsearch_uptime")==_nowtime){
                    loadHotwords(localStorageData.get("hotsearch"));
                }else{
                    getHotword(true);
                }
            }else{
                getHotword(true);
            }
            showHotSearch();
            submitHotSearch();
        }
    }
})();