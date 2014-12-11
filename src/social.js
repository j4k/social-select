(function (factory) {
    if (typeof define === 'function' && define.amd) { 
        // AMD
        define(['jquery', 'underscore'], factory);    
    } else {
        // No AMD.
        factory(jQuery, _);
    }
}
}(function ($, _) {
   
    // Defaults
    var defaults = {
        validAncestors: ['body'],
        twitterTpl: "https://twitter.com/intent/tweet?text="{{text}}"&url={{url}}",
        twitterMessageLimit: 140,
        emailHrefTemplate: "mailto:?subject={{subject}}&body="{{selection}}" {{url}}'"
    };

    // Set up vars
    var $body = $(document.body),
        $twitterEl,
        $emailEl;

    $.fn.socialSelect = function(){
        this.init = function(){
            if(!this.hasTouchScreen()) {
                $body.append($selectionSharing);
                $twitterEl = $('');
                $emailEl = $('');
                // set binds
                $('body').on('keypress keydown', _.debounce(this.updateSelection, 50)); 
                $('body').on('mouseup', _.debounce(this.updateSelection, 200));
                $('body').on('mousedown', _.debounce(this.updateSelection, 50));
            }
        };
        
        this.updateSelection = function(){
           var selection = window.getSelection && document.createRange && window.getSelection(),
               range,
               twitterMessage,
               twitterHref,
               emailHref;

           if( selection && selection.rangeCount > 0 && selection.toString() ){
               range = selection.getRangeAt(0);
               twitterMessage = range.toString();

               if(!$.fn.socialSelect.isValidSelection(range) ){
                // hideSelection()
                    return;
               }

           }
        };

        this.isValidSelection = function(range){
            return true;
        };

    };

}));

