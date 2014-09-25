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
        utilities: {},

        init: function () {

            var pageCollection = new this.collections.PageCollection(),

                appView = new this.views.AppView({
                    collection: pageCollection,
                    el: $('body')[0]
                });

            this.router = new this.routers.PortfolioRouter({pageCollection: pageCollection});
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
