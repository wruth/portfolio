/*
 * WRScaler
 * Monitors the window width to see if it falls below a specified threshold
 * value, and if so applies a 2D scale transform to the wrapped elements so that
 * they scale down with the window width. Can useful in conjunction with
 * absolutely positioned elements, or cetain kinds of UI components.
 */
;(function ($) {

    /**
     * Provides a more accurate width of the window than jQuery(window).width()
     * does when a vertical scrollbar is present.
     *
     * @see http://stackoverflow.com/questions/11309859/css-media-queries-and-javascript-window-width-do-not-match?lq=1
     *
     * @function viewport
     * @return {Object} An Object with a width and height property
     */
    function viewport () {
        var e = window,
            a = 'inner';

        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };
    }

    // namespace for jQuery events
    var ns = '.wrscaler';

    /**
     * WRScaler constructor. Internally to the plugin an instance is created for
     * each element in the wrapped set.
     *
     * @constructor
     *
     * @param {DOM element} el  The DOM element constituting the root of a
     *                          scaling context
     *
     * @param {Object} settings Parameter object which can provide
     *                          initialization properties to override the
     *                          defaults.
     */
    $.WRScaler = function (el, settings) {
        this.el = el;
        this.$el = $(el);
        _init.call(this, settings);
    };

    //
    // public methods
    //

    /**
     * Remove MediaQueryList and window resize listeners, plus reset any
     * transform.
     *
     * @method destroy
     */
    $.WRScaler.prototype.destroy = function () {
        this.mql.removeListener(this.mqlListenerProxy);
        $(window).off('resize' + ns, this.resizeProxy);
        _reset.call(this);
    };

    //
    // private methods
    //

    /**
     * Cache base transform for the element, create MediaQueryList and listener,
     * and check if a scale transform needs to be applied right off the bat.
     *
     * @method _init
     * @private
     *
     * @param  {Object} settings Initializatin properties
     */
    function _init (settings) {
        var maxWidth = settings.threshold - 1,
            mediaQuery = '(max-width: ' + maxWidth + 'px)',
            transform = this.$el.css('transform');

        this.baseTransform = transform;
        this.matrix = _getMatrixFromString(transform);

        this.$window = $(window);
        this.threshold = settings.threshold;
        this.changeCallback = settings.changeCallback;
        this.mql = window.matchMedia(mediaQuery);
        this.mqlListenerProxy = $.proxy(_mqlListener, this);
        this.mql.addListener(this.mqlListenerProxy);
        this.resizeProxy = $.proxy(_resize, this);
        this.isMqlMatched = false;

        //
        // need to explicitly check first, because the media query condition
        // may already be satisfied
        //
        this.mqlListenerProxy(this.mql);
    }

    /**
     * Given a string with a list of comma delimited values within parentheses,
     * return an array of those values. For instance, 'matrix(1, 0, 0, 1, 0, 0)'
     * returns the Array ['1', '0', '0', '1', '0', '0'].
     *
     * @function _getMatrixFromString
     *
     * @param  {String} transformStr A formatted string: either the literal
     *                               value 'none', or expected to contain a list
     *                               of comma delimitted values, bounded by a
     *                               leading open paren ('('), and presumably a
     *                               final close paren (')').
     * @return {Array}               An Array of the Stringvalues which were
     *                               comma delimitted, or an Array representing
     *                               an identity matrix.
     */
    function _getMatrixFromString (transformStr) {

        if (transformStr === 'none') {
            return ['1', '0', '0', '1', '0', '0'];
        }

        var startIndex = transformStr.indexOf('(') + 1,
            arrStr = transformStr.slice(startIndex, -1),
            transformArr = arrStr.split(',');

        return transformArr;
    }

    /**
     * Listener for the MediaQueryList to test if the resize threshold has been
     * crossed. If so, add a window resize listener and apply resizing (which
     * will invoke the changeCallback with a 'transform-start). Otherwise remove
     * window resize listener and invoke the callback with 'transform-end'.
     *
     * @method  _mqlListener
     * @private
     *
     * @param  {MediaQueryList} mql A MediaQueryListener this listener was
     *                              triggered for.
     */
    function _mqlListener (mql) {

        if (mql.matches) {
            this.$window.on('resize' + ns, this.resizeProxy);

            _resize.call(this, !this.isMqlMatched);
            this.isMqlMatched = true;
        }
        else {
            this.$window.off('resize' + ns, this.resizeProxy);
            _reset.call(this);
            this.changeCallback({type: 'transform-end'});
            this.isMqlMatched = false;
        }
    }

    /**
     * Compute the scale transform for the element as a proportion of the
     * window width and the threshold ammount. This is in fact applied as a
     * affine transform matrix in order to preserve any other transforms that
     * may exist on the element. Also invoke the changeCallback with a type
     * parameter of either 'transform-start' or 'transform-change' depending on
     * if this is the first scale after satisfying the media query, or simply
     * an additional scale in response to a window resize.
     *
     * @method _resize
     * @private
     *
     * @param  {Boolean} isStart Flag indicates if this is an initial resize
     *                           just after satisfying the media query, or if it
     *                           is a successive resize due to the window
     *                           resizing.
     */
    function _resize (isStart) {
        //
        // :TRICKY:
        // this.$window.width() does not accurately refelect the influence of
        // a vertical scrollbar if present
        //
        var scale = viewport().width / this.threshold,
            callbackObj = {
                type: isStart ? 'transform-start' : 'transform-change',
                scale: scale
            },
            transformStr = 'matrix(';

        this.matrix[0] = this.matrix[3] = scale;
        transformStr += (this.matrix.join(', ') + ')');
        this.$el.css('transform', transformStr);
        this.changeCallback(callbackObj);
    }

    /**
     * Resets the scale transform on the element to what it was intially.
     *
     * @method  _reset
     * @private
     */
    function _reset () {
        var resetTransform = (this.baseTransform === 'none') ? '' : this.baseTransform;
        this.$el.css('transform', resetTransform);
    }

    /**
     * Monitors window resizes below a specified threshold, and performs a scale
     * transform on the wrapped set as a proportion of the resize width to the
     * threshold width.
     *
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    $.fn.wrscaler = function (options) {

        var settings = $.extend(
                {},
                $.fn.wrscaler.defaults,
                options || {}
            );

        if (!window.matchMedia) {
            return this;
        }

       return this.each(function () {
            var $this = $(this);

            // blow away a previous scaler if it exists
            if ($this.data('wrscaler')) {
                $this.data('wrscaler').destroy();
            }

            $this.data('wrscaler', new $.WRScaler(this, settings));
       });
    };

    $.fn.wrscaler.defaults = {
        /* jshint unused: false */
        /**
         * Callback invoked when a scale transform changes.
         * @param  {Object} changeObj Change object with the following form:
         * @property {String} type Type can have one of three values:
         *                         'transform-start' - when the mediaQuery
         *                         condition is satisfied and the transform is
         *                         first applied.
         *                         'transform-change' - the transform has
         *                         changed (as a result of a window resize).
         *                         'tranform-end' - when the mediaQuery
         *                         condition is no longer satisfied.
         * @property {Number} scale New computed scale property applied to the
         *                          scale transform on the elements in the
         *                          matched set.
         */
        changeCallback: function (changeObj) {}
    };

}(jQuery));
