(function (Portfolio, Backbone, dust, _, $) {

        /**
         * Load the images for a scroller. Image paths are stored on an 'imgsrc'
         * attribute of an img. Apply this to the 'src' attribute to start
         * image loading.
         *
         * @method _loadImagesForScroller
         * @private
         *
         * @param  {jQuery} $scroller A jQuery wrapper for an individual
         *                            scroller.
         */
    var _loadImagesForScroller = function ($scroller) {

            $scroller.find('img').each(function () {
                var $this = $(this);

                if ($this.data('imgsrc')) {
                    $this.attr('src', $this.data('imgsrc'));
                }
            });

            $scroller.data('imagesLoaded', 'yes');
        },

        /**
         * Flash the scroller's ui. The css is set-up to do this if the
         * scroller container has a 'mouse-enter' class. Remove the
         * 'mouse-enter' class after a short interval unless the mouse is really
         * over the scroller (the scroller indicates this by adding a
         * 'mouse-enter' data attribute to the scroller).
         *
         * @method _flashScrollerUI
         * @private
         *
         * @param  {jQuery} $scroller A jQuery wrapper for an individual
         *                            scroller.
         */
        _flashScrollerUI = function ($scroller) {

            $scroller.data('uiFlashed', 'yes');
            $scroller.addClass('mouse-enter');

            _.delay(function () {

                    if (!$scroller.data('mouse-enter')) {
                        $scroller.removeClass('mouse-enter');
                    }
                },
                2000);
        },

        /**
         * Test an individual scroller to see if it is visible in the screen's
         * viewport or not. If this is the first time the scroller has become
         * even partially visible, initiate loading of it's images.
         * Additionally, if the scroller is fully visible in the viewport,
         * flash it's ui to prompt the user to scroll it's content.
         *
         * @method _testScroller
         * @private
         *
         * @param  {jQuery} $scroller A jQuery wrapper for an individual
         *                            scroller.
         */
        _testScroller = function ($scroller) {

            if ($scroller.isOnScreen(0)) {

                if (!$scroller.data('imagesLoaded')) {
                    _loadImagesForScroller.call(this, $scroller);
                }
            }
            else {
                $scroller.removeData('uiFlashed');
            }

            if ($scroller.isOnScreen(1) && !$scroller.data('uiFlashed')) {
                _flashScrollerUI.call(this, $scroller);

                if (ga) {
                    //
                    // send an analytics event for the scroller becoming fully
                    // visible
                    //
                    ga('send', 'event', 'scroller', 'visible', $scroller.data('galabel'));
                }
            }
        },

        /**
         * Test all the scroller's on the page for image lazy loading and ui
         * flashing.
         *
         * @method _testAllScrollers
         * @private
         */
        _testAllScrollers = function () {
            var _this = this;

            this.$scrollers.each(function () {
                _testScroller.call(_this, $(this));
            });
        },

        /**
         * Initiate scroll monitoring for flashing scroller ui and lazy loading
         * scroller images.
         *
         * @method _scrollMonitor
         * @private
         *
         * @param  {jQuery} $el Wrapped jQuery set of all project scrollers on
         *                      the page.
         */
        _scrollMonitor = function ($el) {
            this.$scrollers = $el;
            _testAllScrollers.call(this);

            $(window).on('scroll.portfolio', _.debounce(_.bind(_testAllScrollers, this), 250));
        };

    Portfolio.views.PortfolioView = Portfolio.views.CollectionView.extend({

        $scrollers: null,

        afterRender: function () {

            _.defer(function (view) {

                _scrollMonitor.call(view,
                    view.$el.find('.scroller').wrscroller({
                        scrollDuration: 500,
                        scrollEasing: 'easeInOutQuad'
                    }));

            }, this);
        },

        remove: function () {
            $(window).off('scroll.portfolio');
            Portfolio.views.CollectionView.prototype.remove.call(this);
        }

    });

}(window.Portfolio, Backbone, dust, _, jQuery));
