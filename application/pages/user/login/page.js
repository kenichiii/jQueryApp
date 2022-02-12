
(function(window,$){    
 
    var options = {
        success: function(json){                                        
            $('.user_account_login_form_error').hide();                                       
            if(json.succ === 'no') {
                $('.user_account_login_form_error').html(json.msg).show();
            } else {
                //we were successfull
                $('#pfcApp-main-section-preloader').show();
                window.location.href = $.pfcApp.app_url;                                           
            }                                        
        },
        beforeSend:function() {
            //$.pfcEditor.ui.showWaitingBox();
        },
        error: function(response, status, err){
            //$.pfcEditor.ui.hideWaitingBox();
            $('.user_account_login_form_error').html($tr('HTTP ACTION ERROR! Please repeat the action')).show();
        },
        clearForm:  true,
        dataType:  'json'
    };
                             
    $('.user_account_login_page_form').ajaxForm(options);
 
    $(".user_hash").click(function(){
        $('.login-box').hide();
        $("#user-hash-holder").show();
    });
    
    $(".forgot__password").click(function(){
        $('.login-box').hide();
        $("#forgotten-password-holder").show();
    });
 
    $(".login__form").click(function(){
        $('.login-box').hide();
        $("#login-form-holder").show();
    });
    
    $('#hashhelpbutton').click(function(){
       $.get($link('component','ajax','admin/user/hash-help'),{pwd:$('#hashhelpinput').val()},function(hash){
           $('#hashhelpoutput').val(hash);
       }); 
    });
    
    var options2 = {
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
    
    $("#user_account_password_reset_form").ajaxForm(options2);

    
 })(window,jQuery);

