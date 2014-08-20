(function (Portfolio, Backbone) {

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

        getActivePage: function () {
            return this.where({active: true});
        }
    });

}(window.Portfolio, Backbone));
