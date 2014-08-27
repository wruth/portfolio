/**
 * AppView has two global chrome responsibilities:
 * First to listen for route changes in order to check for a nav model aside
 * property in order to render the aside background grad or not.
 * Second to simply instatiate and add the navView element to the DOM.
 */
(function (Portfolio, Backbone) {

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
