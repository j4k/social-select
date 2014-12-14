;(function ( $, window, document, undefined ) {

    // Defaults
    var pluginName = "socialSelect",
        defaults = {
          container: 'body',
          validAncestors: ['article', 'section'],
          twitterTpl: "https://twitter.com/intent/tweet?text={{twitterMessage}}&url={{url}}",
          twitterMessageLimit: 140,
          emailHrefTemplate: "mailto:?subject={{subject}}&body={{selection}} {{url}}'"
        };

    // Set up vars
    var $body = $(document.body),
        $twitterEl,
        $emailEl,
        // the template element
        $selectionSharing = $('<div class="social-sharing"><a href="" target="_blank" class="js-social-twitter">Twitter</a><a href="" class="js-social-email">Email</a></div>');

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
               this.options.twitterMessage = twitterMessage > this.options.twitterMesssageLimit ?
                                twitterMessage.substring(0, this.options.twitterMessageLimit) :
                                twitterMessage;
                
               this.options.subject = "test subject";
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
               $('.js-social-twitter').attr('href', this.template(this.options.twitterTpl));
               $('.js-social-mail').attr('href', this.template(this.options.emailHrefTemplate));
               
               showSelection();

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
          }
        };
      
        var showSelection = function(){
          if (!$selectionSharing.hasClass('social-share--active')) {
            $selectionSharing.addClass('social-share--active');
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
              $(this.options.container).on('mouseup', _.debounce( $.proxy( this, 'updateSelection'), 200));
              $(this.options.container).on('mousedown', _.debounce( $.proxy( this, 'updateSelection'), 200));
              // set url
              this.options.url = window.location.href;
          }
       },

       template: function(template) {
          var re = /(?:{{2})([a-zA-Z]+)(?:}{2})/g,
              match,
              string = template;

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

