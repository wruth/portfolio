(function (Portfolio, Backbone) {

    Portfolio.routers.PortfolioRouter = Backbone.Router.extend({

        navModel: null,

        routes: {
            '': 'about',
            'resume': 'resume',
            'portfolio': 'portfolio'
        },

        initialize: function (options) {
            console.log('initializing router!');
            this.navModel = options.navModel;
        },

        //
        // routes
        //

        about: function () {
            console.log('about!');
            this.navModel.set('activePage', 'about');
        },

        resume: function () {
            console.log('resume!');
            this.navModel.set('activePage', 'resume');
        },

        portfolio: function () {
            console.log('portfolio!');
            this.navModel.set('activePage', 'portfolio');
        }
    });

}(window.Portfolio, Backbone));
