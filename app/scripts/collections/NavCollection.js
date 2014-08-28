/*
 * Maintains notion of the navigation state of the app. That is, what page the
 * app should be displaying. Updated by the PortfolioRouter, and listened to by
 * the NavView for it to keep selected navigation in sync.
 */
(function (Portfolio, Backbone) {

    /**
     * @class NavCollection
     */
    Portfolio.collections.NavCollection = Backbone.Collection.extend({

        initialize: function () {
            var models = [
                {
                    id: 'about',
                    label: 'About',
                    route: '/#',
                    active: false,
                    aside: true
                },
                {
                    id: 'resume',
                    label: 'Resume',
                    route: '/#resume',
                    active: false,
                    aside: true
                },
                {
                    id: 'portfolio',
                    label: 'Portfolio',
                    route: '/#portfolio',
                    active: false,
                    aside:  false
                }
            ];

            this.reset(models, {silent: true});
        },

        /**
         * Set the active page. Any previous active page is deactivated (it's
         * active property is set to false).
         *
         * @method setActivePage
         * @param {String} pageId id of the page to activate.
         * @return {Model} The activated page Model.
         */
        setActivePage: function (pageId) {
            var newActivePage = this.get(pageId);

            //
            // first make sure every page is not active.
            // do silently because listeners should react to the new active
            // page being set, not all unset.
            //
            this.each(function (model) {
                model.set('active', false, {silent: true});
            });

            // now set the active property for the designated page
            if (newActivePage) {
                newActivePage.set('active', true);
            }

            return newActivePage;
        },

        /**
         * Get the currently active page model.
         *
         * @method getActivePage
         * @return {Model} Currently activated page Model, or null.
         */
        getActivePage: function () {
            return this.where({active: true});
        }
    });

}(window.Portfolio, Backbone));
