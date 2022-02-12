
(function(window, $){
    
    $.pfcApp.page(
       'taken-gifts', {
            ALLWAYS_REINIT: true,
            INIT_CONTENT: true,
            
            reload_content: function(use_offset) {
                    $('#pfc-page-taken-gifts .pfc-main-preloader').show();
                    $('#pfc-page-taken-gifts .pfc-main-content').html('');                        
                    var params =                                                                 
                                {                                
                                    radit:$('#taken-gifts-radit').val(),
                                    nickname: $('#taken-gifts-nickname').val(),
                                    from:$('#taken-gifts-from').val(),
                                    to:$('#taken-gifts-to').val()
                                }
                           ;                    
                    if(use_offset === true) {
                        var offset = ($('#taken-gifts-offset')?$('#taken-gifts-offset').val():0);
                        params.offset = offset;
                    } else if(use_offset != undefined) {
                        params.offset = use_offset;
                    }            

                    
                    this.loadContent(params);         
            },  
        
            __construct: function(callback) {
                var webpage = this;                            
                
                $('#taken_gifts_content_reload').click(function(){
                    webpage.reload_content(true);
                    return false;
                });
               
                $('#taken-gifts-radit').change(function(){
                    webpage.reload_content();
                });
               
                $('#taken-gifts-nickname').blur(function(){
                    webpage.reload_content();
                })
               
               $('#taken-gifts-from, #taken-gifts-to').datetimepicker();
               
               $('#taken-gifts-from, #taken-gifts-to').blur(function(){
                   webpage.reload_content();
               });               
               
               if(typeof callback === 'function') {
                    callback.call(this);
               }
            },
            __init: function() {
                var webpage = this;
                $('#pfc-page-taken-gifts .actions a').click(function(){
                  if(window.confirm('Opravdu provést akci '+trim($(this).text())+'?')) {  
                    $.get($(this).attr('href'),{},function(response){
                        if(response.succ == 'yes') {
                            webpage.reload_content(true);
                        } else {
                            alert(response.msg);
                        }
                    },'json');
                   }  
                   
                   return false;
                });                                            
              
              //bind paging
              $('#pfc-page-taken-gifts a.paging,#pfc-page-taken-gifts a.pagingActive').click(function(){
                 webpage.reload_content($(this).attr('href'));
                 return false; 
              }); 
              //table row hover
              $('#pfc-page-taken-gifts .table-responsive td')
                      .mouseover(function(){$(this).parent().find('td').addClass('hover')})
                      .mouseout(function(){$(this).parent().find('td').removeClass('hover')});
            },
            __blur: function() {

            },
            __focus: function() {
            }
       } //custom
    ); //page 
    
})(window, jQuery);