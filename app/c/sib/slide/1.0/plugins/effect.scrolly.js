define(function(require, exports, module){
    var $ = require('../../../core/1.0/jQuery+'),
        scrollx = require('./effect.scrollx'),
        Sib = require('../../../core/1.0/Sib');

    var scrolly = $.extend({}, scrollx, {

        initScroll : function(  oChoose ){
            var bodyTmpl = '<div class="{clsPrefix}-content"></div>';

            if($el[0] == state.$body[0]) { //panel层与Slide间没有body
                state.$body = $panels.wrapAll(Sib.unite(bodyTmpl, oChoose.constructor)).parent();
            }
        },
        switchEffect : function(oChoose, index){
            var state = oChoose.state,
                opts = state.options,
                $panels = state.$panels,
                $body = state.$body,
                $to = $panels.eq(index),
                self = this;

            state.anim = $body.animate({
                top : -1*$to.position().top + 'px'
            }, opts.duration, opts.easing, function () {
                state.anim = null;
                if(opts.bodyAutoSize) $body.parent().width($to.outerWidth());
                self.afterChange(oChoose, index);
            });
        },
        fixPreCarousel : function( oSlide ){
            var state = oSlide.state,
                $body = state.$body, 
                $panels = state.$panels,
                opts = state.options;

            $body.css('top', -1*$panels.eq(state.activeIndex).position().left);
        },
        fixNextCarousel : function( oSlide ){
            var state = oSlide.state,
                $body = state.$body, 
                $panels = state.$panels,
                opts = state.options;

            $body.css('top', -1*$panels.eq(state.activeIndex).position().top);
        }
    });

    return scrolly;
});
