$(function() {
    var body = $('div.body');
    var currentSlide = 0;
    var elX = 0;

    $.support.touch = (typeof Touch != "undefined");
    $.support.transitions = typeof TransitionEvent != "undefined" || typeof WebKitTransitionEvent != "undefined";

    if (!$.support.touch || !$.support.transitions) {
        return; // unsupported browser
    }

    body.swipe();
});

$.fn.swipe = function() {
    return $(this).each(function() {
        var el = $(this);
        var num = 100;

        for(var i = 0; i < num; i++) {
            el.append($('<div>').attr({id: 'f'+i}).addClass('finger'));
        }

        el.bind("touchstart", touchStart, false);
        el.bind("touchmove", touchStart, false);
        el.bind("touchend", touchStart, false);
        el.bind("touchcancel", touchStart, false);

        function touchStart(event) {
            var touches = event.originalEvent.touches.length;
            for (var i = 0; i < num; i++) {
                if (i < touches) {
                    $('#f'+i).css({display: 'block', top: event.originalEvent.touches[i].pageY, left: event.originalEvent.touches[i].pageX});
                } else {
                    $('#f'+i).css({display: 'none'});
                }
            }
            event.preventDefault();
        }
    });
};