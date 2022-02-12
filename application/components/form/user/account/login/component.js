

(function(window, $){

    $.pfcApp.componentFactoryAdd(
       'form/user/account/login', {
           __ctype: 'form',
           __init: function() {

                            var options = {
                                    success: function(json){

                                        $('.user_account_login_form_error').hide();

                                        if(json.succ === 'no') {
                                            $('.user_account_login_form_error').html(json.msg).show();
                                        } else {
                                           //we were successfull
                                           $.extend($.pfcApp.user, json);

                                           //$.pfcApp.user.image_small = urldecode(json.image_small);

                                           $.pfcApp.user.render();
                                           $.pfcApp.getPage('people').render();

                                           $.pfcApp.user.loadNotNew('1');
                                           $.pfcApp.user.loadNot('1');
                                           $.pfcApp.user.loadNot('2');
                                           $.pfcApp.user.loadNot('3');

                                           $.pfcApp.openPage('#/people');
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
           } //__init
       } //custom
   ); //pfcApp.cfactory
})(window,jQuery);
