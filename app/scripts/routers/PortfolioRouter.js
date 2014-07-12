(function (Portfolio, Backbone) {

    Portfolio.routers.PortfolioRouter = Backbone.Router.extend({

        navCollection: null,

        routes: {
            '': 'about',
            'resume': 'resume',
            'portfolio': 'portfolio'
        },

        initialize: function (options) {
            console.log('initializing router!');
            this.navCollection = options.navCollection;
        },

        //
        // routes
        //

        about: function () {
            console.log('about!');
            this.navCollection.setActivePage('about');
        },

        resume: function () {
            console.log('resume!');
            this.navCollection.setActivePage('resume');
        },

        portfolio: function () {
            console.log('portfolio!');
            this.navCollection.setActivePage('portfolio');
        }
    });

}(window.Portfolio, Backbone));
