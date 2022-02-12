(function(window,$){
    
    $.extend($.pfc,  {

    component: function(name, parent, custom, path) {
          var bean = $.pfc.tagable(name, parent, $.extend({              
               
               isDecentComponent:true,
               __ctype: 'component', 
               
              tag: '<section />',
                                                                    
              INIT_CONTENT: false,
              INIT_CONTENT_TARGET: '.pfc-component-main-content-holder',
              INIT_REFRESH_PERIOD: 50,
              
              ALLWAYS_REINIT: false,
              
              loadContent: function(params,callback) {
                 var that = this; 
                 var target = that.getTag(that.INIT_CONTENT_TARGET).first();
                 var s = {};                    
                  
                  if(this.isDecentWebPage) {
                      var p = this.getParameters(); 
                      console.log(p)
                      for(var i in p) {
                          //console.log(i)
                        if(i === 'remove') {}
                        else {
                          eval('s.'+i+' = p[i]');
                        }
                      }
                      
                      console.log(s);
                  }  else {
                      console.log('no parameters for initContent');
                  }
                 
                 if(params) {s=$.extend(s,params);}
                 
                 $.get($link('page','ajax',that.path()+'/content'),s,function(data){
                         $(target).find('.pfc-main-preloader').hide();
                         $(target).find('.pfc-main-content').html(data);
                      
                    $(window).trigger('resize');
                    
                    console.log(' --> trigged INIT ' + that.name());
                    
                    if(!that.ALLWAYS_REINIT)
                    that.addState('inited');
                    
                    that.__init();                    
                    that.trigger('init');                                        
              
                    for(var i=0; i<that.count(); i++) {
                        if(typeof that.__components[i].init === 'function') {
                            that.__components[i].init();
                        }
                    }
                    
                    if(that.closestType('webapp'))
                    that.closestType('webapp').initContentListeners(target);  
                                                            
                      
                    if(typeof callback === "function") {
                        callback.call(that);
                    }
                                    
                   });  
              },
              init: function(callback, target) {                                    
                if(this.INIT_CONTENT) {
                    this.initContent(callback, this.getTag(this.INIT_CONTENT_TARGET).first());
                } else {
                                    
                  if(this.isConstructed) {  
                    console.log(' --> trigged INIT ' + this.name());
                    
                    
                    if(!this.ALLWAYS_REINIT)
                          this.addState('inited');
                          
                    this.__init();                    
                    this.trigger('init');                                        
              
                    for(var i=0; i<this.count(); i++) {
                        if(typeof this.__components[i].init === 'function') {
                            this.__components[i].init();
                        }
                    }
                        
                    if(typeof callback === "function") {
                        callback.call(this);
                    }
                  } else {
                      var that = this;
                      setTimeout(function(){
                         that.init(callback); 
                      }, this.INIT_REFRESH_PERIOD);
                  }
              } //end else INIT_CONTENT       
                  return this;                  
                 
                },                
                
                initContent: function(callback,target) {
                    console.log('ínitContent',this.path())
                    var that = this;
                    
                    
                    
                if(that.isConstructed) {      
                                                          
                  this.loadContent(null,callback);      
                 
                } else {
                      var that = this;
                      setTimeout(function(){
                         that.initContent(callback); 
                      }, that.INIT_REFRESH_PERIOD);
                  }
                },

                
                __init: function() {
                    //to be overriden
                },                
                activate: function(callback) {
                        console.log(' --> trigger ACTIVE for '+this.name());                                                
                        
                        this.addState('active');
                        this.__activate();                        
                        
                        this.trigger('activate');
                        
                        for(var i=0; i<this.__components.length; i++) {
                            if(typeof this.__components[i].activate === 'function') {
                                this.__components[i].activate();
                            }
                        }                        
                        
                        if(typeof callback === "function") {
                            callback.call(this);                        
                        }
                        
                        return this;                        
                    },
                
                deactivate: function(callback) {
                        console.log(' --> trigger DEACTIVATION for '+this.name());
                                                
                        this.removeState('active');
                        this.__deactivate();                        
                        
                        this.trigger('deactivate');
                        
                        for(var i=0; i<this.__components.length; i++) {
                            if(typeof this.__components[i].deactivate === 'function') {
                                this.__components[i].deactivate();
                            }
                        }                        
                        
                        if(typeof callback === "function") {
                            callback.call(this);                                     
                        }
                        
                        return this;                        
                    },
                
                __activate: function() {
                        //to be overridden
                    },
                
               __deactivate: function() {
                        //to be overridden  
                    },
                
                focus: function(callback) {
                        console.log(' --> trigger FOCUS for '+this.name());
                        
                        if(!this.is('active')) {
                            this.activate();
                        }
                        
                        this.addState('focused');
                        this.__focus();                        
                        
                        this.trigger('focus');
                        
                        //not focus components!!!
                        
                        if(typeof callback === "function") {
                            callback.call(this);
                        }
                        
                        return this;                        
                    },
                
                blur: function(callback) {
                        console.log(' --> trigger BLUR for '+this.name());
                                                
                        this.removeState('focused');
                        
                        this.__blur();
                        this.trigger('blur');
                        
                        for(var i=0; i<this.__components.length; i++) {
                            if(typeof this.__components[i].blur === 'function') {
                                this.__components[i].blur();
                            }
                        }
                        
                        if(typeof callback === "function") {
                            callback.call(this);                        
                        }
                        
                        return this;
                    },
                
                __focus: function() {
                      //to be overridden  
                    },
                
                __blur: function() {
                      //to be overridden  
                    },


                templates: {                                    
                  content: '<section />',
                  header: '<header />',
                  footer: '<footer />',
                  leftPanel: '<aside />',
                  rightPanel: '<aside />'
                },  
                getContent: function(selector) {
                  if(this.getTag(' > .pfc-content').length === 0) {  
                    if(this.getTag(' > .pfc-header').length === 0) {
                      this.getTag().prepend(  
                            $(this.templates.content).addClass('pfc-content')
                        );
                    } else {
                      this.getTag('.pfc-header').first().after(
                            $(this.templates.content).addClass('pfc-content')  
                        );  
                    }
                  }
                  
                  if(selector) {
                      return this.getTag('.pfc-content').first().find(selector);
                  }
                  return this.getTag('.pfc-content').first();
                },
                getHeader: function(selector) {
                    if(this.getTag(' > .pfc-header').length === 0) {
                      this.getTag().prepend(  
                            $(this.templates.header).addClass('pfc-header')
                        );
                    }
                    
                    if(selector) {
                      return this.getTag('.pfc-header').first().find(selector);
                    }
                    return this.getTag('.pfc-header').first();
                },
                getFooter: function(selector) {
                    if(this.getTag(' > .pfc-footer').length === 0) {
                      this.getTag().append(  
                            $(this.templates.footer).addClass(this.name()+'-footer')
                        );
                    }
                    if(selector) {
                      return this.getTag('.'+this.name()+'-footer').find(selector);
                    }
                    return this.getTag('.'+this.name()+'-footer');
                },
                getLeftPanel: function(selector) {
                  if(this.getTag('.'+this.name()+'-left-panel').length === 0) {  
                    if(this.getTag('.'+this.name()+'-header').length === 0) {
                      this.getTag().prepend(  
                            $(this.templates.leftPanel).addClass(this.name()+'-left-panel')
                        );
                    } else {
                      this.getTag('.'+bean.name()+'-header').after(
                            $(this.templates.leftPanel).addClass(this.name()+'-left-panel')  
                        );  
                    }
                  }
                  
                  if(selector) {
                      return this.getTag('.'+this.name()+'-left-panel').find(selector);
                  }
                  return this.getTag('.'+this.name()+'-left-panel');
                },
                
                getRightPanel:function(selector) {
                  if(this.getTag('.'+this.name()+'-right-panel').length === 0) {  
                    if(this.getTag('.'+this.name()+'-header').length === 0) {
                      this.getTag().prepend(  
                            $(this.templates.rightPanel).addClass(this.name()+'-right-panel')
                        );
                    } else {
                      this.getTag('.'+this.name()+'-header').after(
                            $(this.templates.rightPanel).addClass(this.name()+'-right-panel')  
                        );  
                    }
                  }
                  
                  if(selector) {
                      return this.getTag('.'+this.name()+'-right-panel').find(selector);
                  }
                  return this.getTag('.'+this.name()+'-right-panel');
                },
              
        
                          
                  
                  
              getLocalStorageLastStateImageKey: function() {
                return '___' + this.name() + '__' + 'LastStateImageKey'
                        + (this.rawctype() == "webapp" 
                            ? this.user.GUID 
                            : (this.closestCType('webapp') ? this.closestCType('webapp').user.GUID : ''));  
              },
              writeLastStateImage: function() {
                if(localStorage) {              
                    localStorage.setItem(
                            this.getLocalStorageLastStateImageKey(),
                            JSON.stringify(this.serializeLastStateImage())
                              );
                }  
              },
              serializeLastStateImage: function() {
                return this;  
              },
              getLastStateImage: function() {
                var image = null;

                if(localStorage) {
                  image = localStorage.getItem(this.getLocalStorageLastStateImageKey());
                }

                if(image) {
                   return JSON.parse(image);     
                } else {
                   return null;     
                }          
              },
              
              service: function(name, params, type) {
                  
                  
              }
              
          },custom ? custom : {}),path);     
          
          
          
          return bean;
       }//component
       
    });


})(window, jQuery);

