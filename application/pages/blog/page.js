
(function(window, $){
    
    $.pfcApp.page(
       'blog', {
            ALLWAYS_REINIT: true,
            INIT_CONTENT: true,
            
            reload_content: function(use_offset) {                                                                
                $('#pfc-page-blog .pfc-main-preloader').show();
                $('#pfc-page-blog .pfc-main-content').html('');                    
                                
                var params = {lang:$('#blog-lang').val(),radit:$('#blog-radit').val(),title:$('#blog-title').val()};
                if(use_offset === true) {
                    var offset = ($('#blog-offset')?$('#blog-offset').val():0);
                    params.offset = offset;
                } else if(use_offset != undefined) {
                    params.offset = use_offset;
                }   
                
                this.loadContent(params);
            },
            
            __construct: function(callback) {
                var webpage = this;                
                
                $('#blog_create_article').click(function(){
                  var url = $(this).attr('href');
                  webpage.dialog = $('<div style="display:hidden"></div>').appendTo('body');
                    // load remote content
                    webpage.dialog.load(
                        url,
                        {},
                        function (responseText, textStatus, XMLHttpRequest) {
                            webpage.dialog.dialog({
                                    title: $tr('Editace článku'),
                                    modal: true,
                                    width: 900,
                                    close: function(event, ui) {
                                      $(this).remove();
                                    }
                                });

                            webpage.initCreateForm();
                            $(window).trigger('resize');
                        });
               
                return false;
              });
                
                $('#blog_content_reload').click(function(){
                    webpage.reload_content(true);
                    return false;
                });
               
                $('#blog-radit').change(function(){
                    webpage.reload_content();                    
                });
               
                $('#blog-title').blur(function(){
                    webpage.reload_content();
                });
               
               if(typeof callback === 'function') {
                    callback.call(this);
               }
            },
            __init: function() {
                var webpage = this;
                             
              //bind paging
              $('#pfc-page-blog a.paging, #pfc-page-blog a.pagingActive').click(function(){
                 webpage.reload_content($(this).attr('href'));  
                 return false; 
              }); 
                            //table row hover
              $('#pfc-page-blog .table-responsive td')
                      .mouseover(function(){$(this).parent().find('td').addClass('hover')})
                      .mouseout(function(){$(this).parent().find('td').removeClass('hover')});
              
              var self = this;
              //bind edit dialog to nick
              $('#pfc-page-blog td').not('.actions').css('cursor','pointer').click(function(){ 
                  $(this).parent().find('a.edit-profile').trigger('click');
              });
              
              $('#pfc-page-blog .edit-profile').click(function(){
                  var url = $(this).attr('href');
                  self.dialog = $('<div style="display:hidden"></div>').appendTo('body');
                    // load remote content
                    self.dialog.load(
                        url,
                        {},
                        function (responseText, textStatus, XMLHttpRequest) {
                            self.dialog.dialog({
                                    title: $tr('Editace článku'),
                                    modal: true,
                                    width: 900,
                                    close: function(event, ui) {
                                      $(this).remove();
                                    }
                                });

                            self.initEditForm();
                            $(window).trigger('resize');
                        });
               
                return false;
              });
              
                $('#pfc-page-blog .actions a').click(function(){
                  if(window.confirm('Opravdu provést akci '+trim($(this).text())+'?')) {  
                    $.get($(this).attr('href'),{},function(response){
                        if(response.succ == 'yes') {
                            self.reload_content(true);
                        } else {
                            alert(response.msg);
                        }
                    },'json');
                   }  
                   
                   return false;
                }); 
              
            },
            __blur: function() {
            },
            __focus: function() {
            },
            
initCreateForm: function() {
              var webpage = this;
              
                    $("#admin_accounts_registration_create_email").keyup(function() {
                       $("#admin_accounts_registration_create_result3").html('');
                       var name = $(this).val();
                       if(name.length > 7) {                        
                            $.ajax({                         
                                type : 'GET', //classes/email-check.php                         
                                url  : $link('page','ajax','admin/admin-accounts/email-check'),                         
                                data : $(this).serialize(),                         
                                success : function(data) {                                
                                    if (data) { $("#admin_accounts_registration_create_result3").html("<span class=\"after--none\">"+data+"</span>"); }                         
                                }                        
                            });                        
                          return false;
                        } else {
                            $("#admin_accounts_registration_create_result3").html('');
                        }
                    });

                    $("#admin_accounts_registration_create_password").keyup(function() {
                       $("#admin_accounts_registration_create_result2").html('');
                       var name = $(this).val();
                       if(name.length > 0 && name.length < 6) {
                         $("#admin_accounts_registration_create_result2").html("<span class=\"after--none\">"+$tr("Heslo musí být alespoň 6 znaků dlouhé")+"</span>");
                       } else {
                         $("#admin_accounts_registration_create_result2").html('');
                       }
                    }); 
                      
                    $('#admin_accounts_registration_create_error').hide();                    
                        
                            var options = {
                                    success: function(json){
                                        $('#admin_accounts_registration_create_error').hide();
                                        $('#admin_accounts_registration_create_ok').hide();                                           
                                        if(json.succ === 'yes') {
                                           //we were successfull                                           
                                           $('#admin_accounts_registration_create_ok').show();                                                                                                                                 

                                           $.get($link('page','ajax','admin/admin-accounts/edit-profile'),{user_id:json.user_id},function(html){
                                                $('#admin-accounts-account-detail-wrapper').html(html);
                                                webpage.initEditForm();
                                                webpage.reload_content();
                                                $(window).trigger('resize');
                                           });                                                                                                   

                                        } else {
                                            $('#admin_accounts_registration_create_error span').html(json.msg).parent().show();                                           
                                        }                                        
                                    },
                                    beforeSend:function() {
                                        //$.pfcEditor.ui.showWaitingBox();
                                    },
                                    error: function(response, status, err){
                                        //$.pfcEditor.ui.hideWaitingBox();
                                        $('#admin_accounts_registration_basic_error span').html($tr('HTTP ACTION ERROR! Please repeat the action')).parent().show();
                                    }
                              //      dataType:  'json'
                            };
                            
                $('#ac-create-form').ajaxForm(options);                      

},            
         
initEditForm: function(currpage) {
                    
                    
                    $("#admin_accounts_registration_basic_email").keyup(function() {
                       $("#admin_accounts_registration_basic_result3").html('');
                       var name = $(this).val();
                       if(name.length > 7) {                        
                            $.ajax({                         
                                type : 'GET', //classes/email-check.php                         
                                url  : $link('page','ajax','admin/admin-accounts/email-check'),                         
                                data : $(this).serialize(),                         
                                success : function(data) {                                
                                    if (data) { $("#admin_accounts_registration_basic_result3").html("<span class=\"after--none\">"+data+"</span>"); }                         
                                }                        
                            });                        
                          return false;
                        } else {
                            $("#admin_accounts_registration_basic_result3").html('');
                        }
                    });

                    $("#admin_accounts_registration_basic_password").keyup(function() {
                       $("#admin_accounts_registration_basic_result2").html('');
                       var name = $(this).val();
                       if(name.length > 0 && name.length < 6) {
                         $("#admin_accounts_registration_basic_result2").html("<span class=\"after--none\">"+$tr("Heslo musí být alespoň 6 znaků dlouhé")+"</span>");
                       } else {
                         $("#admin_accounts_registration_basic_result2").html('');
                       }
                    }); 
                      
                    $('#admin_accounts_registration_basic_error').hide();
                    $('#admin_accounts_registration_basic_pwd_error').hide();
                        
                            var options = {
                                    success: function(json){
                                        $('#admin_accounts_registration_basic_error').hide();
                                        $('#admin_accounts_registration_basic_ok').hide();                                           
                                        if(json.succ === 'no') {
                                            $('#admin_accounts_registration_basic_error span').html(json.msg).parent().show();
                                        } else {
                                           //we were successfull
                                           $.extend($.pfcApp.user, json);
                                           
                                           $.pfcApp.user.render();
                                           
                                           $('#admin_accounts_registration_basic_ok').show();                                                                                                                                 
                                        }                                        
                                    },
                                    beforeSend:function() {
                                        //$.pfcEditor.ui.showWaitingBox();
                                    },
                                    error: function(response, status, err){
                                        //$.pfcEditor.ui.hideWaitingBox();
                                        $('#admin_accounts_registration_basic_error span').html($tr('HTTP ACTION ERROR! Please repeat the action')).parent().show();
                                    }
                              //      dataType:  'json'
                            };
                            
                $('#ac-basic-info-form').ajaxForm(options);                      

                            var options_pwd = {
                                clearForm: true,
                                    success: function(json){
                                        $('#admin_accounts_registration_basic_pwd_error').hide();
                                        $('#admin_accounts_registration_basic_pwd_ok').hide();                                           
                                        if(json.succ === 'no') {
                                            $('#admin_accounts_registration_basic_pwd_error span').html(json.msg).parent().show();
                                        } else {
                                           //we were successfull
                                           $('#admin_accounts_registration_basic_pwd_ok').show();                                           
                                        }                                        
                                    },
                                    beforeSend:function() {
                                        //$.pfcEditor.ui.showWaitingBox();
                                    },
                                    error: function(response, status, err){
                                        //$.pfcEditor.ui.hideWaitingBox();
                                        $('#admin_accounts_registration_basic_pwd_error span').html($tr('HTTP ACTION ERROR! Please repeat the action')).parent().show();
                                    }
                              //      dataType:  'json'
                            };              
                            
                $('#ac-change-pwd-form').ajaxForm(options_pwd);                

 } //initEditForm

                       
       } //custom
    ); //page 
        
})(window, jQuery);