/*
 * Test to see if element is vertically visible in the documents viewport.
 * Adapted slightly from
 * http://upshots.org/javascript/jquery-test-if-element-is-in-viewport-visible-on-screen
 */
;(function ($) {

    /**
     * jQuery factory function.
     *
     * @param  {Number}  vThreshold Should be a value between 0 - 1, indicating
     *                              what ammount of the element needs to be
     *                              visible for the test to succeed. For
     *                              instance if the value is 0, any ammount of
     *                              the element can be visible; if the value is
     *                              1 the entire element must be visible.
     * @return {Boolean}            true if the test is satisfied and the
     *                              threshold ammount of the element is visible,
     *                              false otherwise.
     */
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
            // ammount of the top not visible
            top: Math.min(1, (bounds.bottom - viewport.top) / height),
            // ammount of the bottom not visible
            bottom: Math.min(1, (viewport.bottom - bounds.top) / height)
        };

        return (deltas.top * deltas.bottom) >= vThreshold;
    };

})(jQuery);
