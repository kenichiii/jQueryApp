
(function(window, $){
    
    $.pfcApp.page(
       'new-profiles', {
            ALLWAYS_REINIT: true,
            INIT_CONTENT: true,
            
            stavInterval:null,
            loadStav: function() {
                var webpage = this;
                $.get($link('page','ajax','admin/new-profiles/stav-filter'),{stav:$('#stav').val()},function(html){
                    $("#stav").replaceWith(html); 
                    //bind change                    
                    $("#stav").change(function(){
                        $('#pfc-page-new-profiles .pfc-main-preloader').show();
                        $('#pfc-page-new-profiles .pfc-main-content').html('');                        
                        webpage.loadContent(                                                                
                                {
                                    stav:$(this).val(),
                                    radit:$('#radit').val(),
                                    nickname: $('#nickname').val()
                                }
                           );
                    });
                });    
                
                
            },
            
            __construct: function(callback) {
                var webpage = this;
                
                webpage.loadStav();
                
                $('#new_profiles_content_reload').click(function(){
                    var offset = ($('#new-profiles-offset')?$('#new-profiles-offset').val():0);
                    $('#pfc-page-new-profiles .pfc-main-preloader').show();
                    $('#pfc-page-new-profiles .pfc-main-content').html('');                    
                    webpage.loadContent({stav:$('#stav').val(),radit:$('#radit').val(),offset:offset,nickname:$('#nickname').val()});
                    return false;
                });
               
                $('#radit').change(function(){
                    $('#pfc-page-new-profiles .pfc-main-preloader').show();
                    $('#pfc-page-new-profiles .pfc-main-content').html('');                        
                    webpage.loadContent(                                                                
                                {
                                    stav:($('#stav')?$('#stav').val():0),
                                    radit:$(this).val(),
                                    nickname: $('#nickname').val()
                                }
                           );                    
                });
               
                $('#nickname').blur(function(){
                    $('#pfc-page-new-profiles .pfc-main-preloader').show();
                    $('#pfc-page-new-profiles .pfc-main-content').html('');                        
                    webpage.loadContent(                                                                
                                {
                                    stav:($('#stav')?$('#stav').val():0),
                                    radit:$('#radit').val(),
                                    nickname: $('#nickname').val()
                                }
                           );                    
                });
               
               if(typeof callback === 'function') {
                    callback.call(this);
               }
            },
            __init: function() {
                var webpage = this;
                $('#pfc-page-new-profiles .actions a').click(function(){
                  if(window.confirm('Opravdu provést akci '+trim($(this).text())+'?')) {  
                    $.get($(this).attr('href'),{},function(response){
                        if(response.succ == 'yes') {
                            webpage.loadStav();
                            $('#pfc-page-new-profiles .pfc-main-preloader').show();
                            $('#pfc-page-new-profiles .pfc-main-content').html('');
                            webpage.init();
                        } else {
                            alert(response.msg);
                        }
                    },'json');
                   }  
                   
                   return false;
                });                                            
              
              //bind paging
              $('#pfc-page-new-profiles a.paging,#pfc-page-new-profiles a.pagingActive').click(function(){
                    $('#pfc-page-new-profiles .pfc-main-preloader').show();
                    $('#pfc-page-new-profiles .pfc-main-content').html('');                        
                    webpage.loadContent(                                                                
                                {
                                    stav:($('#stav')?$('#stav').val():0),
                                    radit:$('#radit').val(),
                                    offset:$(this).attr('href'),
                                    nickname: $('#nickname').val()
                                }
                           );                     
                 return false; 
              }); 
              //table row hover
              $('#pfc-page-new-profiles .table-responsive td')
                      .mouseover(function(){$(this).parent().find('td').addClass('hover')})
                      .mouseout(function(){$(this).parent().find('td').removeClass('hover')});
              //bind edit dialog to nick              
              var self = this;              
              $('#pfc-page-new-profiles .edit-profile').click(function(){
                  var url = $(this).attr('href');
                  self.dialog = $('<div style="display:hidden"></div>').appendTo('body');
                    // load remote content
                    self.dialog.load(
                        url,
                        {},
                        function (responseText, textStatus, XMLHttpRequest) {
                            self.dialog.dialog({
                                    title: $tr('Editace profilu'),
                                    modal: true,
                                    width: 900,
                                    close: function(event, ui) {
                                      $(this).remove();
                                    }
                                });

                            $.pfcApp.getPage('users-profiles').initEditForm('new-profiles');
                            $(window).trigger('resize');
                        });
               
                return false;
              });
              $('#pfc-page-new-profiles td').not('.actions').css('cursor','pointer').click(function(){ 
                  $(this).parent().find('a.edit-profile').trigger('click');
              });
            },
            __blur: function() {
                clearInterval(this.stavInterval);
            },
            __focus: function() {
                var webpage = this;
                this.stavInterval = setInterval(function(){
                    webpage.loadStav();
                },5000);
            }
       } //custom
    ); //page 
    
})(window, jQuery);
