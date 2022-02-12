

(function(window, $){
    
    $.pfcApp.componentFactoryAdd(
       'form/user/account/reset-password', {
           
           __ctype: 'form',
           
           setResetCode: function(code) {
               $('#user_account_password_password_code').val(code);
           },
           
           __init: function() {
                 
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

               
               
           } //__init
       } //custom
   ); //pfcApp.cfactory
})(window,jQuery);
