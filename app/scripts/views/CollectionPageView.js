/*
 * CollectionPageView expects to have a Collection provided to it which it
 * converts to JSON in render for it's template. The template is expected to
 * iterate over and render the Collection.
 */
(function (Portfolio, Backbone, dust, _) {

    /**
     * @class CollectionPageView
     */
    Portfolio.views.CollectionPageView = Portfolio.views.PageView.extend({

        /**
         * The collection will have been cached after the first time this view
         * is created. Check to see if the collection has no items, the
         * assumption being that if it does not it is still asynchronously
         * loading. Since the router will call render initially, the
         * CollectionView should re-render itself once the Collection has
         * loaded.
         *
         * @method initialize
         */
        initialize: function () {
            _.bindAll(this, 'render');

            if (this.collection.length === 0) {
                this.listenTo(this.collection, 'sync', this.render);
                this.listenTo(this.collection, 'error', function () {
                    //
                    // TODO: provide ui feedback, perhaps by setting flag and
                    // then render(), which will check for the flag
                    //
                    console.error('Error loading resume collection!');
                });
            }

        },

        /**
         * Overrides placeholder template implementation to return the
         * collection as JSON.
         *
         * @method getRenderData
         * @return {Array} View's collection as JSON.
         */
        getRenderData: function () {
            return this.collection.toJSON();
        }

    });

}(window.Portfolio, Backbone, dust, _));
