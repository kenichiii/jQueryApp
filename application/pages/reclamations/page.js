
(function(window, $){
    
    $.pfcApp.page(
       'reclamations', {
            ALLWAYS_REINIT: true,
            INIT_CONTENT: true,
            
            reload_content: function(use_offset) {
                    $('#pfc-page-reclamations .pfc-main-preloader').show();
                    $('#pfc-page-reclamations .pfc-main-content').html('');                        
                    var params = {
                                    stav:($('#reclamations-stav')?$('#reclamations-stav').val():0),
                                    radit:$('#reclamations-radit').val(),
                                    from:$('#reclamations-from').val(),
                                    to:$('#reclamations-to').val()
                                };
                    if(use_offset === true) {
                        var offset = ($('#reclamations-offset')?$('#reclamations-offset').val():0);
                        params.offset = offset;
                    } else if(use_offset != undefined) {
                        params.offset = use_offset;
                    }            
  
                    
                    this.loadContent(params);         
            },            
            
            __construct: function(callback) {
                var webpage = this;                
                
                $('#reclamations_content_reload').click(function(){
                    webpage.reload_content(true);
                    return false;
                });

                    //bind change                    
                    $("#reclamations-stav").change(function(){
                        webpage.reload_content();
                    });                
                
                $('#reclamations-radit').change(function(){
                    webpage.reload_content();
                });
               
               $('#reclamations-from, #reclamations-to').datetimepicker();
               
               $('#reclamations-from, #reclamations-to').blur(function(){
                   webpage.reload_content();
               });
               
               if(typeof callback === 'function') {
                    callback.call(this);
               }
            },
            __init: function() {
                var webpage = this;
                             
              //bind paging
              $('#pfc-page-reclamations a.paging, #pfc-page-reclamations a.pagingActive').click(function(){
                 webpage.reload_content($(this).attr('href'));
                 return false; 
              }); 
                            //table row hover
              $('#pfc-page-reclamations .table-responsive td')
                      .mouseover(function(){$(this).parent().find('td').addClass('hover')})
                      .mouseout(function(){$(this).parent().find('td').removeClass('hover')});
              
              var self = this;
              //bind edit dialog to nick
              $('#pfc-page-reclamations td').css('cursor','pointer').click(function(){ 
                  var url = $(this).parent().find('.view-date').first().attr('href');
                  self.dialog = $('<div style="display:hidden"></div>').appendTo('body');
                    // load remote content
                    self.dialog.load(
                        url,
                        {},
                        function (responseText, textStatus, XMLHttpRequest) {
                            self.dialog.dialog({
                                    title: $tr('Detail reklamace'),
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
              $('#pfc-page-reclamations .view-date-chat-paging').click(function(){
                    var that = $(this);
                    $.get(that.attr('href'),{},function(html){
                        that.replaceWith(html);
                        webpage.bindChatPaging();
                    });
                    
                    return false; 
                });  
            },           
            viewDateListeners: function() { 
                var webpage = this;
                $('#page-reclamations-view-date-tabs').tabs();
                this.bindChatPaging();
                $('.start-reclamation-proccess').click(function(){
                   $(this).attr('disabled',true); 
                   var that = this;
                   $.get($link('page','action','admin/reclamations/start-reclamation-proccess'),{
                       date_id: $('#view-date-reclamations-date-id').val()
                   },function(res){
                       if(res.succ === 'yes') {
                           alert($tr('Reklamační řízení bylo zahájeno'));
                           $('.start-reclamation-proccess').hide();
                           $('.end-reclamation-proccess').show();
                            var offset = ($('#reclamations-offset')?$('#reclamations-offset').val():0);
                            $('#pfc-page-reclamations .pfc-main-preloader').show();
                            $('#pfc-page-reclamations .pfc-main-content').html('');                    
                            webpage.loadContent({stav:$('#reclamations-stav').val(),radit:$('#reclamations-radit').val(),offset:offset});                           
                       } else {
                           alert(res);
                           $(that).attr('disabled',false);
                       }
                   },'json'); 
                });
                
                $('.end-reclamation-proccess').click(function(){
                   $(this).attr('disabled',true); 
                   var that = this;
                   $.get($link('page','action','admin/reclamations/end-reclamation-proccess'),{
                       date_id: $('#view-date-reclamations-date-id').val()
                   },function(res){
                       if(res.succ === 'yes') {
                           alert($tr('Reklamační řízení bylo ukončeno'));
                           $('.end-reclamation-proccess').hide();
                           $('.closed-reclamation-proccess').show();
                            var offset = ($('#reclamations-offset')?$('#reclamations-offset').val():0);
                            $('#pfc-page-reclamations .pfc-main-preloader').show();
                            $('#pfc-page-reclamations .pfc-main-content').html('');                    
                            webpage.loadContent({stav:$('#reclamations-stav').val(),radit:$('#reclamations-radit').val(),offset:offset});                           
                       } else {
                           alert(res);
                           $(that).attr('disabled',false);
                       }
                   },'json'); 
                });
                
                    var options = {
                        dataType:   'json',
                       // clearForm:  true,
                        
                        success: function(data) {
                            $("#view_date_send_email_error").hide();
                            $("#view_date_send_email_ok").hide();  

                          if(data.succ == 'yes') {            
                            $("#view_date_send_email_ok").show();                            
                            $("#view_date_send_email_form select").val("0");
                            $("#view_date_send_email_form input").val("");
                            $("#view_date_send_email_form textarea").val("");
                            setTimeout(function(){
                                $("#view_date_send_email_ok").hide();                            
                            },5000);
                          } else {
                            $("#view_date_send_email_error").html(data.msg);
                            $("#view_date_send_email_error").show();
                          }
                        }
                    };

                    $("#view_date_send_email_form").ajaxForm(options);
                
                $('.vire-date-add-penalty-point').click(function(){
                    var profileno = $(this).attr('profile');
                    if(window.confirm($tr('Opravdu udělit trestný bod?'))) {
                        $.get($(this).attr('href'),{},function(res){
                            if(res.succ === 'yes') {
                                alert($tr('Trestný bod byl udělen'))
                                if(profileno=="1") {
                                    var count = parseInt($('#penalty-profile1').text());
                                    count++;
                                    if(count >= 3) {
                                        alert($tr('Tři trestné body pro toho kdo zval'));
                                        count = 0;
                                    }
                                   $('#penalty-profile1').html(count.toString()); 
                                } else {
                                   var count = parseInt($('#penalty-profile2').text());
                                    count++;
                                    if(count >= 3) {
                                        alert($tr('Tři trestné body pro pozvaného'));
                                        count = 0;
                                    }
                                   $('#penalty-profile2').html(count.toString());  
                                }
                            } 
                        },'json');
                    }
                    return false; 
                });
                
                $('#odblokovat-gifts').click(function(){
                    if(window.confirm('Opravdu odblokovat dárky zpšt k pozívajícímu?')) {
                        $.get($link('page','action','admin/reclamations/set-gifts-free'),{date_id:$('#view-date-reclamations-date-id').val()},function(res){
                           if(res.succ === 'yes') {
                               alert($tr('Dárky byly odblokovány zpět k pozívateli'));
                               $('#gifts-to-unlock').hide();
                               $('#no-gifts-to-unlock').show();
                           } else {
                               alert(res)
                           }
                                   
                        });
                    }
                    return false;
                });
            }            
            
       } //custom
    ); //page 
        
})(window, jQuery);