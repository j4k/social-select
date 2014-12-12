;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "socialSelect",
        defaults = {
          container: 'body',
          validAncestors: ['article', 'section'],
          twitterTpl: "https://twitter.com/intent/tweet?text={{text}}&url={{url}}",
          twitterMessageLimit: 140,
          emailHrefTemplate: "mailto:?subject={{subject}}&body={{selection}} {{url}}'"
        };

    // Set up vars
    var $body = $(document.body),
        $twitterEl,
        $emailEl,
        // the template element
        $selectionSharing = '<div class="social-sharing">SocialSharingDiv</div>';

    function SocialSelect( element, options ) {
        // todo: fixme
        var that = this;
      
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;
      
        this.hasTouchScreen = (function(){
          return false;
        })();
      
        this.updateSelection = function(el, options){
           var that = that;
          
           // https://developer.mozilla.org/en-US/docs/Web/API/document.createRange
           var selection = window.getSelection && document.createRange && window.getSelection(),
               range,
               twitterMessage,
               twitterHref,
               emailHref;

           if( selection && selection.rangeCount > 0 && selection.toString() ){
               range = selection.getRangeAt(0);
               twitterMessage = range.toString();
            
               if( !isValidSelection(range) ){
                  hideSelection();
                  return;
               } 

             
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
            $selectionSharing.removeClass('social-share--active');
          }
        };
        
        this.init();
        
    }

    SocialSelect.prototype = {
      
        init: function() {
          
          var that = this;
          
          if( !that.hasTouchScreen ) {
                // inject markup
                $(that.options.container).append( $selectionSharing );
                // set binds
                $('body').on('keypress keydown', _.debounce( that.updateSelection, 50)); 
                $('body').on('mouseup', _.debounce( that.updateSelection, 200));
                $('body').on('mousedown', _.debounce( that.updateSelection, 50));
          
          }
          
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

$(function(){
  $('body').socialSelect();
});
