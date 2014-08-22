/*
 * Yet another jQuery carousel implementation! Designed to be pretty simple and
 * bare bones. Structural assumptions are:
 *
 * 1)  The element this is applied to is assumed to have a child container
 *     constituting a viewport for the scrollable content.
 * 2)  The viewport element is assumed to have a single child container,
 *     referred to as the scrollContainer. Scrolling is accomplished by applying
 *     a css3 transform to the scrollContainer, or falling back to animating
 *     it's absolute postion if necessary.
 * 3)  The scrollContainer is assumed to have child elements with explicit or
 *     computed widths. These widths will be summed and explicitly set as the
 *     scrollContainer's width.
 * 4)  It is also expected there are two child elements of the base element
 *     which can be listened to for click events in order to control the
 *     forward and backward motion of the scroller.
 * 5)  The scroller will scroll in increments of the viewport's width. The width
 *     of the individual child elements is not considered, so making sure they
 *     are layed out in proper relation to the viewport is an implementation
 *     responsibility. If the remaining hidden length of the scrollContainer is
 *     less than the width of the viewport, the scroller will scroll only the
 *     remaining distance necessary to show the content. These stops are
 *     recomputed upon reaching either horizontal boundary, so the scroller may
 *     not stop at the same places from the end as it does from the beginning.
 *
 *  Copyright 2014 Ward Ruth
 */
;(function ($) {

        /**
         * Convenience method abstracting stopping $scrollContainer animation.
         *
         * @method _stopScrolling
         * @private
         */
    var _stopScrolling = function () {
            this.$scrollContainer.stop();
        },

        /**
         * Low level scroll method to move the $scrollContainer to a designated
         * horizontal pixel position.
         * Note this takes advantage of Louis-Rémi Babé's jquery.transform
         * jQuery animate extension:
         * http://louisremi.github.io/jquery.transform.js/index.html
         *
         * @method  _scrollToPosition
         * @private
         * @param  {String} position should be a string value formatted as a
         *                           valid css scalar value, such as '123px'
         */
        _scrollToPosition = function (position) {
                var _this = this;

                this.$scrollContainer.animate(
                    {transform: 'translateX(' + position + ')'},
                    this.scrollDuration,
                    this.scrollEasing,
                    function () {
                        _this.completeCallback(_this);
                    });

        },

        /**
         * Iterate over each child in the $scrollContainer to sum up their
         * widths (including margins). Apply this summed width as the width of
         * the $scrollContainer (otherwise the $scrollContainer would naturally
         * remain width bound by it's parent container).
         *
         * @method _computeAndApplyScrollContainerWidth
         * @private
         * @return {Number} Summed width of the $scrollContainer's children.
         */
        _computeAndApplyScrollContainerWidth = function () {
            var scrollChildrenWidth = 0;

            this.$scrollContainer.children().each(function () {
                scrollChildrenWidth += $(this).outerWidth(true);
            });

            this.$scrollContainer.css('width', scrollChildrenWidth + 'px');
            return scrollChildrenWidth;
        },

        /**
         * Creates an array of step positions, populated with the x coordinate
         * of each postion the scroller can scroll to. This is recalculated
         * each time the scroller reaches it's beginning or end position because
         * the total scroll content width may not be evenly divisible by the
         * width of the viewport. In conjunction with stepIndex this constitutes
         * a simple kind of model, allowing the scroller to gracefully handle
         * multiple transition requests in a row.
         *
         * @method _generateStepPositions
         * @private
         *
         * @param  {Boolean} fromStart Flag indicates if positions should be
         *                             calculated from the starting position.
         *                             Otherwise they are calculated from the
         *                             end postion.
         */
        _generateStepPositions = function (fromStart) {
            var stepPositions = new Array(this.numSteps),
                stepMinX = this.viewportWidth - this.scrollChildrenWidth,
                lastIndex = this.numSteps - 1,
                i,
                j;

            stepPositions[0] = 0;
            stepPositions[lastIndex] = stepMinX;

            if (fromStart) {

                for (i = 1; i < lastIndex; i++) {
                    stepPositions[i] = -(i * this.viewportWidth);
                }
            }
            // from end
            else {

                for (i = lastIndex - 1, j = 1; i > 0; i--, j++) {
                    stepPositions[i] = stepMinX + j * this.viewportWidth;
                }
            }

            this.stepPositions = stepPositions;
        },

        /**
         * Attach event handlers to the previous and next controls if they
         * exist, and also to the root containing element for mouseenter and
         * mouseleave events in order to add or remove a 'mouse-enter' class
         * for the scroller denoting this state. Client code or css may employ
         * the presence or absense of the of the 'mouse-enter' class to do such
         * things as hide and show the ui controls for instance.
         *
         * @method _attachHandlers
         * @private
         */
        _attachHandlers = function () {
            var $el = this.$el;

            if (this.$previous) {
                this.$previous.click($.proxy(this.previous, this));
            }

            if (this.$next) {
                this.$next.click($.proxy(this.next, this));
            }

            this.$el.mouseenter(function () {
                    $el.addClass('mouse-enter');
                    $el.data('mouse-enter', 'yes');
                });

            this.$el.mouseleave(function () {
                    $el.removeClass('mouse-enter');
                    $el.removeData('mouse-enter');
                });
        },

        /**
         * Convenience method to remove a 'disabled' class from the ui controls.
         * This is done every time a scroll is successfully initiated, and prior
         * to determining if any control should be disabled.
         *
         * @method _enableControls
         * @private
         */
        _enableControls = function () {

            if (this.$previous) {
                this.$previous.removeClass('disabled');
            }

            if (this.$next) {
                this.$next.removeClass('disabled');
            }
        },

        /**
         * Discover internal elements, compute width of scrolling container,
         * determine number of scroll steps.
         *
         * @method _init
         * @param  {Object} settings Parameter object with initialization
         *                           settings
         */
        _init = function (settings) {
            var $el = this.$el;
            this.$previous = $el.find(settings.previouseSelector);
            this.$next = $el.find(settings.nextSelector);
            this.$viewport = $el.find(settings.viewportSelector);
            this.$scrollContainer = $(this.$viewport.children()[0]);
            this.scrollDuration = settings.scrollDuration;
            this.completeCallback = settings.completeCallback;
            this.viewportWidth = this.$viewport.outerWidth();
            this.scrollChildrenWidth = _computeAndApplyScrollContainerWidth.call(this);
            this.numSteps = Math.ceil(this.scrollChildrenWidth / this.viewportWidth);
            this.stepIndex = 0;

            _generateStepPositions.call(this, true);

            //
            //  ensure left control starts out disabled, since the scroll container
            //  should initially be at it's rightmost position
            //
            if (this.$previous) {
                this.$previous.addClass('disabled');
            }

            _attachHandlers.call(this);

            //
            // :TODO: should probably add a check if scrolling is necessary at
            // all, and hide the scrolling ui if not
            //
        };

    /**
     * WRScroller constructor. Internally to the plugin an instance is created
     * for each element.
     *
     * @constructor
     *
     * @param {DOM element} el  the DOM element constituting the root of a
     *                          scroller context
     *
     * @param {Object} settings parameter object which can provide
     *                          initialization properties to override the
     *                          defaults.
     */
    $.WRScroller = function (el, settings) {
        this.el = el;
        this.$el = $(el);

        _init.call(this, settings);
    };

    /**
     * Scroll to previous (right) position if possible. Add 'disabled' class to
     * previous control if at the end of the scroll the scroller will be in the
     * rightmost or initial position.
     *
     * @method previous
     */
    $.WRScroller.prototype.previous = function () {

       if (this.stepIndex > 0) {
            _stopScrolling.call(this);
            _scrollToPosition.call(this, this.stepPositions[--this.stepIndex]);
            _enableControls.call(this);

            if (this.stepIndex === 0) {
                this.$previous.addClass('disabled');
                _generateStepPositions.call(this, true);
            }
       }
    };

    /**
     * Scroll to next (left) position if possible. Add 'disabled' class to next
     * control if at the end of the scroll the scroller will be in the leftmost
     * or final position.
     *
     * @method next
     */
    $.WRScroller.prototype.next = function () {

       if (this.stepIndex < this.numSteps - 1) {
            _stopScrolling.call(this);
            _scrollToPosition.call(this, this.stepPositions[++this.stepIndex]);
            _enableControls.call(this);

            if (this.stepIndex === this.numSteps - 1) {
                this.$next.addClass('disabled');
                _generateStepPositions.call(this, false);
            }
       }
    };

    /**
     * Factory or invocation function to create instances of WRScroller's for
     * each memeber of the wrapped set.
     *
     * @param  {Object} options Parameter type object with initialization
     *                          properties for the scrollers.
     * @return {jQuery}         Returns the jQuery wrapped set of matching
     *                          elements, as is customary.
     */
    $.fn.wrscroller = function (options) {

        var settings = $.extend(
                {},
                $.fn.wrscroller.defaults,
                options || {}
            );

       return this.each(function () {
            var $this = $(this);

            if (!$this.data('wrscroller')) {
                $this.data('wrscroller', new $.WRScroller(this, settings));
            }
       });
    };

    /**
     * Defaults parameter object for scroller initialization properties used in
     * lieu of any client defined initialization properties.
     *
     * @type {Object}
     * @property {Number} scrollDuration Duration of scroll transition, in ms.
     *                                   Default is 250.
     * @property {String} scrollEasing One of the jQuery animation easing types.
     *                                 Default is 'swing'.
     * @property {String} viewportSelector A selector for the viewport. Default
     *                                     is '.viewport'.
     * @property {String} previousSelector A selector for the previous control.
     *                                     Default is '.previous'.
     * @property {String} nextSelector A selector for the next control. Default
     *                                 is '.next'.
     * @property {Function} completeCallback A callback to invoke once a scroll
     *                                       animation is completed. The
     *                                       WRScroller instance is passed in as
     *                                       an argument.
     */
    $.fn.wrscroller.defaults = {
        scrollDuration: 250,
        scrollEasing: 'swing',
        viewportSelector: '.viewport',
        previouseSelector: '.previous',
        nextSelector: '.next',
        /* jshint unused: false */
        completeCallback: function (wrscroller) {}
    };

})(jQuery);
