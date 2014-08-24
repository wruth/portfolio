/*
 * CollectionView expects to have a Collection provided to it which it converts
 * to JSON in render for it's template. The template is expected to iterate over
 * and render the Collection.
 */
(function (Portfolio, Backbone, dust, _, $) {

    // private methods

    /**
     * Handle clicks on any UI elements which have a data-galabel property in
     * order to report them as Google Analytics events. These will be reported
     * with the ga category 'button' and the ga action 'click'.
     *
     * @method _handleAnalyticsUIClick
     * @private
     *
     * @param  {jQuery Event} ev jQuery event object
     */
    function _handleAnalyticsUIClick (ev) {
        var label = $(ev.currentTarget).data('galabel');

        if (ga) {
            ga('send', 'event', 'button', 'click', label);
        }
    }

    /**
     * Class definition
     */
    Portfolio.views.CollectionView = Backbone.View.extend({

        /**
         * Should be passed in as an initialization property. Used to provide a
         * custom css class selector on the element for this view, as well as to
         * look up the dust template to use for rendering the view.
         *
         * @property name
         * @type String
         */
        name: null,

        tagName: 'section',

        className: function () {
            return this.name + ' container-12';
        },

        events: {
            'click [data-gacategory=button]' : _handleAnalyticsUIClick
        },

        /**
         * The name property of the options object is used as a selector on the
         * view's element, as well as being used to look up the template to use
         * for rendering. The name property needs to be extracted here in the
         * constructor instead of in initialize because the className property
         * is dynamically resolved before intializae is called.
         *
         * @constructor
         * @param  {Object} options Options object with a name property.
         */
        constructor: function (options) {

            if (options.name) {
                this.name = options.name;
                Backbone.View.prototype.constructor.call(this, options);
            }
            else {
                throw new Error('CollectionView option object must have a name property!');
            }
        },

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
                    // TODO: provide ui feedback, perhpas by setting flag and
                    // then render(), which will check for the flag
                    //
                    console.error('Error loading resume collection!');
                });
            }

        },

        /**
         * Render conditionally renders depending on if the collection has any
         * items or not. If the collection does have members, render the
         * collection view normally. If not skip rendering, since render in this
         * case should be re-invoked via the listener attached to the
         * collection's sync event in initialize.
         *
         * @method render
         * @return {View} A reference to an instance of this View, per Backbone
         *                custom.
         */
        render: function () {
            var _this = this;

            if (this.collection.length > 0) {
                dust.render(this.name, this.collection.toJSON(), function (err, output) {

                    if (err) {
                        throw err;
                    }

                    _this.$el.html(output);
                });

                if (this.afterRender) {
                    this.afterRender();
                }
            }
            else {
                // TODO: render loading view
                console.log('loading ' + this.name + '...');
            }

            // TODO: handle possible error view state
            return this;
        }
    });

}(window.Portfolio, Backbone, dust, _, jQuery));
