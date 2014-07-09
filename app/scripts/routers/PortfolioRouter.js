(function (Portfolio, Backbone) {

    Portfolio.routers.PortfolioRouter = Backbone.Router.extend({

        routes: {
            '': 'about',
            'resume': 'resume',
            'portfolio': 'portfolio'
        },

        initialize: function () {
            console.log('initializing router!');
        },

        //
        // routes
        //

        about: function () {
            console.log('about!');
        },

        resume: function () {
            console.log('resume!');
        },

        portfolio: function () {
            console.log('portfolio!');
        }
    });

}(window.Portfolio, Backbone));
