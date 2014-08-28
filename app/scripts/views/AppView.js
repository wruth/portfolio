/**
 * AppView has two global chrome responsibilities:
 * First to listen for route changes in order to check for a nav model aside
 * property in order to render the aside background grad or not.
 * Second to simply instatiate and add the navView element to the DOM.
 */
(function (Portfolio, Backbone) {

    /**
     * Because the aside background graphic element has to exist in the
     * background element context outside the element managed by any PageView,
     * the AppView takes care of monitoring this by checking for the 'aside'
     * property on the relevent page Model whenever the route changes, and
     * keeping the aside class in sync on the background element.
     *
     * @method  _handleRouteChange
     * @private
     *
     * @param  {String} name Named route
     */
    function _handleRouteChange (name) {

        var navModel = this.collection.get(name),
            $background = this.$el.find('.background > .content-background');

        if (navModel.get('aside')) {
            $background.addClass('aside');
        }
        else {
            $background.removeClass('aside');
        }
    }

    /**
     * @class AppView
     */
    Portfolio.views.AppView = Backbone.View.extend({

        navView: null,

        initialize: function (options) {

            this.listenTo(options.router, 'route', _handleRouteChange);

            this.navView = new Portfolio.views.NavView({
                collection: options.collection
            });
        },

        render: function () {
            this.$el.find('.nav-container').append(this.navView.el);
        }
    });

}(window.Portfolio, Backbone));
