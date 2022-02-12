
(function(window, $){
    
    $.pfcApp.page(
       'adminer', {
           __init: function() {
               $('#adminer-iframe').height($(document).height()-$('.admin-page-header').first().height()-105)
               $(window).resize(function(){
                    $('#adminer-iframe').height('auto');
                    $('#adminer-iframe').height($(document).height()-$('.admin-page-header').first().height()-105)    
               })
           }
       } //custom
    ); //page 
        
})(window, jQuery);