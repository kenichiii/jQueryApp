

(function(window, $){
    
    $.pfcApp.page(
       'user/reset-password'
       , {
           
          __construct: function(callback) {
               
                   var options = {
                        dataType:   'json',
                        clearForm:  true,

                        success: function(data) {
                            $("#user_account_password_password_error").hide();
                            $("#user_account_password_password_ok").hide();  

                          if(data.succ == 'yes') {            
                            $("#user_account_password_password_ok").show();
                          } else {
                            $("#user_account_password_password_error").html(data.msg);
                            $("#user_account_password_password_error").show();
                          }
                        }
                    };

                    $("#user_account_password_password_form").ajaxForm(options);
               
               if(typeof callback === 'function') {
                    callback.call(this);
               }
           },
           
           openPage: function() {
               var email = this.getParameters('email');
               var hash = this.getParameters('hash');
               var that = this;
               $.get($link('page','ajax','admin/user/reset-password/check'),{email:email,hash:hash},function(res){
                   
                   $('#user_account_password_password_preloader').hide();
                   $('#user_account_password_password_check_results').hide();
                   $('#user_account_password_password_form_holder').hide();
                   
                   if(res.succ == 'yes') {
                       $('#user_account_password_password_form_holder').show();
                       that.get('form/user/account/reset-password').setResetCode(hash);
                   } else {
                       $('#user_account_password_password_check_results').html(res.msg).show();
                   }
                   
               },'json');
           }
       } //custom 
       
               
    ); //page 
        
})(window, jQuery);