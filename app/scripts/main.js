/*global Portfolio, $*/


window.Portfolio = {
    models: {},
    collections: {},
    views: {},
    routers: {},

    init: function () {
        'use strict';
        var navCollection = new this.collections.NavCollection(),
            $nav = $('#main-header nav'),
            navView = new this.views.NavView({
                collection: navCollection,
                el: $nav[0]
            });

        console.log('Hello from Portfolio!');

        this.router = new this.routers.PortfolioRouter({navCollection: navCollection});

        Backbone.history.start();
    }
};

$(document).ready(function () {
    'use strict';
    Portfolio.init();
});
