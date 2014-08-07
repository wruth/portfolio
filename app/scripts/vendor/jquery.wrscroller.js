;(function ($) {

    // private methods

    var _stopScrolling = function () {
            this.$scrollContainer.stop();
        },

        _scrollToPosition = function (position) {

            if (this.scrollDuration) {
                this.$scrollContainer.animate(
                    {left: position},
                    this.scrollDuration);
            }
            else {
                this.$scrollContainer.css('left', position);
            }

        },

        _computeAndApplyScrollContainerWidth = function () {
            var scrollChildrenWidth = 0;

            this.$scrollContainer.children().each(function () {
                scrollChildrenWidth += $(this).outerWidth(true);
            });

            this.$scrollContainer.css('width', scrollChildrenWidth + 'px');
            return scrollChildrenWidth;
        },

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

        _attachHandlers = function () {
            if (this.$previous) {
                this.$previous.click($.proxy(this.previous, this));
            }

            if (this.$next) {
                this.$next.click($.proxy(this.next, this));
            }
        },

        _enableControls = function () {

            if (this.$previous) {
                this.$previous.removeClass('disabled');
            }

            if (this.$next) {
                this.$next.removeClass('disabled');
            }
        };

    $.WRScroller = function (el, settings) {
        var $el = $(el);

        this.$previous = $el.find(settings.previouseSelector);
        this.$next = $el.find(settings.nextSelector);
        this.$viewport = $el.find(settings.viewportSelector);
        this.$scrollContainer = $(this.$viewport.children()[0]);
        this.scrollDuration = settings.scrollDuration;
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
        // :TODO: should probably add a check if scrolling is necessary at all,
        // and hide the scrolling ui if not
        //
    };

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

    $.fn.wrscroller.defaults = {
        scrollDuration: 250,
        viewportSelector: '.viewport',
        previouseSelector: '.previous',
        nextSelector: '.next'
    };

})(jQuery);
