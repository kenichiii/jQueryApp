
(function(window, $){
    
    $.pfcApp.page(
       'dates', {
            ALLWAYS_REINIT: true,
            INIT_CONTENT: true,
            
            reload_content: function(use_offset) {
                    $('#pfc-page-dates .pfc-main-preloader').show();
                    $('#pfc-page-dates .pfc-main-content').html('');                        
                    var params = {
                                    stav:($('#dates-stav')?$('#dates-stav').val():0),
                                    radit:$('#dates-radit').val(),
                                    from:$('#dates-from').val(),
                                    to:$('#dates-to').val()
                                };
                                
                    if(use_offset === true) {
                        var offset = ($('#dates-offset')?$('#dates-offset').val():0);
                        params.offset = offset;
                    } else if(use_offset != undefined) {
                        params.offset = use_offset;
                    }            
                    
                    this.loadContent(params);         
            },
            
            __construct: function(callback) {
                var webpage = this;                
                
                $('#dates_content_reload').click(function(){
                    webpage.reload_content(true);
                    return false;
                });

                    //bind change                    
                    $("#dates-stav").change(function(){
                        webpage.reload_content();
                    });                
                
                $('#dates-radit').change(function(){
                    webpage.reload_content();
                });
               
               $('#dates-from, #dates-to').datetimepicker();
               
               $('#dates-from, #dates-to').blur(function(){
                   webpage.reload_content();
               });
               
               if(typeof callback === 'function') {
                    callback.call(this);
               }
            },
            __init: function() {
                var webpage = this;
                             
              //bind paging
              $('#pfc-page-dates a.paging, #pfc-page-dates a.pagingActive').click(function(){
                 webpage.reload_content($(this).attr('href'));
                 return false; 
              }); 
                            //table row hover
              $('#pfc-page-dates .table-responsive td')
                      .mouseover(function(){$(this).parent().find('td').addClass('hover')})
                      .mouseout(function(){$(this).parent().find('td').removeClass('hover')});
              
              var self = this;
              //bind edit dialog to nick
              $('#pfc-page-dates td').css('cursor','pointer').click(function(){ 
                  var url = $(this).parent().find('.view-date').first().attr('href');
                  self.dialog = $('<div style="display:hidden"></div>').appendTo('body');
                    // load remote content
                    self.dialog.load(
                        url,
                        {},
                        function (responseText, textStatus, XMLHttpRequest) {
                            self.dialog.dialog({
                                    title: $tr('Prohlížení pozvánky'),
                                    modal: true,
                                    width: 900,
                                    close: function(event, ui) {
                                      $(this).remove();
                                    }
                                });

                             self.viewDateListeners(); 
                            $(window).trigger('resize');
                        });
               
                return false;
              });
            }, //init
            bindChatPaging: function() {
              var webpage = this;  
              $('.view-date-chat-paging').click(function(){
                    var that = $(this);
                    $.get(that.attr('href'),{},function(html){
                        that.replaceWith(html);
                        webpage.bindChatPaging();
                    });
                    
                    return false; 
                });  
            },           
            viewDateListeners: function() { 
                $('#page-dates-view-date-tabs').tabs();
                this.bindChatPaging();
            }            
            
       } //custom
    ); //page         
    
})(window, jQuery);