;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "socialSelect",
        defaults = {
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
        $selectionSharing = '<div>SocialSharingDiv</div>';

    function SocialSelect( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    SocialSelect.prototype = {
      
        init: function() {
           if( !this.hasTouchScreen() ) {
                $body.append($selectionSharing);
                $twitterEl = $('');
                $emailEl = $('');
                // set binds
                $('body').on('keypress keydown', _.debounce( this.updateSelection, 50) ); 
                $('body').on('mouseup', _.debounce( this.updateSelection, 200) );
                $('body').on('mousedown', _.debounce( this.updateSelection, 50) );
           }
        },

        updateSelection: function(el, options) {
           var selection = window.getSelection && document.createRange && window.getSelection(),
               range,
               twitterMessage,
               twitterHref,
               emailHref;

           if( selection && selection.rangeCount > 0 && selection.toString() ){
               range = selection.getRangeAt(0);
               twitterMessage = range.toString();
              
                console.log(twitterMessage);
             
               if( !this.isValidSelection(range) ){
                  this.hideSelection()
                  return;
               }
           }
        },

        isValidSelection: function( range ){
            console.log( range );
            // check whether or not we have a valid ancestor,
            // check range
            return true;
        },

        hideSelection: function(){
            
            console.log('this');
          //return true;
        },

        showSelection: function(){
            return true;
        },

        hasTouchScreen: function(){
            return false;
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
