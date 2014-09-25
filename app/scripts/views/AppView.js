/**
 * AppView has two global chrome responsibilities:
 * First to listen for active page changes in order to check for a page model
 * aside property in order to render the aside background grad or not.
 * Second to simply instatiate and add the navView element to the DOM.
 */
(function (Portfolio, Backbone) {

    /**
     * @class AppView
     */
    Portfolio.views.AppView = Backbone.View.extend({

        navView: null,

        initialize: function () {
            this.listenTo(this.collection, 'change:active', _handlePageChange);

            this.navView = new Portfolio.views.NavView({
                collection: this.collection
            });
        },

        render: function () {
            this.navView.render();
            this.$el.find('.nav-container').append(this.navView.el);
        }
    });


    //--------------------------------------------------------------------------
    //
    // private methods
    //
    //--------------------------------------------------------------------------

    /**
     * Because the aside background graphic element has to exist in the
     * background element context outside the element managed by any PageView,
     * the AppView takes care of monitoring this by checking for the 'aside'
     * property on the relevent page Model whenever a new page becomes active,
     * and keeping the aside class in sync on the background element.
     *
     * @method  _handlePageChange
     * @private
     *
     * @param  {Model} pageModel page Model of the new active page
     */
    function _handlePageChange (pageModel) {

        var $background = this.$el.find('.background');

        if (pageModel.get('aside')) {
            $background.addClass('aside');
        }
        else {
            $background.removeClass('aside');
        }
    }

}(window.Portfolio, Backbone));
