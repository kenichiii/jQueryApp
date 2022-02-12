
(function(window, $){
    
    $.pfcApp.page(
       'user_my-account', {
           __init: function() {               

                    $("#user_account_registration_basic_email").keyup(function() {
                       $("#user_account_registration_basic_result3").html('');
                       var name = $(this).val();
                       if(name.length > 7) {                        
                            $.ajax({                         
                                type : 'GET', //classes/email-check.php                         
                                url  : $link('page','ajax','admin/user/my-account/email-check'),                         
                                data : $(this).serialize(),                         
                                success : function(data) {                                
                                    if (data) { $("#user_account_registration_basic_result3").html("<span class=\"after--none\">"+data+"</span>"); }                         
                                }                        
                            });                        
                          return false;
                        } else {
                            $("#user_account_registration_basic_result3").html('');
                        }
                    });

                    $("#user_account_registration_basic_password").keyup(function() {
                       $("#user_account_registration_basic_result2").html('');
                       var name = $(this).val();
                       if(name.length > 0 && name.length < 6) {
                         $("#user_account_registration_basic_result2").html("<span class=\"after--none\">"+$tr("Heslo musí být alespoň 6 znaků dlouhé")+"</span>");
                       } else {
                         $("#user_account_registration_basic_result2").html('');
                       }
                    }); 
                      
                    $('#user_account_registration_basic_error').hide();
                    $('#user_account_registration_basic_pwd_error').hide();
                        
                            var options = {
                                    success: function(json){
                                        $('#user_account_registration_basic_error').hide();
                                        $('#user_account_registration_basic_ok').hide();                                           
                                        if(json.succ === 'no') {
                                            $('#user_account_registration_basic_error span').html(json.msg).parent().show();
                                        } else {
                                           //we were successfull
                                           $.extend($.pfcApp.user, json);
                                           
                                           $.pfcApp.user.render();
                                           
                                           $('#user_account_registration_basic_ok').show();                                                                                                                                 
                                        }                                        
                                    },
                                    beforeSend:function() {
                                        //$.pfcEditor.ui.showWaitingBox();
                                    },
                                    error: function(response, status, err){
                                        //$.pfcEditor.ui.hideWaitingBox();
                                        $('#user_account_registration_basic_error span').html($tr('HTTP ACTION ERROR! Please repeat the action')).parent().show();
                                    }
                              //      dataType:  'json'
                            };
                            
                $('#basic-info-form').ajaxForm(options);                      

                            var options_pwd = {
                                clearForm: true,
                                    success: function(json){
                                        $('#user_account_registration_basic_pwd_error').hide();
                                        $('#user_account_registration_basic_pwd_ok').hide();                                           
                                        if(json.succ === 'no') {
                                            $('#user_account_registration_basic_pwd_error span').html(json.msg).parent().show();
                                        } else {
                                           //we were successfull
                                           $('#user_account_registration_basic_pwd_ok').show();                                           
                                        }                                        
                                    },
                                    beforeSend:function() {
                                        //$.pfcEditor.ui.showWaitingBox();
                                    },
                                    error: function(response, status, err){
                                        //$.pfcEditor.ui.hideWaitingBox();
                                        $('#user_account_registration_basic_pwd_error span').html($tr('HTTP ACTION ERROR! Please repeat the action')).parent().show();
                                    }
                              //      dataType:  'json'
                            };              
                            
                $('#change-pwd-form').ajaxForm(options_pwd);                                  
            } //__init
       } //custom
    ); //page 
        
})(window, jQuery);