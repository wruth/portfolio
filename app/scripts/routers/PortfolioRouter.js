(function (Portfolio, Backbone) {

        /**
         * Takes care of housekeeping when showing a new current view. Call
         * remove() on the previous currentView to cleanup, the save currentView
         * reference to the new passed in view and call render() on it.
         *
         * @method  _updateCurrentView
         * @private
         * @param  {Backbone.View} newView a new view to display
         */
    var _updateCurrentView = function (newView) {
            var $main = $('#main-container'),
                navModel;

            if (this.currentView) {
                navModel = this.navCollection.get(this.currentView.name);
                navModel.set('scrollTop', $(window).scrollTop());
                this.currentView.remove();
            }

            this.currentView = newView;
            $main.append(newView.render().el);
            navModel = this.navCollection.get(newView.name);
            $(window).scrollTop(navModel.get('scrollTop'));
        };

    Portfolio.routers.PortfolioRouter = Backbone.Router.extend({

        navCollection: null,

        /**
         * Handle to the current view being displayed so that remove() can be
         * called on it to cleanup before showing a new view.
         *
         * @type {Backbone.View}
         */
        currentView: null,

        routes: {
            '': 'about',
            'resume': 'resume',
            'portfolio': 'portfolio'
        },

        initialize: function (options) {
            this.navCollection = options.navCollection;
        },

        //
        // routes
        //

        about: function () {
            var staticView = new Portfolio.views.StaticView({
                    name: 'about'
                });
            this.navCollection.setActivePage('about');
            _updateCurrentView.call(this, staticView);
        },

        resume: function () {
            var resumeView = new Portfolio.views.CollectionView({name: 'resume'});
            this.navCollection.setActivePage('resume');
            _updateCurrentView.call(this, resumeView);
        },

        portfolio: function () {
            var portfolioView = new Portfolio.views.PortfolioView({name: 'portfolio'});
            this.navCollection.setActivePage('portfolio');
            _updateCurrentView.call(this, portfolioView);
        }
    });

}(window.Portfolio, Backbone));
