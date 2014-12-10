
;(function ( $, window, document, undefined ) {
 
    // Create the defaults once
    var pluginName = "socialSelect",
        defaults = {
            validAncestors: ['body'],
            twitterTpl: "https://twitter.com/intent/tweet?text="{{text}}"&url={{url}}",
            twitterMessageLimit: 140,
            emailHrefTemplate: "mailto:?subject={{subject}}&body="{{selection}}" {{url}}'
        };

    // Set up variables
    var $body = $(document.body),
        $twitterAction,
        $emailAction;
    
 
    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
 
        this.options = $.extend( {}, defaults, options) ;
 
        this._defaults = defaults;
        this._name = pluginName;
 
        this.init();
    }
 
    Plugin.prototype.init = function () {
        if(!this.hasTouchScreen()) {
            $body.append($selectionSharing);
            $twitterEl = $('');
            $emailEl = $('');
            // set binds
            $('body').on('keypress keydown', _.debounce(updateSelection, 50)); 
            $('body').on('mouseup', _.debounce(updateSelection, 200));
            $('body').on('mousedown', _.debounce(updateSelection, 50));
        }
    };
 
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    }
 
})( jQuery, window, document );
