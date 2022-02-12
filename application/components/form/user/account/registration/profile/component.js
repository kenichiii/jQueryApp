

(function(window, $){
    
    $.pfcApp.componentFactoryAdd(
       'form/user/account/registration/profile', {
           __ctype: 'form',
           
           geoFindMe: function(key,lang) {
               
    if (document.getElementById('forms_user_account_registration_profile_searchTextField').value !== $tr("L_LOCATING"))  {
      if (!navigator.geolocation){
        alert($tr("L_NOTSUPPORT"));
        return;
      }
      function success(position) {
        document.getElementById('forms_user_account_registration_profile_searchTextField').value = $tr("L_LOCATING");
        $("#forms_user_account_registration_profile_content").empty();
        $(".location__position").removeClass("active");
        document.getElementById('forms_user_account_registration_profile_city2').value = '';
        document.getElementById('forms_user_account_registration_profile_pid').value = '';
        document.getElementById('forms_user_account_registration_profile_country').value = '';
        document.getElementById('forms_user_account_registration_profile_countryzk').value = '';
        document.getElementById('forms_user_account_registration_profile_myLat').value = '';
        document.getElementById('forms_user_account_registration_profile_myLng').value = '';
        document.getElementById('forms_user_account_registration_profile_cityLat').value = '';
        document.getElementById('forms_user_account_registration_profile_cityLng').value = '';
        document.getElementById('forms_user_account_registration_profile_countryid').value = '';
        document.getElementById('forms_user_account_registration_profile_al1').value = '';
        document.getElementById('forms_user_account_registration_profile_al1id').value = '';
        document.getElementById('forms_user_account_registration_profile_al2').value = '';
        document.getElementById('forms_user_account_registration_profile_al2id').value = '';
        document.getElementById('forms_user_account_registration_profile_al3').value = '';
        document.getElementById('forms_user_account_registration_profile_al3id').value = '';
        document.getElementById('forms_user_account_registration_profile_al4').value = '';
        document.getElementById('forms_user_account_registration_profile_al4id').value = '';
        document.getElementById('forms_user_account_registration_profile_al5').value = '';
        document.getElementById('forms_user_account_registration_profile_al5id').value = '';
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
                        document.getElementById('forms_user_account_registration_profile_searchTextField').value = misto_nazev+", "+zeme_nazev;

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
                          document.getElementById('forms_user_account_registration_profile_city2').value = misto_nazev;
                          document.getElementById('forms_user_account_registration_profile_pid').value = misto_id;
                          document.getElementById('forms_user_account_registration_profile_country').value = zeme_nazev;
                          document.getElementById('forms_user_account_registration_profile_countryzk').value = zeme_kod;
                          document.getElementById('forms_user_account_registration_profile_myLat').value = latitude;
                          document.getElementById('forms_user_account_registration_profile_myLng').value = longitude;
                          document.getElementById('forms_user_account_registration_profile_cityLat').value = data['results'][0]['geometry']['location']['lat'];
                          document.getElementById('forms_user_account_registration_profile_cityLng').value = data['results'][0]['geometry']['location']['lng'];

                          var params = {address: zeme_nazev, region: zeme_kod, key: key};
                              $.getJSON(url + '?callback?', params, function(data) {
                                var getCountryid = data['results'][0]['place_id'];
                                document.getElementById('forms_user_account_registration_profile_countryid').value = getCountryid;
                          });

                          if (typeof getAL1 !== 'undefined') {
                            document.getElementById('forms_user_account_registration_profile_al1').value = getAL1;
                            var params = {address: getAL1, region: zeme_kod, key: key};
                                $.getJSON(url + '?callback?', params, function(data) {
                                  var misto_id = data['results'][0]['place_id'];
                                  document.getElementById('forms_user_account_registration_profile_al1id').value = misto_id;
                                });
                          } else {document.getElementById('forms_user_account_registration_profile_al1').value = ""; document.getElementById('forms_user_account_registration_profile_al1id').value = "";}
                          if (typeof getAL2 !== 'undefined') {
                            document.getElementById('forms_user_account_registration_profile_al2').value = getAL2;
                            var params = {address: getAL2, region: zeme_kod, key: key};
                                $.getJSON(url + '?callback?', params, function(data) {
                                  var misto_id = data['results'][0]['place_id'];
                                  document.getElementById('forms_user_account_registration_profile_al2id').value = misto_id;
                                });
                          } else {document.getElementById('forms_user_account_registration_profile_al2').value = ""; document.getElementById('forms_user_account_registration_profile_al2id').value = "";}
                          if (typeof getAL3 !== 'undefined') {
                            document.getElementById('forms_user_account_registration_profile_al3').value = getAL3;
                            var params = {address: getAL3, region: zeme_kod, key: key};
                                $.getJSON(url + '?callback?', params, function(data) {
                                  var misto_id = data['results'][0]['place_id'];
                                  document.getElementById('forms_user_account_registration_profile_al3id').value = misto_id;
                                });
                          } else {document.getElementById('forms_user_account_registration_profile_al3').value = ""; document.getElementById('forms_user_account_registration_profile_al3id').value = "";}
                          if (typeof getAL4 !== 'undefined') {
                            document.getElementById('forms_user_account_registration_profile_al4').value = getAL4;
                            var params = {address: getAL4, region: zeme_kod, key: key};
                                $.getJSON(url + '?callback?', params, function(data) {
                                  var misto_id = data['results'][0]['place_id'];
                                  document.getElementById('forms_user_account_registration_profile_al4id').value = misto_id;
                                });
                          } else {document.getElementById('forms_user_account_registration_profile_al4').value = ""; document.getElementById('forms_user_account_registration_profile_al4id').value = "";}
                          if (typeof getAL5 !== 'undefined') {
                            document.getElementById('al5').value = getAL5;
                            var params = {address: getAL5, region: zeme_kod, key: key};
                                $.getJSON(url + '?callback?', params, function(data) {
                                  var misto_id = data['results'][0]['place_id'];
                                  document.getElementById('forms_user_account_registration_profile_al5id').value = misto_id;
                                });
                          } else {document.getElementById('forms_user_account_registration_profile_al5').value = ""; document.getElementById('forms_user_account_registration_profile_al5id').value = "";}

                          $("#forms_user_account_registration_profile_loading").hide(); data['results'][0]
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
    },               
               
               
      
   
  __init: function() {
   
      
  if(google) {
      
    var pac_input = document.getElementById('forms_user_account_registration_profile_searchTextField');
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
        document.getElementById('forms_user_account_registration_profile_city2').value = '';
        document.getElementById('forms_user_account_registration_profile_pid').value = '';
        document.getElementById('forms_user_account_registration_profile_country').value = '';
        document.getElementById('forms_user_account_registration_profile_countryzk').value = '';
        document.getElementById('forms_user_account_registration_profile_myLat').value = '';
        document.getElementById('forms_user_account_registration_profile_myLng').value = '';
        document.getElementById('forms_user_account_registration_profile_cityLat').value = '';
        document.getElementById('forms_user_account_registration_profile_cityLng').value = '';
        document.getElementById('forms_user_account_registration_profile_countryid').value = '';
        document.getElementById('forms_user_account_registration_profile_al1').value = '';
        document.getElementById('forms_user_account_registration_profile_al1id').value = '';
        document.getElementById('forms_user_account_registration_profile_al2').value = '';
        document.getElementById('forms_user_account_registration_profile_al2id').value = '';
        document.getElementById('forms_user_account_registration_profile_al3').value = '';
        document.getElementById('forms_user_account_registration_profile_al3id').value = '';
        document.getElementById('forms_user_account_registration_profile_al4').value = '';
        document.getElementById('forms_user_account_registration_profile_al4id').value = '';
        document.getElementById('forms_user_account_registration_profile_al5').value = '';
        document.getElementById('forms_user_account_registration_profile_al5id').value = '';

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
          document.getElementById('forms_user_account_registration_profile_city2').value = place.name;
          document.getElementById('forms_user_account_registration_profile_pid').value = place.place_id;
          document.getElementById('forms_user_account_registration_profile_country').value = getCountry;
          document.getElementById('forms_user_account_registration_profile_countryzk').value = getCountryZk;

          var params = {address: getCountry, region: getCountryZk, key: key};
              $.getJSON(url + '?callback?', params, function(data) {
                var getCountryid = data['results'][0]['place_id'];
                document.getElementById('forms_user_account_registration_profile_countryid').value = getCountryid;
          });

          if (typeof getAL1 !== 'undefined') {
            document.getElementById('forms_user_account_registration_profile_al1').value = getAL1;
            var params = {address: getAL1, region: getCountryZk, key: key};
                $.getJSON(url + '?callback?', params, function(data) {
                  var misto_id = data['results'][0]['place_id'];
                  document.getElementById('forms_user_account_registration_profile_al1id').value = misto_id;
                });
          } else {document.getElementById('forms_user_account_registration_profile_al1').value = ""; document.getElementById('forms_user_account_registration_profile_al1id').value = "";}
          if (typeof getAL2 !== 'undefined') {
            document.getElementById('forms_user_account_registration_profile_al2').value = getAL2;
            var params = {address: getAL2, region: getCountryZk, key: key};
                $.getJSON(url + '?callback?', params, function(data) {
                  var misto_id = data['results'][0]['place_id'];
                  document.getElementById('forms_user_account_registration_profile_al2id').value = misto_id;
                });
          } else {document.getElementById('forms_user_account_registration_profile_al2').value = ""; document.getElementById('forms_user_account_registration_profile_al2id').value = "";}
          if (typeof getAL3 !== 'undefined') {
            document.getElementById('forms_user_account_registration_profile_al3').value = getAL3;
            var params = {address: getAL3, region: getCountryZk, key: key};
                $.getJSON(url + '?callback?', params, function(data) {
                  var misto_id = data['results'][0]['place_id'];
                  document.getElementById('forms_user_account_registration_profile_al3id').value = misto_id;
                });
          } else {document.getElementById('forms_user_account_registration_profile_al3').value = ""; document.getElementById('forms_user_account_registration_profile_al3id').value = "";}
          if (typeof getAL4 !== 'undefined') {
            document.getElementById('al4').value = getAL4;
            var params = {address: getAL4, region: getCountryZk, key: key};
                $.getJSON(url + '?callback?', params, function(data) {
                  var misto_id = data['results'][0]['place_id'];
                  document.getElementById('al4id').value = misto_id;
                });
          } else {document.getElementById('forms_user_account_registration_profile_al4').value = ""; document.getElementById('forms_user_account_registration_profile_al4id').value = "";}
          if (typeof getAL5 !== 'undefined') {
            document.getElementById('forms_user_account_registration_profile_al5').value = getAL5;
            var params = {address: getAL5, region: getCountryZk, key: key};
                $.getJSON(url + '?callback?', params, function(data) {
                  var misto_id = data['results'][0]['place_id'];
                  document.getElementById('forms_user_account_registration_profile_al5id').value = misto_id;
                });
          } else {document.getElementById('forms_user_account_registration_profile_al5').value = ""; document.getElementById('forms_user_account_registration_profile_al5id').value = "";}
          document.getElementById('forms_user_account_registration_profile_cityLat').value = place.geometry.location.lat();
          document.getElementById('forms_user_account_registration_profile_cityLng').value = place.geometry.location.lng();
      });

  } 
    
    
    var c = this;
    $('#forms_user_account_registration_profile_my_location').click(function(){
        c.geoFindMe($.pfcApp.GGKEY,$.pfcApp.user_lang);       
        return false;
    });               
               
               
    $('#forms_user_account_registration_profile_error').hide();
    
                                var options = {
                                    success: function(json){                                        
                                        if(json.succ === 'no') {
                                            $('#forms_user_account_registration_profile_error').html('<span class="after--none">'+json.msg+'</span>').show();
                                        } else {
                                            
                                           //we were successfull
                                           $.extend($.pfcApp.user, json);
                                           
                                           $.pfcApp.user.render();                                                              
                                           
                                           //update people FILTER
                                           $.pfcApp.getPage('people').render();
                                           
                                           
                                           $.pfcApp.openPage('#/user/account/registration/photo');
                                        }                                        
                                    },
                                    beforeSend:function() {
                                        //$.pfcEditor.ui.showWaitingBox();
                                    },
                                    error: function(response, status, err){
                                        //$.pfcEditor.ui.hideWaitingBox();
                                        $('#forms_user_account_registration_profile_error').html('<span>'+$tr('HTTP ACTION ERROR! Please repeat the action')+'</span>').show();
                                    }
                              //      dataType:  'json'
                            };
                            
                           $('#forms_user_account_registration_profile_startform').ajaxForm(options); 
                                                                                        
           } //__init
       } //page basic user registration           
    );
    
})(window, jQuery);
           
           

