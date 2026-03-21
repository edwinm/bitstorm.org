$(function() {
    var slidecontainer = $('#container');
    var currentSlide = 0;
    var elX = 0;

    $.support.touch = (typeof Touch != "undefined");
    $.support.transitions = typeof TransitionEvent != "undefined" || typeof WebKitTransitionEvent != "undefined";

    if (!$.support.touch || !$.support.transitions) {
        return; // unsupported browser
    }

    slidecontainer.swipe(
        function(event, info) {
            var el = $(this);
            var diff = 0;
            var newX;
            switch(info.action) {
                case 'init':
                    elX = parseInt(el.css('left')) || 0;
                    break;
                case 'move':
                    el.css('left', (elX+info.x)+'px');
                    break;
                case 'swipe':
                    diff = 590;
                    // fall through
                case 'end':
                    el.css('WebkitTransitionProperty', 'left');
                    el.css('MozTransitionProperty', 'left');
                    el.css('transitionProperty', 'left');

                    el.bind('webkitTransitionEnd transitionend', function() {
                        el.unbind('webkitTransitionEnd transitionend');
                        el.css('WebkitTransitionProperty', 'none');
                        el.css('MozTransitionProperty', 'none');
                        el.css('transitionProperty', 'none');
                        if (info.dir > 0) {
                            currentSlide--;
                        } else {
                            currentSlide++;
                        }
                    });

                    if (info.dir > 0) {
                        // ->
                        if (elX + diff > 0) {
                            diff = 0;
                        }
                        newX = elX+diff;
                        newX = Math.round(newX / 590) * 590;
                        el.css('left', newX+'px');

                    } else {
                        // <-
                        if (elX - diff <= -el.width()) {
                            diff = 0;
                        }
                        newX = elX-diff;
                        newX = Math.round(newX / 590) * 590;

                        el.css('left', newX+'px');
                    }
                    break;
            }
        }
    );
});

$.fn.swipe = function(callback) {
    return $(this).each(function() {
        var el = $(this);
        var swipeDelta = 80;
        var oldX = 0;
        var oldY = 0;
        var newX, newY;

        el.bind("touchstart", touchStart, false);
        el.bind("touchmove", touchMove, false);
        el.bind("touchend", touchEnd, false);
        el.bind("touchcancel", touchCancel, false);

        function touchStart(event) {
            newX = oldX = event.originalEvent.touches[0].pageX;
            oldY = event.originalEvent.touches[0].pageY;
            callback.call(el, event, {action: 'init'});
        }

        function touchMove(event) {
            newX = event.originalEvent.touches[0].pageX;
            newY = event.originalEvent.touches[0].pageY;
            callback.call(el, event, {action: 'move', x: newX - oldX});
            if(Math.abs(newX - oldX) > Math.abs(newY - oldY)) {
                event.preventDefault();
            }
        }

        function touchEnd(event) {
            if (event.originalEvent.touches.length) {
                newX = event.originalEvent.touches[0].pageX;
            }
            var diff = newX - oldX;
            if (Math.abs(diff) > swipeDelta) {
                callback.call(el, event, {action: 'swipe', dir: diff > 0 ? 1 : -1});
            } else {
                callback.call(el, event, {action: 'end'});
            }
        }

        function touchCancel(event) {
            callback.call(el, event, {action: 'move', x: 0});
        }
    });
};
