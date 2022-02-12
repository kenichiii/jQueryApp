

(function(window, $){
    
    $.pfcApp.componentFactoryAdd(
       'form/user/account/registration/photo', {
           __ctype: 'form',
           __init: function() {
              
    $(document).ready(function (e) {
      $("#user_account_registration_photo_uploadimage").on('submit',(function(e) {
        e.preventDefault();
        $("#user_account_registration_photo_error").hide();
        $('#user_account_registration_photo_load').hide();
        $('#user_account_registration_photo_loadnew').hide();
        $('#user_account_registration_photo_loading').show();
        $.ajax({
          url: $.pfcApp.componentlink('action', 'user/upload-photo'), // Url to which the request is send
          type: "POST",             // Type of request to be send, called as method
          dataType: "json",
          data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
          contentType: false,       // The content type used when sending data to the server.
          cache: false,             // To unable request pages to be cached
          processData:false,        // To send DOMDocument or non processed data file it is set to false
          success: function(data)   // A function to be called if request succeeds
          {
            $('#user_account_registration_photo_loading').hide();
            if (data.succ == 'yes') {                
              $("#user_account_registration_photo_previewing").show();
              $('#user_account_registration_photo_previewing').attr('src', data.preview);
              $("#user_account_registration_photo_loadnew").show();
            } else {
              $("#user_account_registration_photo_error").html(data.msg);
              $('#user_account_registration_photo_error').show();
            }
          }
        });
      }));
    });
    $( function() {
        $("#user_account_registration_photo_file").change(function() {
          $("#user_account_registration_photo_error").hide(); // To remove the previous error message
          var file = this.files[0];
          var imagefile = file.type;
          var match= ["image/jpeg","image/png","image/jpg"];
          if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))) {
            $('#user_account_registration_photo_load').hide();
            $('#user_account_registration_photo_loadnew').hide();
            $("#user_account_registration_photo_error").html("<span>"+$tr('Only jpeg, jpg and png Images type allowed')+"</span>");
            $("#user_account_registration_photo_error").show();
            return false;
          } else {
            $("#user_account_registration_photo_uploadimage").submit();
          }
        });
    });              
               
                            var options = {
                                    success: function(json){                                        
                                        if(json.succ === 'no') {
                                            $('#user_account_registration_photo_error').html(json.msg).show();
                                        } else {
                                           //we were successfull
                                           $.pfcApp.user.image_small = json.image_small;
                                           $.pfcApp.user.image_medium = json.image_medium;
                                           $.pfcApp.user.image_large = json.image_large;
                                           
                                           $.pfcApp.user.render();
                                           
                                           $.pfcApp.user.loadNotNew('1');
                                           $.pfcApp.user.loadNot('1');
                                           $.pfcApp.user.loadNot('2');
                                           $.pfcApp.user.loadNot('3');
                                           
                                           var url = $.pfcApp.getPage('user_account_registration_basic').getParameters('url');
                                           if(url) {
                                               var uri = url.split('#');
                                               $.pfcApp.openPage('#'+uri[1]);                                           
                                           } else {
                                               $.pfcApp.openPage('#/user/profile/edit');                                           
                                           }
                                        }                                        
                                    },
                                    beforeSend:function() {
                                        //$.pfcEditor.ui.showWaitingBox();
                                    },
                                    error: function(response, status, err){
                                        //$.pfcEditor.ui.hideWaitingBox();
                                        $('#user_account_registration_photo_error').html($tr('HTTP ACTION ERROR! Please repeat the action')).show();
                                    }
                              //      dataType:  'json'
                            };
                            
                           $('#user_account_registration_photo_startform').ajaxForm(options); 
               
               
           } //__init
       } //page basic user registration           
    );
    
})(window, jQuery);
           
           

