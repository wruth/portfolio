/*
 * Test to see if element is vertically visible in the documents viewport.
 * Adapted slightly from
 * http://upshots.org/javascript/jquery-test-if-element-is-in-viewport-visible-on-screen
 */
;(function ($) {

    $.fn.isOnScreen = function (vThreshold) {

        var height = this.outerHeight(),
            bounds = this.offset(),
            $win = $(window),
            viewport = {
                top: $win.scrollTop()
            },
            visible,
            deltas;

        if (isNaN(vThreshold)) {
            vThreshold = 1;
        }

        if (!height) {
            return false;
        }

        bounds.bottom = bounds.top + height;
        viewport.bottom = viewport.top + $win.height();

        visible = (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));

        if (!visible) {
            return false;
        }

        deltas = {
            top: Math.min(1, (bounds.bottom - viewport.top) / height),
            bottom: Math.min(1, (viewport.bottom - bounds.top) / height)
        };

        return (deltas.top * deltas.bottom) >= vThreshold;
    };

})(jQuery);
