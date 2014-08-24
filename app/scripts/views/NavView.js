/*
 * NavView module defines NavView Class definition and attaches to the
 * Portfolio.views namespace. Renders simple nav bar for the app, stays in sync
 * with state of NavCollection instance provided.
 *
 * @param  {Object} Portfolio Portfolio app namespace object
 * @param  {Object} Backbone  framework
 * @param  {Object} dust      templating
 * @param  {Object} _         underscore utility
 */
(function (Portfolio, Backbone, dust, _) {

    /**
     * Attempt to obfuscate address through js handling.
     *
     * @private
     * @method  _handleContact
     */
    function _handleContact () {
        var n1 = 'ward',
            n2 = 'ruth',
            a = '@',
            g = 'gmail',
            c = 'com';

        if (ga) {
            ga('send', 'event', 'button', 'click', 'mailto');
        }

        window.location = 'ma' + 'ilto:' + n1 + '.' + n2 + a + g + '.' + c;
    }

    Portfolio.views.NavView = Backbone.View.extend({

        tagName: 'nav',

        events: {
            'click .contact': _handleContact
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
            // NavCollection
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
