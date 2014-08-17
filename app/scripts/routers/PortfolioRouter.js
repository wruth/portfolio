(function (Portfolio, Backbone) {

    var _viewClasses = {
            about: Portfolio.views.CollectionView,
            resume: Portfolio.views.CollectionView,
            portfolio: Portfolio.views.PortfolioView
        },

        /**
         * Takes care of housekeeping when showing a new current view. Create
         * the new view, call remove() on the previous currentView to cleanup,
         * call render() on the new view. Also update active page on the
         * navCollection to keep the nav ui in sync.
         *
         * @method  _updateCurrentView
         * @private
         * @param  {String} viewName Name of a new view to display
         */
        _updateCurrentView = function (viewName) {
            var $main = $('#main-container'),
                navModel,
                viewCollection,
                newView/* = new (_viewClasses[viewName])({name: viewName})*/;

            this.navCollection.setActivePage(viewName);

            if (this.currentView) {
                navModel = this.navCollection.get(this.currentView.name);
                navModel.set('scrollTop', $(window).scrollTop());
                this.currentView.remove();
            }

            navModel = this.navCollection.get(viewName);

            if (navModel.has('collection')) {
                viewCollection = navModel.get('collection');
            }
            else {
                viewCollection = new Backbone.Collection();
                viewCollection.url = '/data/' + viewName + '.json';
                viewCollection.fetch();
            }

            newView = new (_viewClasses[viewName])(
                {
                    name: viewName,
                    collection: viewCollection
                });

            this.currentView = newView;
            $main.append(newView.render().el);

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
            _updateCurrentView.call(this, 'about');
        },

        resume: function () {
            _updateCurrentView.call(this, 'resume');
        },

        portfolio: function () {
            _updateCurrentView.call(this, 'portfolio');
        }
    });

}(window.Portfolio, Backbone));
