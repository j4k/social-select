;(function ( $, window, document, undefined ) {

    // Defaults
    var pluginName = "socialSelect",
        defaults = {
          container: 'body',
          validAncestors: ['article', 'section'],
          twitterTpl: "https://twitter.com/intent/tweet?text={{twitterMessage}}&url={{url}}",
          twitterMessageLimit: (function(){
            // allow a space between the url and the text
            return 139 - window.location.href.length;
          })(),
          emailHrefTemplate: "mailto:?subject={{subject}}&body={{selection}} {{url}}'"
        };

    // Set up vars
    var $body = $(document.body),
        // the template element
        $selectionSharing = $('<div class="social-sharing" aria-role="menu" aria-label="Share Selection" aria-hidden="true" tabindex="-1">'+
                              '<a href="" target="_blank" class="js-social-twitter" aria-role="menuitem" tabindex="-1">Twitter</a>' +
                              '<a href="" class="js-social-email" aria-role="menuitem" tabindex="-1">Email</a>' +
                              '</div>');

    // Debounce - underscore clone
    var debounce = function(func, wait, immediate) {
      var timeout, args, context, timestamp, result;
      var now = Date.now || function() {
        return new Date().getTime();
      };
       
      var later = function() {
        var last = now() - timestamp;
         
        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          }
        }
      };
     
      return function() {
        context = this;
        args = arguments;
        timestamp = now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
       
        return result;
      };
    }; 


    function SocialSelect( element, options ) {

        var that = this;
      
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;
      
        this.hasTouchScreen = (function(){
          return 'ontouchstart' in window || navigator.mxMaxTouchPoints;
        })();
      
        this.updateSelection = function(ev){
           var selection = window.getSelection && document.createRange && window.getSelection(),
               range,
               twitterMessage,
               twitterHref,
               emailHref;

           if( selection && selection.rangeCount > 0 && selection.toString() ){
               range = selection.getRangeAt(0);
               twitterMessage = range.toString();
               
               // truncate twitterMessage if applicable
               this.options.twitterMessage = twitterMessage.length > this.options.twitterMessageLimit ?
                                twitterMessage.substring(0, this.options.twitterMessageLimit) :
                                twitterMessage;
              
               this.options.subject = "Share from: " + window.location.href;
               this.options.selection = selection;

               // validate selection
               if( !isValidSelection(range) ){
                  hideSelection();
                  return;
               } 

               var bounds = range.getBoundingClientRect();
               // position the el 
               $selectionSharing.css({
                   top: bounds.top - $selectionSharing.height(),
                   left: (bounds.left + (bounds.width / 2))
               });

               // update the urls on the share buttons 
               $('.js-social-twitter').attr('href', this.template( this.options.twitterTpl) );
               $('.js-social-email').attr('href', this.template( this.options.emailHrefTemplate) );
               
               showSelection();

           } else {

               hideSelection();

           }
          
        };
      
        var isValidSelection = function(range){
          var options = that.options;
          
          var parent = range.commonAncestorContainer.nodeName === '#text' ?
              range.commonAncestorContainer.parentElement : range.commonAncestorContainer;
          
          return $(parent).closest( options.validAncestors.join(',') ).length ? true : false;
        };
      
        var hideSelection = function(){
          if ($selectionSharing.hasClass('social-share--active')) {
            $selectionSharing.removeClass('social-share--active');
            $selectionSharing.attr({'aria-hidden': true, 'tabindex': -1}).find('a').attr('tabindex', -1);
          }
        };
      
        var showSelection = function(){
          if (!$selectionSharing.hasClass('social-share--active')) {
            $selectionSharing.addClass('social-share--active');
            $selectionSharing.attr({'aria-hidden': false, 'tabindex': 1}).find('a').attr('tabindex', 0);
          }
        };
        
        this.init();
        
    }

    SocialSelect.prototype = {
      
        init: function() {
          if( !this.hasTouchScreen ) {
              // inject markup
              $(this.options.container).append( $selectionSharing );
              // set binds
              //$('body').on('keypress keydown', _.debounce( that.updateSelection, 50)); 
              $(this.options.container).on('mouseup', debounce( $.proxy(this, 'updateSelection'), 200));
              $(this.options.container).on('mousedown', debounce( $.proxy(this, 'updateSelection'), 200));
              // set url
              this.options.url = window.location.href;
          }
       },

       template: function(template) {
          var re = /(?:{{2})([a-zA-Z]+)(?:}{2})/g,
              match;

          while ( match = re.exec( template ) ) {
            // these lines iterate over the template strings, and replace the {{ }} bit with the matching
            // option variable
            template = template.replace( match[0], encodeURIComponent( this.options[ match[1] ]));
          }
            
          return template;
       }

    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new SocialSelect( this, options ));
            }
        });
    };

})( jQuery, window, document );

