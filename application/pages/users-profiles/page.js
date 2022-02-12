
(function(window, $){
    
    $.pfcApp.page(
       'users-profiles', {
            ALLWAYS_REINIT: true,
            INIT_CONTENT: true,
            
            stavInterval:null,
            loadStav: function() {
                var webpage = this;
                $.get($link('page','ajax','admin/users-profiles/stav-filter'),{stav:$('#users-profiles-stav').val()},function(html){
                    $("#users-profiles-stav").replaceWith(html); 
                    //bind change                    
                    $("#users-profiles-stav").change(function(){
                        $('#pfc-page-users-profiles .pfc-main-preloader').show();
                        $('#pfc-page-users-profiles .pfc-main-content').html('');                        
                        webpage.loadContent(                                                                
                                {
                                    stav:$(this).val(),
                                    radit:$('#users-profiles-radit').val(),
                                    nickname: $('#users-profiles-nickname').val()
                                }
                           );
                    });
                });    
                
                //bind radit change
            },
            
            __construct: function(callback) {
                var webpage = this;
                
                webpage.loadStav();
                
                $('#users_profiles_content_reload').click(function(){
                    var offset = ($('#users-profiles-offset')?$('#users-profiles-offset').val():0);
                    $('#pfc-page-users-profiles .pfc-main-preloader').show();
                    $('#pfc-page-users-profiles .pfc-main-content').html('');                    
                    webpage.loadContent({stav:$('#users-profiles-stav').val(),radit:$('#users-profiles-radit').val(),offset:offset,nickname:$('#users-profiles-nickname').val()});
                    return false;
                });
               
                $('#users-profiles-radit').change(function(){
                    $('#pfc-page-users-profiles .pfc-main-preloader').show();
                    $('#pfc-page-users-profiles .pfc-main-content').html('');                        
                    webpage.loadContent(                                                                
                                {
                                    stav:($('#users-profiles-stav')?$('#users-profiles-stav').val():0),
                                    radit:$(this).val(),
                                    nickname: $('#users-profiles-nickname').val()
                                }
                           );                    
                });
               
                $('#users-profiles-nickname').blur(function(){
                    $('#pfc-page-users-profiles .pfc-main-preloader').show();
                    $('#pfc-page-users-profiles .pfc-main-content').html('');                        
                    webpage.loadContent(                                                                
                                {
                                    stav:($('#users-profiles-stav')?$('#users-profiles-stav').val():0),
                                    radit:$('#users-profiles-radit').val(),
                                    nickname: $('#users-profiles-nickname').val()
                                }
                           );                    
                });
               
               if(typeof callback === 'function') {
                    callback.call(this);
               }
            },
            __init: function() {
                var webpage = this;
                             
              //bind paging
              $('#pfc-page-users-profiles a.paging, #pfc-page-users-profiles a.pagingActive').click(function(){
                    $('#pfc-page-users-profiles .pfc-main-preloader').show();
                    $('#pfc-page-users-profiles .pfc-main-content').html('');                        
                    webpage.loadContent(                                                                
                                {
                                    stav:($('#users-profiles-stav')?$('#users-profiles-stav').val():0),
                                    radit:$('#users-profiles-radit').val(),
                                    offset:$(this).attr('href'),
                                    nickname: $('#users-profiles-nickname').val()
                                }
                           );                     
                 return false; 
              }); 
                            //table row hover
              $('#pfc-page-users-profiles .table-responsive td')
                      .mouseover(function(){$(this).parent().find('td').addClass('hover')})
                      .mouseout(function(){$(this).parent().find('td').removeClass('hover')});
              
              var self = this;
              //bind edit dialog to nick
              $('#pfc-page-users-profiles td').not('.actions').css('cursor','pointer').click(function(){ 
                  $(this).parent().find('a.edit-profile').trigger('click');
              });
              
              $('#pfc-page-users-profiles .edit-profile').click(function(){
                  var url = $(this).attr('href');
                  self.dialog = $('<div style="display:hidden"></div>').appendTo('body');
                    // load remote content
                    self.dialog.load(
                        url,
                        {},
                        function (responseText, textStatus, XMLHttpRequest) {
                            self.dialog.dialog({
                                    title: $tr('Editace profilu'),
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
            },
            __blur: function() {
                clearInterval(this.stavInterval);
            },
            __focus: function() {
                var webpage = this;
                this.stavInterval = setInterval(function(){
                    webpage.loadStav();
                },5000);
            },
            
            

loadGallery: function() {
   var request = $.ajax({
      url: $link('page','ajax', 'admin/users-profiles/gallery'),
      type: "POST",
      dataType: "html",
      data: { edit: 1,user_id:$('#users_profiles_edit_profile_user_id').val()}
   });
   var that = this;
   request.done(function( html ) {
     $("#forms_user_profile_edit_gallery").empty();
     $("#forms_user_profile_edit_gallery").html( html );
     $("#forms_user_profile_edit_gallery .asklip-user-gallery-photo").click(function(){
         console.log('DELETE',$(this).attr('rel'))
         
         $.post($link('page','action','admin/users-profiles/gallery-delete'),{ipath:$(this).attr('rel'),user_id:$('#users_profiles_edit_profile_user_id').val()},function(res){
             that.loadGallery();
         });
         
         return false;
     })
   });
   request.fail(function() {
    //loadResults(0);
   });
},

         
initEditForm: function(currpage) {
  this.loadGallery();  
  
  $('.edit-profile-tabs a').click(function(){
      $('.edit-profile-form').hide();
      $($(this).attr('href')).show();
      return false;
  });
    
  $("#forms_user_profile_edit_uploadimage").on('submit',(function(e) {
    e.preventDefault();
    $("#forms_user_profile_edit_error").hide();
    $("#forms_user_profile_edit_ok").hide();
    $('#forms_user_profile_edit_loading').show();
    $.ajax({
      url: $link('page','action', 'admin/users-profiles/upload-photo'), // Url to which the request is send
      type: "POST",             // Type of request to be send, called as method
      dataType: "json",
      data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
      contentType: false,       // The content type used when sending data to the server.
      cache: false,             // To unable request pages to be cached
      processData:false,        // To send DOMDocument or non processed data file it is set to false
      success: function(data)   // A function to be called if request succeeds
      {
        $('#forms_user_profile_edit_loading').hide();
        if (data.succ == 'yes') {
          $('#forms_user_profile_edit_previewing').attr('src', data.preview);
          $("#forms_user_profile_edit_ok").show();
          
          //$.pfcApp.user.image_small = data.image_small;
          //$.pfcApp.user.image_medium = data.image_medium;
          //$.pfcApp.user.image_large = data.image_large;
                                           
          //rewrite table row image
          if(currpage == 'new-profiles') {
              $('#new_profiles_content_reload').trigger('click');
          } else {
              $('#users_profiles_content_reload').trigger('click');
          }
          
        } else {
          $("#forms_user_profile_edit_error").html(data.msg);
          $('#forms_user_profile_edit_error').show();
        }
      }
    });
  }));
  
  var cc = this;
  $("#forms_user_profile_edit_uploadimage2").on('submit',(function(e) {
    e.preventDefault();
    $("#profileedit_error2").hide();
    $("#profileedit_ok2").hide();
    $('#profileedit_loading2').show();
    $.ajax({
      url: $link('page','action', 'admin/users-profiles/upload-photo'), // Url to which the request is send
      type: "POST",             // Type of request to be send, called as method
      dataType: "json",
      data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
      contentType: false,       // The content type used when sending data to the server.
      cache: false,             // To unable request pages to be cached
      processData:false,        // To send DOMDocument or non processed data file it is set to false
      success: function(data)   // A function to be called if request succeeds
      {
        $('#profileedit_loading2').hide();
        if (data.succ == 'yes') {
          cc.loadGallery();
        } else {
          $("#profileedit_error2").html(data.msg);
          $('#profileedit_error2').show();
        }
      }
    });
  }));
  
 $("#forms_user_profile_edit_username").keyup(function() {
  $("#forms_user_profile_edit_result").html('');
  var name = $(this).val();
  if(name.length > 2) {
   $.ajax({
    type : 'GET',
    url  : $link('page','ajax', 'admin/users-profiles/username-check'),
    data : $(this).serialize(),
    success : function(data) {
      if (data) { $("#forms_user_profile_edit_result").html("<div class=\"error\"><span class=\"after--none\">"+data+"</span></div>"); }
    }
    });
    return false;
  }
  else {
   $("#forms_user_profile_edit_result").html('');
  }
 });


    $("#forms_user_profile_edit_file").change(function() {
      $("#forms_user_profile_edit_error").hide(); // To remove the previous error message
      $("#forms_user_profile_edit_ok").show();
      var file = this.files[0];
      var imagefile = file.type;
      var match= ["image/jpeg","image/png","image/jpg"];
      if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))) {
        $("#forms_user_profile_edit_ok").hide();
        $("#forms_user_profile_edit_error").html($tr("Only jpeg, jpg and png Images type allowed"));
        $("#forms_user_profile_edit_error").show();
        return false;
      } else {
        $("#forms_user_profile_edit_uploadimage").submit();
      }
    });
    $("#forms_user_profile_edit_file2").change(function() {
      $("#profileedit_error2").hide(); // To remove the previous error message
      var file = this.files[0];
      var imagefile = file.type;
      var match= ["image/jpeg","image/png","image/jpg"];
      if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))) {
        $("#profileedit_error2").html($tr("Only jpeg, jpg and png Images type allowed"));
        $("#profileedit_error2").show();
        return false;
      } else {
        $("#forms_user_profile_edit_uploadimage2").submit();
      }
    });

var c = this;
$('#user_profile_edit_my_location').click(function(){
    c.geoFindMe(c.getWebApp().GGKEY, c.getWebApp().user_lang);
})


/**
 * 
 * GOOGLE
 */
    var pac_input = document.getElementById('forms_user_profile_edit_searchTextField');
    (function pacSelectFirst(input) {
        // store the original event binding function
        var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;
        function addEventListenerWrapper(type, listener) {
            // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
            // and then trigger the original listener.
            if (type == "keydown") {
                var orig_listener = listener;
                listener = function(event) {
                    var suggestion_selected = $(".pac-item-selected").length > 0;
                    if (event.which == 13 && !suggestion_selected) {
                        var simulated_downarrow = $.Event("keydown", {
                            keyCode: 40,
                            which: 40
                        });
                        orig_listener.apply(input, [simulated_downarrow]);
                    }
                    orig_listener.apply(input, [event]);
                };
            }
            _addEventListener.apply(input, [type, listener]);
        }
        input.addEventListener = addEventListenerWrapper;
        input.attachEvent = addEventListenerWrapper;
        var options = {
          types: ['(cities)']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
    })(pac_input);

      var options = {
        types: ['(cities)']
      };
      var autocomplete = new google.maps.places.Autocomplete(pac_input, options);
      google.maps.event.addListener(autocomplete, 'place_changed', function () {
        document.getElementById('forms_user_profile_edit_city2').value = '';
        document.getElementById('forms_user_profile_edit_pid').value = '';
        document.getElementById('forms_user_profile_edit_country').value = '';
        document.getElementById('forms_user_profile_edit_countryzk').value = '';
        document.getElementById('forms_user_profile_edit_myLat').value = '';
        document.getElementById('forms_user_profile_edit_myLng').value = '';
        document.getElementById('forms_user_profile_edit_cityLat').value = '';
        document.getElementById('forms_user_profile_edit_cityLng').value = '';
        document.getElementById('forms_user_profile_edit_countryid').value = '';
        document.getElementById('forms_user_profile_edit_al1').value = '';
        document.getElementById('forms_user_profile_edit_al1id').value = '';
        document.getElementById('forms_user_profile_edit_al2').value = '';
        document.getElementById('forms_user_profile_edit_al2id').value = '';
        document.getElementById('forms_user_profile_edit_al3').value = '';
        document.getElementById('forms_user_profile_edit_al3id').value = '';
        document.getElementById('forms_user_profile_edit_al4').value = '';
        document.getElementById('forms_user_profile_edit_al4id').value = '';
        document.getElementById('forms_user_profile_edit_al5').value = '';
        document.getElementById('forms_user_profile_edit_al5id').value = '';

          var place = autocomplete.getPlace();
          for (var i = 0; i < place.address_components.length; i++)
          {
            var addr = place.address_components[i];
            if (addr.types[0] == 'country') {
            var getCountry;
            var getCountryZk;
            getCountry = addr.long_name;
            getCountryZk = addr.short_name;
            }
            if (addr.types[0] == 'locality') {
            var getLocality;
            getLocality = addr.long_name;
            }
            if (addr.types[0] == 'administrative_area_level_1') {
            var getAL1;
            getAL1 = addr.short_name;
            }
            if (addr.types[0] == 'administrative_area_level_2') {
            var getAL2;
            getAL2 = addr.short_name;
            }
            if (addr.types[0] == 'administrative_area_level_3') {
            var getAL3;
            getAL3 = addr.short_name;
            }
            if (addr.types[0] == 'administrative_area_level_4') {
            var getAL4;
            getAL4 = addr.short_name;
            }
            if (addr.types[0] == 'administrative_area_level_5') {
            var getAL5;
            getAL5 = addr.short_name;
            }
          }
          var url = "https://maps.googleapis.com/maps/api/geocode/json";
          var key = $.pfcApp.GGKEY;
          document.getElementById('forms_user_profile_edit_city2').value = place.name;
          document.getElementById('forms_user_profile_edit_pid').value = place.place_id;
          document.getElementById('forms_user_profile_edit_country').value = getCountry;
          document.getElementById('forms_user_profile_edit_countryzk').value = getCountryZk;

          var params = {address: getCountry, region: getCountryZk, key: key};
              $.getJSON(url + '?callback?', params, function(data) {
                var getCountryid = data['results'][0]['place_id'];
                document.getElementById('forms_user_profile_edit_countryid').value = getCountryid;
          });

          if (typeof getAL1 !== 'undefined') {
            document.getElementById('forms_user_profile_edit_al1').value = getAL1;
            var params = {address: getAL1, region: getCountryZk, key: key};
                $.getJSON(url + '?callback?', params, function(data) {
                  var misto_id = data['results'][0]['place_id'];
                  document.getElementById('forms_user_profile_edit_al1id').value = misto_id;
                });
          } else {document.getElementById('forms_user_profile_edit_al1').value = ""; document.getElementById('forms_user_profile_edit_al1id').value = "";}
          if (typeof getAL2 !== 'undefined') {
            document.getElementById('forms_user_profile_edit_al2').value = getAL2;
            var params = {address: getAL2, region: getCountryZk, key: key};
                $.getJSON(url + '?callback?', params, function(data) {
                  var misto_id = data['results'][0]['place_id'];
                  document.getElementById('forms_user_profile_edit_al2id').value = misto_id;
                });
          } else {document.getElementById('forms_user_profile_edit_al2').value = ""; document.getElementById('forms_user_profile_edit_al2id').value = "";}
          if (typeof getAL3 !== 'undefined') {
            document.getElementById('forms_user_profile_edit_al3').value = getAL3;
            var params = {address: getAL3, region: getCountryZk, key: key};
                $.getJSON(url + '?callback?', params, function(data) {
                  var misto_id = data['results'][0]['place_id'];
                  document.getElementById('forms_user_profile_edit_al3id').value = misto_id;
                });
          } else {document.getElementById('forms_user_profile_edit_al3').value = ""; document.getElementById('forms_user_profile_edit_al3id').value = "";}
          if (typeof getAL4 !== 'undefined') {
            document.getElementById('forms_user_profile_edit_al4').value = getAL4;
            var params = {address: getAL4, region: getCountryZk, key: key};
                $.getJSON(url + '?callback?', params, function(data) {
                  var misto_id = data['results'][0]['place_id'];
                  document.getElementById('forms_user_profile_edit_al4id').value = misto_id;
                });
          } else {document.getElementById('forms_user_profile_edit_al4').value = ""; document.getElementById('forms_user_profile_edit_al4id').value = "";}
          if (typeof getAL5 !== 'undefined') {
            document.getElementById('forms_user_profile_edit_al5').value = getAL5;
            var params = {address: getAL5, region: getCountryZk, key: key};
                $.getJSON(url + '?callback?', params, function(data) {
                  var misto_id = data['results'][0]['place_id'];
                  document.getElementById('forms_user_profile_edit_al5id').value = misto_id;
                });
          } else {document.getElementById('forms_user_profile_edit_al5').value = ""; document.getElementById('forms_user_profile_edit_al5id').value = "";}
          document.getElementById('forms_user_profile_edit_cityLat').value = place.geometry.location.lat();
          document.getElementById('forms_user_profile_edit_cityLng').value = place.geometry.location.lng();
      });


    
    var options1 = {
        type:       'post',
        dataType:   'json',
        beforeSubmit: function() {
            $(".loader-blue").prop("disabled",true);
            $(".loader-blue").addClass("active");
        },
        success:    function(data) {
          $("#user_profile_edit_basic_ok").hide();
          $("#user_profile_edit_basic_error").hide();
          $(".loader-blue").prop("disabled",false);
          $(".loader-blue").removeClass("active"); 
          
          if(currpage == 'new-profiles') {
              $('#new_profiles_content_reload').trigger('click');
          } else {
              $('#users_profiles_content_reload').trigger('click');
          }
          
          if (data.username) { 
             //rewrite table row
          }
              
          if (data.iam) { 
              //rewrite table row
          }
              
          if (data.seeking) { 
              //rewrite table row
          }
          
          if (data.age) { 
              //rewrite table row
          }
              
           if (data.pid) { 
              //rewrite table row
              //$('.asklip-user-cityname').html($('#forms_user_profile_edit_searchTextField').val());
           }
            
           
              
          if(data.succ=='yes') {
              $("#user_profile_edit_basic_ok").html('Saved').show();
              setTimeout(function(){
                $("#user_profile_edit_basic_ok").hide();
                $("#user_profile_edit_basic_error").hide();
              }, 5000);
          } else {
            $("#user_profile_edit_basic_error").html(data.msg).show();
          }
        }
    };
    $("#user_profile_edit_form-edit_basic").ajaxForm(options1);

    var options2 = {
        type:       'post',
        dataType:   'json',
        beforeSubmit: function() {
            $(".loader-blue").prop("disabled",true);
            $(".loader-blue").addClass("active");
        },
        success:    function(data) {
          $("#user_profile_edit_attrs_ok").hide();
          $("#user_profile_edit_attrs_error").hide();
          $(".loader-blue").prop("disabled",false);
          $(".loader-blue").removeClass("active");  
          if(data.succ=='yes') {
              $("#user_profile_edit_attrs_ok").html($tr('Saved')).show();                                                        
              setTimeout(function(){                                
                $("#user_profile_edit_attrs_error").hide();
                $("#user_profile_edit_attrs_ok").hide();
              }, 5000);
          } else {
            $("#user_profile_edit_attrs_error").html(data.msg).show();
          }
        }
    };
    $("#forms_user_profile_edit_form-edit_attr").ajaxForm(options2);
    
    var options3 = {
        type:       'post',
        dataType:   'json',
        beforeSubmit: function() {
            $(".loader-blue").prop("disabled",true);
            $(".loader-blue").addClass("active");
        },
        success:    function(data) {
          $("#user_profile_edit_desc_ok").hide();
          $("#user_profile_edit_desc_error").hide();
          $(".loader-blue").prop("disabled",false);
          $(".loader-blue").removeClass("active");
          if(data.succ=='yes') {
              $("#user_profile_edit_desc_ok").html($tr('Saved')).show();
              setTimeout(function(){                
                $("#user_profile_edit_desc_ok").hide();
                $("#user_profile_edit_desc_error").hide();                
              }, 5000);
          } else {
            $("#user_profile_edit_desc_error").html(data.msg).show();
            
          }
        }
    };
    $("#user_profile_edit_form-edit_popis").ajaxForm(options3);    
               

 }, //initEditForm

        
  geoFindMe: function(key,lang) {
    if (document.getElementById('forms_user_profile_edit_searchTextField').value !== $tr('L_LOCATING'))  {
      if (!navigator.geolocation){
        alert($tr("L_NOTSUPPORT; ?>"));
        return;
      }
      function success(position) {
        document.getElementById('forms_user_profile_edit_searchTextField').value = $tr('L_LOCATING');
        $("#forms_user_profile_edit_content").empty();
        $(".location__position").removeClass("active");
        document.getElementById('forms_user_profile_edit_city2').value = '';
        document.getElementById('forms_user_profile_edit_pid').value = '';
        document.getElementById('forms_user_profile_edit_country').value = '';
        document.getElementById('forms_user_profile_edit_countryzk').value = '';
        document.getElementById('forms_user_profile_edit_myLat').value = '';
        document.getElementById('forms_user_profile_edit_myLng').value = '';
        document.getElementById('forms_user_profile_edit_cityLat').value = '';
        document.getElementById('forms_user_profile_edit_cityLng').value = '';
        document.getElementById('forms_user_profile_edit_countryid').value = '';
        document.getElementById('forms_user_profile_edit_al1').value = '';
        document.getElementById('forms_user_profile_edit_al1id').value = '';
        document.getElementById('forms_user_profile_edit_al2').value = '';
        document.getElementById('forms_user_profile_edit_al2id').value = '';
        document.getElementById('forms_user_profile_edit_al3').value = '';
        document.getElementById('forms_user_profile_edit_al3id').value = '';
        document.getElementById('forms_user_profile_edit_al4').value = '';
        document.getElementById('forms_user_profile_edit_al4id').value = '';
        document.getElementById('forms_user_profile_edit_al5').value = '';
        document.getElementById('forms_user_profile_edit_al5id').value = '';
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
        var pos = latitude+","+longitude;
        var rtype = "locality";
        var rtype2 = "country";

        var url = "https://maps.googleapis.com/maps/api/geocode/json";
        var params = {latlng: pos, result_type: rtype, language: lang, key: key};
             $.getJSON(url + '?callback?', params, function(data) {
                var misto_nazev = data['results'][0]['address_components'][0]['long_name'];

                var params2 = {latlng: pos, result_type: rtype2, language: lang, key: key};
                      $.getJSON(url + '?callback?', params2, function(data) {
                        var zeme_nazev = data['results'][0]['address_components'][0]['long_name'];
                        var zeme_kod = data['results'][0]['address_components'][0]['short_name'];
                        document.getElementById('forms_user_profile_edit_searchTextField').value = misto_nazev+", "+zeme_nazev;

                        var params3 = {address: misto_nazev, region: zeme_kod, key: key};
                        $.getJSON(url + '?callback?', params3, function(data) {
                          var misto_id = data['results'][0]['place_id'];
                          for (var i = 0; i < data['results'][0].address_components.length; i++)
                          {
                            var addr = data['results'][0].address_components[i];
                            if (addr.types[0] == 'administrative_area_level_1') { getAL1 = addr.long_name; }
                            if (addr.types[0] == 'administrative_area_level_2') { getAL2 = addr.long_name; }
                            if (addr.types[0] == 'administrative_area_level_3') { getAL3 = addr.long_name; }
                            if (addr.types[0] == 'administrative_area_level_4') { getAL4 = addr.long_name; }
                            if (addr.types[0] == 'administrative_area_level_5') { getAL5 = addr.long_name; }
                          }
                          document.getElementById('forms_user_profile_edit_city2').value = misto_nazev;
                          document.getElementById('forms_user_profile_edit_pid').value = misto_id;
                          document.getElementById('forms_user_profile_edit_country').value = zeme_nazev;
                          document.getElementById('forms_user_profile_edit_countryzk').value = zeme_kod;
                          document.getElementById('forms_user_profile_edit_myLat').value = latitude;
                          document.getElementById('forms_user_profile_edit_myLng').value = longitude;
                          document.getElementById('forms_user_profile_edit_cityLat').value = data['results'][0]['geometry']['location']['lat'];
                          document.getElementById('forms_user_profile_edit_cityLng').value = data['results'][0]['geometry']['location']['lng'];

                          var params = {address: zeme_nazev, region: zeme_kod, key: key};
                              $.getJSON(url + '?callback?', params, function(data) {
                                var getCountryid = data['results'][0]['place_id'];
                                document.getElementById('forms_user_profile_edit_countryid').value = getCountryid;
                          });

                          if (typeof getAL1 !== 'undefined') {
                            document.getElementById('forms_user_profile_edit_al1').value = getAL1;
                            var params = {address: getAL1, region: zeme_kod, key: key};
                                $.getJSON(url + '?callback?', params, function(data) {
                                  var misto_id = data['results'][0]['place_id'];
                                  document.getElementById('forms_user_profile_edit_al1id').value = misto_id;
                                });
                          } else {document.getElementById('forms_user_profile_edit_al1').value = ""; document.getElementById('forms_user_profile_edit_al1id').value = "";}
                          if (typeof getAL2 !== 'undefined') {
                            document.getElementById('forms_user_profile_edit_al2').value = getAL2;
                            var params = {address: getAL2, region: zeme_kod, key: key};
                                $.getJSON(url + '?callback?', params, function(data) {
                                  var misto_id = data['results'][0]['place_id'];
                                  document.getElementById('forms_user_profile_edit_al2id').value = misto_id;
                                });
                          } else {document.getElementById('forms_user_profile_edit_al2').value = ""; document.getElementById('forms_user_profile_edit_al2id').value = "";}
                          if (typeof getAL3 !== 'undefined') {
                            document.getElementById('forms_user_profile_edit_al3').value = getAL3;
                            var params = {address: getAL3, region: zeme_kod, key: key};
                                $.getJSON(url + '?callback?', params, function(data) {
                                  var misto_id = data['results'][0]['place_id'];
                                  document.getElementById('forms_user_profile_edit_al3id').value = misto_id;
                                });
                          } else {document.getElementById('forms_user_profile_edit_al3').value = ""; document.getElementById('forms_user_profile_edit_al3id').value = "";}
                          if (typeof getAL4 !== 'undefined') {
                            document.getElementById('forms_user_profile_edit_al4').value = getAL4;
                            var params = {address: getAL4, region: zeme_kod, key: key};
                                $.getJSON(url + '?callback?', params, function(data) {
                                  var misto_id = data['results'][0]['place_id'];
                                  document.getElementById('forms_user_profile_edit_al4id').value = misto_id;
                                });
                          } else {document.getElementById('forms_user_profile_edit_al4').value = ""; document.getElementById('forms_user_profile_edit_al4id').value = "";}
                          if (typeof getAL5 !== 'undefined') {
                            document.getElementById('al5').value = getAL5;
                            var params = {address: getAL5, region: zeme_kod, key: key};
                                $.getJSON(url + '?callback?', params, function(data) {
                                  var misto_id = data['results'][0]['place_id'];
                                  document.getElementById('forms_user_profile_edit_al5id').value = misto_id;
                                });
                          } else {document.getElementById('forms_user_profile_edit_al5').value = ""; document.getElementById('forms_user_profile_edit_al5id').value = "";}

                          $("#forms_user_profile_edit_loading").hide(); data['results'][0]
                        });
                      });
             });
          var params = {lat: latitude, lon: longitude, t: '2'};
          $.getJSON($link('component','ajax','user/geo'), params, function(data) {
          });
      };
      function error(err) {
        alert($tr("L_NOTSUPPORT"));
      };
      if (navigator.geolocation){
        $(".location__position").addClass("active");
        navigator.geolocation.getCurrentPosition(success, error);
      }

    }
    }            
            
            
       } //custom
    ); //page         
    
})(window, jQuery);