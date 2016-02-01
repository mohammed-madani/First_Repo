$(function() {

    if (!localStorageData.get('set_country')) {
        $.get("http://lightningnewtab.com/newtabv3/api/detect.php", function(data) {
            var _data = JSON.parse(data);
            conf.country = _data.country || "us";
            localStorageData.set('set_country', _data.country);
            appInit();
        });
    } else {
        conf.country = localStorageData.get('set_country');
        appInit();
    }

    function appInit(){
        searchForm.init();
        TheHotsearch.init();
        siteGrid.init();
    }

    $(window).on('load', function() {
        $('#search-kw').focus();
    });

});
