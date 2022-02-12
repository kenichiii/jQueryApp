
(function(window, $){

    $.pfcApp = $.pfc.webapp('pfcApp', null, {

    });

    $('#main-menu a.active').click(function(){
        var url = window.location.href.toString();
        var pom = url.split('#');
        var uri = pom[1];
        
        
        $.pfcApp.openPage(uri);
    });
    
})(window, jQuery);
