

(function(window, $){
    
    $.pfcApp.componentFactoryAdd(
       'form/contact', {
           __ctype: 'form',
           __init: function() {
               var that = this;
               
               $("#contact_form_message_button").click(function(){
                   that.contact_form_sendMessage(this.form,this.form.email,this.form.message);
               });
           
           }, //__init
           
contact_form_sendMessage: function(form, email, message) {
  
  $("#contact_form_error").hide();
  $("#contact_form_ok").hide();
  
  if (email.value == '') {
    $("#contact_form_error").html($tr("You must provide your email address"));
    $("#contact_form_error").show();
    return false;
  }
  
  if (message.value == '') {
    $("#contact_form_error").html($tr("You must type a message"));
    $("#contact_form_error").show();
    return false;
  }
  
  var options = {
        target:     '#contact_form_divToUpdate',
        type:       'post',
        dataType:   'json',
        clearForm:  true,
        //url:        'classes/contact.php',
        beforeSubmit: function() {
          $("#contact_form_message_button").disabled = true;
        },
        success:    function(data) {
          if(data.stav==1) {
              $("#contact_form_ok").html($tr("Your message was successfully sent."));
              $("#contact_form_ok").show();
              message.value = '';
              ga('send', 'event', 'contact', 'message-submit');
          } else {
            $("#contact_form_error").html(data.error);
            $("#contact_form_error").show();
          }
        }
    };
    $("#contact_form_message_form").ajaxSubmit(options);
}           
           
       } //component
    );
    
})(window, jQuery);


