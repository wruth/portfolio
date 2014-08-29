/*
 * NavView module defines NavView Class definition and attaches to the
 * Portfolio.views namespace. Renders simple nav bar for the app, stays in sync
 * with state of PageCollection instance provided.
 */
(function (Portfolio, Backbone, dust, _) {

    /**
     * @class NavView
     */
    Portfolio.views.NavView = Backbone.View.extend({

        tagName: 'nav',

        events: {
            'click .contact': Portfolio.functions.contact
        },

        /**
         * Listen for active property change events on the NavCollection. This
         * is also what keeps the NavView from being garbage collected initially
         *
         * @method initialize
         */
        initialize: function () {
            _.bindAll(this, 'render');
            this.listenTo(this.collection, 'change:active', this.render);
        },

        render: function () {
            var _this = this;

            //
            // only render once the router has set an active page on the
            // PageCollection
            //
            if (this.collection.getActivePage()) {

                dust.render('nav', this.collection.toJSON(), function (err, output) {
                    if (err) {
                        throw err;
                    }

                    _this.$el.html(output);
                });
            }

            return this;
        }

    });

}(window.Portfolio, Backbone, dust, _));
