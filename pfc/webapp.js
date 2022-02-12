(function(window,$){

    $.extend($.pfc, {

    webapp: function(name, parent, custom) {
          var bean = $.pfc.component(name, parent, $.extend({
              isDecentWebApp:true,
              __ctype: 'webapp',
              tag: 'body',

            USE_GA: true, //use google analytics

            acceptUrlPrefix: '#/',
            acceptUrlPrefixCharCount: 2,

            defaultRoute: '#/dashboard',
            error404Route: '#/error404',
            restrictedAreaRedirectRoute: '@/user/account/login',

            __pages: [],

            OPEN_PAGE_ANIMATION_DURATION: 350,

            user: {
              uid: 0,
              dirname: "_guest",
              name: "Guest",
              email: '',
              isLogged: function() {return this.uid > 0;},
              render: function() {}
            },

            getPage: function(name) {
              var pagename = this.__setBeanname(name);
              for(var i=0;i<this.__pages.length;i++) {
                  if(typeof this.__pages[i].rawname === 'function'
                    && this.__pages[i].rawname() === pagename) {
                      return this.__pages[i];
                  }
              }
              return null;
            },
            __addPage: function(page) {
                this.__pages.push(page);
                return this;
            },
            removePage: function(name) {

            },
            page: function(name, custom, path) {
                var pagebean = $.pfc.component(name, this, $.extend({
                    isDecentWebPage: true,
                    __ctype: 'webpage',

                    __parameters: [],

                    INIT_CONTENT_TARGET: '.pfc-page-main-content-holder',


                    tag: '#pfc-page-'+this.__setBeanname(name),

                    getHtmlId: function() {
                        return 'pfc-page-'+this.rawname();
                    },

                    setParameters: function(params) {
                        //reset old ones
                        this.__parameters = [];

                        //parse new params
                        var rawparams = params.split('&');
                        var name, value;
                        for(var i=0; i<rawparams.length; i++) {
                            name = rawparams[i].substr(0, rawparams[i].indexOf("=") );
                            value = rawparams[i].substr( rawparams[i].indexOf("=")+1 );
                            this.__parameters[name]= urldecode(value);
                        }

                        return this;
                    },

                    getParameters: function(name) {
                        if(name) {
                            return this.__parameters[name];
                        } else {
                            return this.__parameters;
                        }
                    },

                    openPage: function() {
                      //to be overriden
                    },

                    closePage: function() {
                      //to be overriden
                    }

                }, custom ? custom : {}),path);

                this.__addPage(pagebean);

                return this;
            }, //page


        initInnerPagesLinks: function(content) {
          var siteUrl = window.location.href.split('#');
          var webapp = this;
          content.find("a[href^='"+siteUrl[0]+webapp.acceptUrlPrefix+"'],a[href^='"+webapp.acceptUrlPrefix+"']").click(function() {
                       var hash = $(this).attr('href');
                       var title = $(this).text();

                       hash = hash.split('#');
                       hash = '#'+hash[1];

                     var isPageRequest = (hash.substr(0,webapp.acceptUrlPrefixCharCount) === webapp.acceptUrlPrefix);
                     if(isPageRequest) {
                            webapp.openPage(hash);
                        }
                   });
        },
        initContentListeners: function(content) {
          //this.initInnerPagesLinks(content);
          this.trigger('initContentListeners',[content]);
        },
        getActivePage: function() {
            var currentUrl = window.location.href;
            var currentPageUrl = currentUrl.split('#');

            var url = currentPageUrl[1] ? currentPageUrl[1].split('?') : [""];

            var id = this.__setBeanname(url[0]);
            id = id.substr(this.acceptUrlPrefixCharCount-1);
            //console.log(id);
            for(var i=0;i<this.__pages.length;i++) {
                //console.log(this.__pages[i].rawname());
                if(this.__pages[i].rawname() === id) {
                    return this.__pages[i];
                }
            }

            return null;
        },
        openPage: function(hash,isHistoryBrowsing) {
            var currentUrl = window.location.href;
            var currentPageUrl = currentUrl.split('#');
            var links = $("a[href^='"+currentUrl+"'],a[href='"+hash+"']");

            //if(links.hasClass('pfc-state-opening-webapp-webpage')) {
            //    return;
            //}

            if(!isHistoryBrowsing) {
                     if (window.history && window.history.pushState) {
                         window.history.pushState(hash, hash, hash);
                     }
            }

            var url = hash.split('?');

            var id = this.__setBeanname(url[0]);
            id = id.substr(this.acceptUrlPrefixCharCount);

            var selector = '#pfc-page-'+id;

            if(!$(selector).length) {
                console.log('::> webapp NOT EXISTING Page -> ' + id);
                return this.openPage(this.error404Route,true);
            } else if($(selector).hasClass('pfc-logged-user-only') && !this.user.isLogged()) {
                return this.openPage(this.restrictedAreaRedirectRoute,true);
            } else {
                console.log('::> webapp openPage -> ' + id);
            }

                      links.addClass('pfc-state-opening-webapp-webpage');

                      $("a[href^='"+currentPageUrl[0]+this.acceptUrlPrefix+"'],a[href^='"+this.acceptUrlPrefix+"']")
                              .removeClass('pfc-state-active-webapp-webpage-href');

                      var last_opened = $('.pfc-state-focused-webapp-webpage');
                      var that = this;
                      if(last_opened.length
                          && this.getPage(str_replace('pfc-page-','',last_opened.attr('id')))
                          && typeof this.getPage(str_replace('pfc-page-','',last_opened.attr('id'))).blur === 'function'
                        ) {
                            if(typeof this.getPage(str_replace('pfc-page-','',last_opened.attr('id'))).deactivate === 'function') {
                                this.getPage(str_replace('pfc-page-','',last_opened.attr('id'))).deactivate();
                            }

                            this.getPage(str_replace('pfc-page-','',last_opened.attr('id'))).blur(function(){

                            });
                      }

                      if(last_opened.length
                            && this.getPage(str_replace('pfc-page-','',last_opened.attr('id')))
                            && typeof this.getPage(str_replace('pfc-page-','',last_opened.attr('id'))).closePage === "function"
                        ) {
                            this.getPage(str_replace('pfc-page-','',last_opened.attr('id'))).closePage();
                        }

                      $('.pfcApp-page').css('display','none');

                              var pagename = id;
                              var pageparams = [];

                            if(url[1])
                              if(this.getPage(pagename)
                                      && typeof this.getPage(pagename).setParameters === 'function'
                                      && typeof this.getPage(pagename).getParameters === 'function'
                                  ) {
                                    this.getPage(pagename).setParameters(url[1]);
                                    pageparams = this.getPage(pagename).getParameters();
                              } else {
                                        var rawparams = url[1].split('&');
                                        var name, value;
                                        for(var i=0; i<rawparams.length; i++) {
                                            name = rawparams[i].substr(0, rawparams[i].indexOf("=") );
                                            value = rawparams[i].substr( rawparams[i].indexOf("=")+1 );
                                            pageparams[name]= urldecode(value);
                                        }
                             }

                      this.trigger('openPage',[pagename, selector, pageparams]);

                      if(this.getPage(pagename) && this.getPage(pagename).INIT_CONTENT
                            && (!this.getPage(pagename).hasState('inited') || this.getPage(pagename).ALLWAYS_REINIT)
                        ) {
                         $(selector).find('.pfc-main-preloader').show();
                         $(selector).find('.pfc-main-content').html('');
                      }

                      if(this.getPage(pagename) && typeof this.getPage(pagename).activate === 'function')
                      { this.getPage(pagename).activate(); }


                      var webapp = this;
                      $(selector).slideDown(this.OPEN_PAGE_ANIMATION_DURATION, function(){

                               if(webapp.getPage(pagename)
                                      && typeof webapp.getPage(pagename).hasState === 'function'
                                      && !webapp.getPage(pagename).hasState('inited')
                                      && typeof webapp.getPage(pagename).init === 'function'
                                  ) {
                                       webapp.getPage(pagename).init(function(){

                                        if(typeof webapp.getPage(pagename).openPage === 'function')
                                            { webapp.getPage(pagename).openPage(); }

                                        if(typeof webapp.getPage(pagename).focus === 'function')
                                            { webapp.getPage(pagename).focus(); }
                                    });
                              } else if(webapp.getPage(pagename)) {
                                        if(typeof webapp.getPage(pagename).openPage === 'function')
                                            { webapp.getPage(pagename).openPage(); }

                                        if(typeof webapp.getPage(pagename).focus === 'function')
                                            { webapp.getPage(pagename).focus(); }
                                  } else {
                                      console.log('!!!',pagename)
                                  }

                            links.addClass('pfc-state-active-webapp-webpage-href');
                            links.removeClass('pfc-state-opening-webapp-webpage');

                          $(window).trigger('resize');

                          webapp.trigger('pageOpened',[pagename,selector,pageparams]);
                      });
            /*
            if(this.USE_GA) {
                ga('send', 'event', id, 'openPage');
            }
            */
        },

        initRoutesListener: function() {
          var webapp = this;

                    //ROUTER
                    window.onpopstate = function(e){

                      if (e.state && e.state.html) {
                          var hash = e.state.html;
                      }
                      else if (e.state) {
                          var hash = e.state;
                      } else {
                       var hash = window.location.hash;
                      }

                        //if href attr change or something
                        if(hash)
                        var isPageRequest = (hash.substr(0,webapp.acceptUrlPrefixCharCount) === webapp.acceptUrlPrefix);
                        if(isPageRequest) {
                            webapp.openPage(hash,true);
                        }

                   }; //onpoupstate

                   //HREF LISTENERS
                   this.initContentListeners(this.getTag());
                   /*
                   var siteUrl = window.location.href.split('#');
                   $("a[href^='"+siteUrl[0]+webapp.acceptUrlPrefix+"'],a[href^='"+webapp.acceptUrlPrefix+"']").click(function() {
                       var hash = $(this).attr('href');
                       var title = $(this).text();

                       hash = hash.split('#');
                       hash = '#'+hash[1];

                     var isPageRequest = (hash.substr(0,webapp.acceptUrlPrefixCharCount) === webapp.acceptUrlPrefix);
                     if(isPageRequest) {
                            webapp.openPage(hash);
                        }
                   });
                   */
                   //STARTING PAGE
                   var hash = window.location.hash;
                   var webapp_inner_href = hash.substr(0,webapp.acceptUrlPrefixCharCount) === webapp.acceptUrlPrefix;
                   //$('#pfcApp-main-section-preloader').hide();
                   if (hash && webapp_inner_href) {
                     //if(!webapp.user.isLogged()) hash = webapp.defaultRoute;
                     console.log('webapp opening start page ' + hash);
                     webapp.openPage(hash);
                   } else {
                      //silent is golden -> we are homepage
                      console.log('webapp start DEFAULT-ROUTE '+webapp.defaultRoute);
                      webapp.openPage(webapp.defaultRoute);
                   }
        },


                     //to be overriden
           base_url: window.location.href,
           componentlink: function(type, path) {
               return this.base_url+'__pfcComponent/'+path+(type==='content'?'':'.'+type);
           },
           layoutlink: function(type, path) {
               return this.base_url+'__pfcLayout/'+path+(type==='content'?'':'.'+type);
           },
           pagelink: function(type, path) {
               if(type==='content') {
                    var url = window.location.href;
                    url = url.split('?');
                    url = url[0].split('#');
                    return url[0]+this.acceptUrlPrefix+path;
               } else {
                    return this.base_url+path+'.'+type;
               }
           },

       __cfactory: [],
       componentFactory: function(name, parent, custom, path) {
           return $.pfc.component(name, parent,
                $.extend(
                   custom ? custom : {},
                   this.__cfactory[path ? path : name],
                   custom ? custom : {}
                 ),
                    path
                );
       },
       componentFactoryAdd: function(name, custom) {
           this.__cfactory[name] = custom;
       },

        ui: {
            isSoundOn: true,
            playSound: function(name) {
              if(this.isSoundOn) {

              }
            },
            sound: function(name) {

            },

            showWaitingBox: function() {
                $('#pfc-editor-waiting-box').show();
            },

            hideWaitingBox: function() {
                $('#pfc-editor-waiting-box').hide();
            },

            alert: function(text,settings) {
              if(!settings.type)
                 pfcSoundsManager.play('sound-ui-alert');
              else if(settings.type && settings.type=='err')
                pfcSoundsManager.play('sound-ui-error');

                $.pfcAlert(text,settings);
                //alert(text.replace("<br>","\n"));
            },

            confirm: function(question,yesfunction,params) {
                $.pfcConfirm(question,yesfunction,params);
                //if(window.confirm(question.replace("<br>","\n")))
                //{
                //    success();
                //}
            },

            prompt: function(result,params) {
                //var res = window.prompt();
                //result(res);
               $.pfcPrompt(result,params);
            },

            dialog: function(url,options) {
               $.pfcDialog(url,options);
            }

        } //end ui


        },custom ? custom : {}));

      bean.on('init', function(){
         console.log(this.name()+' init routes listener')
         this.initRoutesListener();
      });

      return bean;

    } //webapp

    }); //$.extend


})(window, jQuery);
