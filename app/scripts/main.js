/*global Portfolio, $*/
'use strict';

window.Portfolio = {
    models: {},
    collections: {},
    views: {},
    routers: {},

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

$(document).ready(function () {
    Portfolio.init();
});
