/*global Portfolio, $*/


window.Portfolio = {
    models: {},
    collections: {},
    views: {},
    routers: {},

    init: function () {
        'use strict';
        console.log('Hello from Portfolio!');

        this.router = new this.routers.PortfolioRouter();
        Backbone.history.start();
    }
};

$(document).ready(function () {
    'use strict';
    Portfolio.init();
});
