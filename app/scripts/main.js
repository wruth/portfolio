/*global Portfolio, $*/


window.Portfolio = {
    models: {},
    collections: {},
    views: {},
    routers: {},

    init: function () {
        'use strict';
        var navModel = new Backbone.Model(),
            $nav = $('#main-header nav'),
            navView = new this.views.NavView({
                model: navModel,
                el: $nav[0]
            });

        console.log('Hello from Portfolio!');

        this.router = new this.routers.PortfolioRouter({navModel: navModel});

        Backbone.history.start();
    }
};

$(document).ready(function () {
    'use strict';
    Portfolio.init();
});
