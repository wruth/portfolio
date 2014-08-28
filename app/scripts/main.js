/*global Portfolio */
'use strict';

/*
 * Entry module.
 */
(function ($) {

    /**
     * Top level app object, acts as top level namespace object for the app, as
     * well as providing an init() entry point method called on document ready.
     *
     * @name Portfolio
     * @type {Object}
     */
    window.Portfolio = {
        models: {},
        collections: {},
        views: {},
        routers: {},
        functions: {},

        init: function () {

            var navCollection = new this.collections.NavCollection(),
               router = new this.routers.PortfolioRouter({navCollection: navCollection}),

               appView = new this.views.AppView({
                    collection: navCollection,
                    router: router,
                    el: $('body')[0]
                });

            appView.render();

            Backbone.history.start();
        }
    };

    /**
     * Call init() on Portfolio when docuement ready.
     */
    $(document).ready(function () {
        Portfolio.init();
    });

} (jQuery));
