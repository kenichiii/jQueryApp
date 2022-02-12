
                                  

(function(window,$){
    



 function parseObjectAttr(source, target, method) { 
 
    if(typeof source.each === 'function') {
        eval('target.'+(method ? method : 'append')+'(source)');
        return;
    }
    
 
    for (var key in source) {
        if(typeof source[key] === 'function') {          
            if(typeof eval('target.'+key) === 'function') {
               eval('target.'+key+'(source[key]);');  
            }
         } else if(typeof source[key] === 'object') {
            //source[key](target);             
        } else {
          target.attr(key, source[key]);
        }
    }
}

function parseListArray(source, parent, method) {    
    
     var li = $('<li />');
      
        if(typeof source === 'object'  && typeof source[0] === 'string') {
            parseArrayElement(source, li, 'append', 'span');
        } else if(typeof source === 'object'  && typeof source[0] === 'object') {
            parseHtmlArray(source, li, 'li')          
        } else if(typeof source === 'object') {
            parseObjectAttr(source, li);  
        } else if(typeof source !== undefined) {
            li.append(source);
        } 
        
      eval('parent.'+(method ? method : 'append')+'(li)');          
}

function parseHtmlArray(source, parent, method, tagname) {        
    
      for(var i=0;i<source.length;i++) {
         if(tagname && (tagname.toLowerCase() == 'ul' || tagname.toLowerCase() === 'ol')) {
            parseListArray(source[i], parent, tagname);
        } else if((typeof source[i] === 'object' || typeof source[i] === 'array') && typeof source[i][0] === 'string') {
            parseArrayElement(source[i], parent);
        } else if((typeof source[i] === 'object' || typeof source[i] === 'array') && typeof source[i][0] === 'object') {
            parseHtmlArray(source[i], parent, tagname)    
        } else if(typeof source[i] === 'object') {                 
           parseObjectAttr(source[i], parent)
        } else if(typeof source[i] !== undefined) {
            eval('$(parent).'+(method ? method : 'append')+'(source[i])');
        } 
      }                
}

function parseArrayElement(source, target, method, default_html_element) {
     var DEFAULT_HTML_ELEMENT = default_html_element ? default_html_element : 'div';          
          
     if((typeof source[0] === 'object' || typeof source[0] === 'array') && typeof source[0][0] === 'object') {
        parseHtmlArray(source[0], $(target), method,$(target).tagName);
     } else if((typeof source[0] === 'object' || typeof source[0] === 'array') && typeof source[0][0] === 'string') {
        parseArrayElement(source[0], $(target),method);        
     } else if(typeof source[0] === 'object') {
         source[2] = source[1];
         source[1] = source[0];
         source[0] = DEFAULT_HTML_ELEMENT;
     } 
     
     if(typeof source[0] === 'string') {
     
     var element = source[0];     
     var attr = source[1];
     var html = source[2];
     
     var element_first_char = element.substr(0,1);
     
     if(element_first_char === '#' || element_first_char === '.') {
        element = DEFAULT_HTML_ELEMENT + element; 
     }                                                       
     
         //we have tag
         var tagname;
         var testid = element.split('#');         
         var testclass = testid[0].split('.');
         var testclass2 = testid[1] ? testid[1].split('.') : [];
         var classes = [];
         
         for(var t1=1;t<testclass.length;t1++) {
           classes.push(testclass[t1]);
         }
         
         for(var t=1;t<testclass2.length;t++) {
           classes.push(testclass2[t]);
         }
         
         tagname = testclass[0];
         var template = $('<'+tagname+' />');
         
         if(testclass2[0]) {
             //we have tag with id
             template.attr('id',testclass2[0]);
         } 
         
          if(classes.length) {
             //we have tag with class
             for(var c=0;c < classes.length;c++) {
                template.addClass(classes[c]);
             }
         }
         
        for(var i=1;i<source.length;i++) {
                 if((typeof source[i] === 'object'  || typeof source[i] === 'array') && typeof source[i][0] === 'string') {                     
                     parseArrayElement(source[i], template);                     
                 } else if((typeof source[i] === 'object'  || typeof source[i] === 'array')&& typeof source[i][0] === 'object') {                     
                     parseHtmlArray(source[i], template, tagname);                     
                 } else if(typeof source[i] === 'object') {
                     parseObjectAttr(source[i], template);
                 } else if(typeof attr !== undefined) {
                     template.append(source[i]);
                 }                        
        }
                                       
          eval('$(target).'+(method ? method : 'append')+'(template)');
        }
}



function pfc(template,layout,method){var res = layout ? $(layout) : $('<div />'); $.pfc.template(template,res,method); return res;}


    
    
    $.pfc = {
       __GUID: 1, 
       guid: function() {
         return this.__GUID++;         
       },    
template : function(source, target, method,default_html_element) {        
    if((typeof source === 'object' || typeof source === 'array') && typeof source[0] === 'object') {
        parseHtmlArray(source, $(target),method);
    } else if((typeof source === 'object' || typeof source === 'array') && typeof source[0] === 'string') {    
        parseArrayElement(source, $(target), method,$(target).tagName);
    } else if(typeof source === 'object') {
        parseObjectAttr(source, target, method,default_html_element);
    } else { //if(typeof source === 'string') {
        eval('$(target).'+method+'(source)');
    }
},     
       bean: function(name, parent, custom, path) {
           var bean = $.extend({
              isDecentBean: true,               
              isConstructed: false,
              
               __path: path ? path : name,
               
               __name: name,
               __ctype: 'bean',                              
               __guid: this.guid(),    
               
               __components: [],
               __events: [],
                              
               __construct: function(callback) {
                  //get html
                  if(this.isDecentTag) {
                      this.getTag();
                  }
                  
                  //to be overriden    
                  callback.call(this);  
                },
       
               __setBeanname: function(name) {
                    return str_replace('/','_',name);
               },
               
               getParent: function() {
                  return parent;  
                },
                
               guid: function() {
                  return this.__guid;  
               },
               rawname: function() {return this.__setBeanname(this.__name);},
               rawctype: function() {return this.__ctype;},
               path:  function() {return this.__path;},
               name: function(name) {
                    if(this.getParent() && typeof this.getParent().name === "function") {
                        return this.getParent().name(this.rawname()+(name ? '-'+name : '-'+this.rawctype()));
                    } else {
                        return this.rawname()+(name ? '-'+name : '-'+this.rawctype());
                    }
                },                
                ctype: function(name) {
                    if(this.getParent() && typeof this.getParent().ctype === "function") {
                        return this.getParent().ctype(this.rawctype()+(name ? '-'+name : ''));
                    } else {
                        return this.rawctype()+(name ? '-'+name : '');
                    }
                },
               
               on: function(name, fn) {
                    if(!this.__events[name]) {
                        this.__events[name]= [];
                    }  
                    
                    this.__events[name].push(fn);
                    return this;
               },
               
               trigger: function(name, params) {
                    if(this.__events[name]) {
                        for(var i = 0; i < this.__events[name].length; i++) {
                            this.__events[name][i].apply(this, params ? params : []);
                        }
                    }
                    return this;
                },
                
                
               foreach: function(fn) {
                 for(var i = 0; i < this.count(); i++) {
                     if(fn.apply(this, [i, this.__components[i]]) === false) {
                         break;
                     }
                 }  
                 return this;
               },
               count: function() {
                  return this.__components.length; 
               },
               getIndex: function(index) {
                  return this.__components[index];   
               },
               add: function(bean) {                   
                   if(bean && bean.isDecentBean === true) {
                       
                   } else {
                       var decent = $.pfc.bean("item"+this.count().toString(),
                            this, {
               
                            }
                       );
                       $.extend(bean, decent, bean);
                   }
                   
                                      
                   //do html change -> add
                   this.__components.push(bean);
                   var index = this.count()-1;
                   this.trigger("add",[index, bean]);
                   
                   return this;
               },
 
               set: function(index, bean) {
                   if(bean && bean.isDecentBean === true) {
                       
                   } else {
                       var decent = $.pfc.bean("item"+this.count().toString(),
                            this, {
               
                            }
                       );
                       $.extend(bean, decent, bean);
                   }
                                                       
                  this.__components[index] = bean;    
                  this.trigger("set",[index, bean]); 
                  
                  return this;
               },
               
               remove: function(index) {  
                   
                   this.trigger("remove",[index,this.__components[index]]); 
                   
                   //do html change -> remove
                   this.__components.remove(index);
                   return this;
               },
               
               getId: function(guid) {
                  for(var i = 0; i < this.count(); i++) {
                       if(this.__components[i].guid() == guid) {
                           return this.__components[i];
                       }
                   }
                   
                   return null;
               },    
               getNameIndex: function(name) {
                   var cname = this.__getBeanname(name);
                   for(var i = 0; i < this.count(); i++) {
                       if(this.__components[i].rawname() == cname) {
                           return i;
                       }
                   }
                   
                   return null;
               },
               getType: function(ctype) {
                  var list = []; 
                  for(var i = 0; i < this.count(); i++) {
                       if(this.__components[i].rawctype() == ctype) {
                           list.push(this.__components[i]);
                       }
                   }
                   
                   return list;
               },                   
               get: function(name) {
                   var cname = this.__setBeanname(name);
                   for(var i = 0; i < this.count(); i++) {
                       if(this.__components[i].rawname() == cname) {
                           return this.__components[i];
                       }
                   }
                   
                   return null;
               },               
                
               closest: function(name) {
                  if(this.getParent() && this.getParent().isDecentBean) {
                      if(this.getParent().rawname() == name) {return this.getParent();}
                      return this.getParent().closest(name);
                  }  
                  return null;
                },
               
               closestType: function(name) {
                  if(this.getParent() && this.getParent().isDecentBean) {
                      if(this.getParent().rawctype() == name) {return this.getParent();}
                      return this.getParent().closestType(name);
                  }  
                  return null;
                },
               getWebApp: function() {
                   if(this.rawctype() === 'webapp') return this;
                   return this.closestType('webapp');
               }, 
               getWebAppUI: function() {
                   if(this.rawctype() === 'webapp') return this.ui;
                   return this.getWebApp().ui;
               },
               getUser: function() {
                    if(this.rawctype() === 'webapp') return this.user;
                    return this.getWebApp().user;
               },
               getRootParent: function() {
                  if(this.getParent() && this.getParent().isDecentBean) {                      
                      return this.getParent().getRootParent();
                  }    
                  return this;
                },
                
               addComponent: function(name, custom, cname) {
                 this.add(   
                   $.pfcApp.componentFactory(
                            name,
                            this,
                            custom,
                            cname
                    ));
            
                  return this;    
               } 
                
           }, custom ? custom : {});
           
           bean.__construct(function(){
               this.isConstructed = true;
           });
           
           return bean;
       },
       
       tagable: function(name, parent, custom, path) {
            var bean = $.pfc.bean(name, parent, $.extend({                
                
                __ctype: 'tag',
                isDecentTag: true,
                
                tag: '<span />',          
                                              
                pfc: function(source, method, default_html_element){
                    return pfc(source,this.getTag(),method,default_html_element);
                },  
                assign: function(element) {
                  this.tag = $(element);                  
                  
                  this.getTag().addClass(this.name());
                  this.getTag().addClass(this.ctype());
          
                   if(this.template) {
                      this.pfc(this.template);
                   } 
                    
                    
                  this.trigger("assign");
                  
                  return this;
                },
                getTag: function(selector) { 
                    if(typeof this.tag === "string") {
                        this.assign(this.tag);
                    }
                    
                    if(selector) {
                        return this.tag.find(selector);
                    }
                    
                    return this.tag;
                },
                
                is: function(state) {
                    return this.hasState(state);  
                },
                hasState: function(state) {
                    return this.getTag().hasClass('pfc-state-'+state+'-'+this.ctype());
                },
                addState: function(state) {                    
                    this.getTag().addClass('pfc-state-'+state+'-'+this.ctype());
                    return this;
                },
                removeState: function(state) {
                    this.getTag().removeClass('pfc-state-'+state+'-'+this.ctype());
                    return this;
                }
                                                                                                
            },custom ? custom : {}),path);                 
            
            return bean;
       }
       
       
    };


})(window, jQuery);
