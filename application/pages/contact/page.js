
(function(window, $){
    
    $.pfcApp.page(
       'contact', {
           
           getPageTitle: function(){return 'Contact';},
           getPageType: function(){return 'others';},
           getPageCategory: function(){return ['contact'];},
           
           __construct: function(callback) {
               
               this.addComponent('form/contact');
               
               if(typeof callback === 'function') {
                    callback.call(this);
               }
           }
       } //custom
    ); //page 
        
})(window, jQuery);

