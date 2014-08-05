;(function ($) {

    // private methods

    var _stopScrolling = function () {
            var $scrollContainer = $(this.children()[0]);
            $scrollContainer.stop();
        },

        _scrollToPosition = function (options, position) {

            if (options.scrollDuration) {
                options.$scrollContainer.animate(
                    {left: position},
                    options.scrollDuration);
            }
            else {
                options.$scrollContainer.css('left', position);
            }

        },

        _scrollPrevious = function (options) {
            var newScrollPosition,
                callbackParams = {};

            //
            // scrollContainer left edge is to the left of the viewport's left
            // edge, so can be scrolled to the right
            //
            if (options.scrollContainerPosition.left < 0) {

                // previous scroll will end up at beginning or rightmost position
                if (Math.abs(options.scrollContainerPosition.left) <= options.viewportWidth) {
                    newScrollPosition = 0;
                    callbackParams.willScrollToStart = true;
                }
                else {
                    newScrollPosition = options.scrollContainerPosition.left + options.viewportWidth;
                }

                options.scrollStartCallback(callbackParams);
                _scrollToPosition(options, newScrollPosition);
            }
            //
            // scrollContainer left edge is at or to the right of the viewport's
            // left edge, so cannot be scrolled to the right
            //
            else {
                options.scrollStartCallback(false);
            }
        },

        _scrollNext = function (options) {
            var newScrollPosition,
                callbackParams = {},
                minLeft = options.viewportWidth - options.scrollContainerWidth;

            //
            // scrollContainer left edge is greater than the minimum (or
            // leftmost) left position, so it can be scrolled to the left
            //
            if (options.scrollContainerPosition.left > minLeft) {

                // next scroll will end up at end or leftmost position
                if (options.scrollContainerPosition.left - options.scrollContainerWidth <= minLeft) {
                    newScrollPosition = minLeft;
                    callbackParams.willScrollToEnd = true;
                }
                else {
                    newScrollPosition = options.scrollContainerPosition.left  - options.viewportWidth;
                }

                options.scrollStartCallback(callbackParams);
                _scrollToPosition(options, newScrollPosition);
            }
            //
            // scrollContainer left edge is less than or equal to the minimum
            // (or leftmost) position it can be in, so cannot be scrolled to the
            // left
            //
            else {
                options.scrollStartCallback(false);
            }
        },

        _scrollError = function (options, message) {
            console.error(message);
            options.scrollStartCallback(false);
        },

        _startScrolling = function (options) {
            options.$scrollContainer = $(this.children()[0]);
            options.viewportWidth = this.outerWidth();
            options.scrollContainerWidth = options.$scrollContainer.outerWidth();
            options.scrollContainerPosition = options.$scrollContainer.position();

            _stopScrolling.call(this);

            if (options.command) {

                if (options.command === 'previous') {
                    _scrollPrevious.call(this, options);
                }
                else if (options.command === 'next') {
                    _scrollNext.call(this, options);
                }
                else {
                    _scrollError(options, 'wrscroller valid commands are \'previous\' or \'next\'');
                }
            }
            else {
                _scrollError(options, 'wrscroller options needs to be invoked with a command property.');
            }

        };


    $.fn.wrscroller = function (commandOrOptions) {

        if (commandOrOptions === 'stop') {
            _stopScrolling.call(this);
        }
        else {

            var argOpts = (typeof commandOrOptions === 'string') ? {command: commandOrOptions} : commandOrOptions,

                options = $.extend(
                        {},
                        $.fn.wrscroller.defaults,
                        argOpts || {}
                    );

            _startScrolling.call(this, options);
        }
        return this;
    };

    $.fn.wrscroller.defaults = {
        scrollDuration: 250,
        scrollStartCallback: function (params) {
            // noop
        }
    };

})(jQuery);
