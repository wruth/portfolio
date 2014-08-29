/*
 * PortfolioRouter module, the router for the app.
 */
(function (Portfolio, Backbone, $) {

    var _viewClasses = {
            resume: Portfolio.views.CollectionPageView,
            portfolio: Portfolio.views.PortfolioPageView
        },

        // broken out here so they can be cache busted in the build process
        _jsonPaths = {
            resume: '/data/resume.json',
            portfolio: '/data/portfolio.json'
        };

    /**
     * Get the Collection from the Model for the specified View if it has
     * previously been created and cached. If not create a Collection for this
     * View and initiate a fetch on it (this mechanism ensures that the fetch is
     * only called once when the Collection is created).
     *
     * @method _getViewCollection
     * @private
     *
     * @param  {String} viewName Name of a View
     * @return {Collection}      A Collection for the View
     */
    function _getViewCollection (viewName) {
        var navModel = this.pageCollection.get(viewName),
            viewCollection,
            startTime;

        if (navModel.has('collection')) {
            viewCollection = navModel.get('collection');
        }
        else {
            viewCollection = new Backbone.Collection();
            viewCollection.url = _jsonPaths[viewName];

            if (ga) {
                startTime = new Date().getTime();

                this.listenToOnce(viewCollection, 'sync', function () {
                    var endTime = new Date().getTime(),
                        elapsed = endTime - startTime;

                    ga('send', 'timing', 'Backbone', 'View Collection', elapsed, viewName);
                });
            }

            viewCollection.fetch();
            navModel.set('collection', viewCollection);
        }

        return viewCollection;
    }

    /**
     * Track this route as a pageView for analytics
     *
     * @method _trackPage
     * @private
     */
    function _trackPage () {
        var url = Backbone.history.getFragment();

        // prepend a slash if necessary
        if (!/^\//.test(url)) {
            url = '/' + url;
        }

        if (ga) {
            //
            // using the extra call so any page events can be properly
            // associated with their page
            //
            ga('set', 'page', url);
            ga('send', 'pageview');
        }
    }

    /**
     * Takes care of housekeeping when showing a new current view. Create the
     * new view, call remove() on the previous currentView to cleanup, call
     * render() on the new view. Also update active page on the pageCollection
     * to keep the nav ui in sync.
     *
     * @method  _updateCurrentView
     * @private
     * @param  {String} viewName Name of a new view to display
     */
    function _updateCurrentView (viewName) {
        var $main = $('#main-container'),
            newView;

        this.pageCollection.setActivePage(viewName);

        if (this.currentView) {
            this.currentView.remove();
        }

        if (viewName !== 'about') {
            newView = new (_viewClasses[viewName])(
                {
                    name: viewName,
                    collection: _getViewCollection.call(this, viewName)
                });
        }
        // about
        else {
            newView = new Portfolio.views.AboutPageView({
                name: 'about'
            });
        }

        this.currentView = newView;
        $main.append(newView.el);
        newView.render();
        _trackPage.call(this);
    }

    /**
     * @class PortfolioRouter
     */
    Portfolio.routers.PortfolioRouter = Backbone.Router.extend({

        /**
         * Provided collection containing models defining basic page structure
         * of the site. The router uses this to cache the individual
         * collections for the various CollectionView's.
         *
         * @property pageCollection
         * @type Backbone.Collection
         */
        pageCollection: null,

        /**
         * Handle to the current view being displayed so that remove() can be
         * called on it to cleanup before showing a new view.
         *
         * @property currentView
         * @type Backbone.View
         */
        currentView: null,

        routes: {
            '': 'about',
            'resume': 'resume',
            'portfolio': 'portfolio'
        },

        initialize: function (options) {
            this.pageCollection = options.pageCollection;
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

}(window.Portfolio, Backbone, jQuery));
