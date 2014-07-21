/*global Portfolio, $*/
'use strict';

window.Portfolio = {
    models: {},
    collections: {},
    views: {},
    routers: {},

    init: function () {

        var navCollection = new this.collections.NavCollection(),
            //
            // don't need to save a reference to the nav view because it adds
            // itself as a listener to the navCollection which the router
            // retains a reference to
            //
            navView = new this.views.NavView({
                collection: navCollection
            });

            $('.nav-container').append(navView.el);

        this.router = new this.routers.PortfolioRouter({navCollection: navCollection});

        Backbone.history.start();
    }
};

$(document).ready(function () {
    Portfolio.init();
});
