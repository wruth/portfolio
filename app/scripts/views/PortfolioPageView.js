/*
 * Module defining the PortfolioPageView.
 */
(function (Portfolio, Backbone, dust, _, $) {

    /**
     * @class PortfolioPageView
     */
    Portfolio.views.PortfolioPageView = Portfolio.views.CollectionPageView.extend({

        $scrollers: null,

        /**
         * Create WRScroller's on any '.scroller' elements in the Portfolio's
         * DOM fragment.
         *
         * @method postRender
         */
        postRender: function () {
            var _this = this;

            _scrollSetup.call(this,
                _this.$el.find('.scroller')
                    //
                    //  create the scaler for each scroller .viewport, along
                    //  with a changeCallback that manages the scrollers height
                    //  to follow the transformed height of the viewport.
                    //  Important to do this first before creating the scrollers
                    //  so that the scrollers have a properly sized and scaled
                    //  element to work with.
                    //
                    .each(function () {
                            // an individual .scroller element
                        var $this = $(this),
                            $edges = $this.find('.viewport-edge'),
                            $viewport = $this.find('.viewport'),

                            //
                            // mangage the breakpoint changes here in js instead
                            // of splitting it between here and the sass/css.
                            // Better if it's all in one place since that way
                            // it's guaranteed to be handled consistently.
                            //
                            changeCallback = function (changeObj) {

                                if (changeObj.type === 'transform-end') {
                                    $edges.css('display', 'table-cell');
                                    $viewport.css('position', 'relative');
                                }
                                else {

                                    if (changeObj.type === 'transform-will-start') {
                                        $edges.css('display', 'none');
                                        $viewport.css('position', 'absolute');
                                    }
                                }
                            };

                        $viewport.wrscaler({
                            threshold: 800,
                            changeCallback: changeCallback
                        });
                    })
                    //
                    // creates the scrollers
                    //
                    .wrscroller({
                        scrollDuration: 500
                    }));

        },

        /**
         * Stop listenining for window scroll events!
         *
         * @method remove
         */
        remove: function () {
            $(window).off('scroll.portfolio');
            Portfolio.views.CollectionPageView.prototype.remove.call(this);
        }

    });


    //--------------------------------------------------------------------------
    //
    // private methods
    //
    //--------------------------------------------------------------------------

    /**
     * Flash the scroller's ui. The css is set-up to do this if the scroller
     * container has a 'mouse-enter' class. Remove the 'mouse-enter' class after
     * a short interval unless the mouse is really over the scroller (the
     * scroller indicates this by adding a 'mouse-enter' data attribute to the
     * scroller).
     *
     * @method _flashScrollerUI
     * @private
     *
     * @param  {jQuery} $scroller A jQuery wrapper for an individual scroller.
     */
    function _flashScrollerUI ($scroller) {

        $scroller.data('uiFlashed', 'yes');
        $scroller.addClass('mouse-enter');

        _.delay(function () {

                if (!$scroller.data('mouse-enter')) {
                    $scroller.removeClass('mouse-enter');
                }
            },
            2000);
    }

    /**
     * Test an individual scroller to see if it is visible in the screen's
     * viewport or not. If the scroller is fully visible in the viewport, flash
     * it's ui to prompt the user to scroll it's content.
     *
     * @method _testScroller
     * @private
     *
     * @param  {jQuery} $scroller A jQuery wrapper for an individual scroller.
     */
    function _testScroller ($scroller) {

        if (!$scroller.isOnScreen(0)) {
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
    }

    /**
     * Test all the scroller's on the page for image lazy loading and ui
     * flashing.
     *
     * @method _testAllScrollers
     * @private
     */
    function _testAllScrollers () {
        var _this = this;

        this.$scrollers.each(function () {
            _testScroller.call(_this, $(this));
        });
    }

    /**
     * Initiate scroll monitoring for flashing scroller ui, and kickoff
     * prioritized loading of scroller images.
     *
     * @method _scrollSetup
     * @private
     *
     * @param  {jQuery} $el Wrapped jQuery set of all project scrollers on the
     *                      page.
     */
    function _scrollSetup ($el) {
        this.$scrollers = $el;
        _testAllScrollers.call(this);

        $(window).on('scroll.portfolio', _.debounce(_.bind(_testAllScrollers, this), 250));

        var batchImageLoader = this.batchImageLoader = new Portfolio.utilities.BatchImageLoader();

        this.$scrollers.each(function () {
           batchImageLoader.addBatch($(this).find('img').get());
        });
    }

}(window.Portfolio, Backbone, dust, _, jQuery));
