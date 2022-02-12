
(function(window, $){
    
    $.pfcApp.componentFactoryAdd(
       'form/user/account/registration/basic', {
           __ctype: 'form',
           __init: function() {
               
                    $("#user_account_registration_basic_username").keyup(function() {
                       $("#user_account_registration_basic_result").html('');
                       var name = $(this).val();
                       if(name.length > 1) {
                        $.ajax({
                         type : 'GET',
                         url  : $.pfcApp.componentlink('ajax','user/username-check'),
                         data : $(this).serialize(),
                         success : function(data) {
                           if (data) { $("#user_account_registration_basic_result").html("<span class=\"after--none\">"+data+"</span>"); }
                           else { $("#user_account_registration_basic_result").html(""); }
                         }
                         });
                         return false;
                       }
                       else {
                        $("#user_account_registration_basic_result").html('');
                       }
                    });

                    $("#user_account_registration_basic_email").keyup(function() {
                       $("#user_account_registration_basic_result3").html('');
                       var name = $(this).val();
                       if(name.length > 7) {
                        $.ajax({
                         type : 'GET', //classes/email-check.php
                         url  : $.pfcApp.componentlink('ajax','user/email-check'),
                         data : $(this).serialize(),
                         success : function(data) {
                           if (data) { $("#user_account_registration_basic_result3").html("<span class=\"after--none\">"+data+"</span>"); }
                         }
                         });
                         return false;
                       }
                       else {
                        $("#user_account_registration_basic_result3").html('');
                       }
                    });

                    $("#user_account_registration_basic_password").keyup(function() {
                       $("#user_account_registration_basic_result2").html('');
                       var name = $(this).val();
                       if(name.length > 0 && name.length < 6) {
                         $("#user_account_registration_basic_result2").html($tr("<span class=\"after--none\">Password must be at least 6 characters long</span>"));
                       }
                       else {
                        $("#user_account_registration_basic_result2").html('');
                       }
                      }); 
                      
                      $('#user_account_registration_basic_error').hide();
                        
                            var options = {
                                    success: function(json){
                                        $('#user_account_registration_basic_error').hide();
                                        if(json.succ === 'no') {
                                            $('#user_account_registration_basic_error span').html(json.msg).parent().show();
                                        } else {
                                           //we were successfull
                                           $.extend($.pfcApp.user, json);
                                           
                                           $.pfcApp.user.render();
                                           
                                           $.pfcApp.user.loadNotNew('1');
                                           $.pfcApp.user.loadNot('1');
                                           $.pfcApp.user.loadNot('2');
                                           $.pfcApp.user.loadNot('3');
                                           
                                           $.pfcApp.openPage('#/user/account/registration/profile');                                           
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
                            
                           $('#user_account_registration_basic_startform').ajaxForm(options);                      
                           
                $(function(){
                                                             
                     $("a[href='#terms_of_use']").click(function(){
                        console.log("a[href='#terms_of_use']") 
                        $.get($link('page','ajax','terms-of-use/content'),{},function(data){
                            $('.asklip-terms-of-use-popup-content').html(data);                      
                        }); 
                     });

                     $("a[href='#privacy_policy']").click(function(){
                        $.get($link('page','ajax','privacy-policy/content'),{},function(data){
                            $('.asklip-privacy-policy-popup-content').html(data);                      
                        }); 
                     });
                    
                });           
           } //__init
       } //page basic user registration           
    );
    
})(window, jQuery);
