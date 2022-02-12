

(function(window, $){
    
    $.pfcApp.componentFactoryAdd(
       'form/user/account/forgotten-password', {
           
           __ctype: 'form',
           __init: function() {
                 
    var options = {
        dataType:   'json',
        clearForm:  true,
        
        success: function(data) {
            $("#user_account_password_reset_error").hide();
            $("#user_account_password_reset_ok").hide();  
                     
          if(data.succ == 'yes') {            
            $("#user_account_password_reset_ok").show();
          } else {
            $("#user_account_password_reset_error").html(data.msg);
            $("#user_account_password_reset_error").show();
          }
        }
    };
    
    $("#user_account_password_reset_form").ajaxForm(options);

               
               
           } //__init
       } //custom
   ); //pfcApp.cfactory
})(window,jQuery);
