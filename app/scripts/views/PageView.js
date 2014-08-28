/*
 * PageView basic base class for portfolio pages.
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
     * @class PageView
     */
    Portfolio.views.PageView = Backbone.View.extend({

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

        events: function () {
            return {
                'click [data-gacategory=button]' : _handleAnalyticsUIClick
            };
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
                throw new Error('PageView option object must have a name property!');
            }
        },

        /**
         * Template method which concrete subclasses (like CollectionView) can
         * override to return a JSON object to be used for data injection into
         * the template.
         *
         * @method getRenderData
         *
         * @return {Object} This should be a JSON formatted object that is
         *                  usable by the template. That is, either an Object or
         *                  an Array.
         */
        getRenderData: function () {
            return {};
        },

        /**
         * Utilizes dust.render. Will call getRenderData() template method for
         * a data object to inject into the template, and will call postRender()
         * once rendering is complete.
         *
         * @method render
         * @return {View} A Backbone.View.
         */
        render: function () {
            var _this = this;

            dust.render(this.name, this.getRenderData(), function (err, output) {

                if (err) {
                    throw err;
                }

                _this.$el.html(output);
            });

            this.postRender();
            return this;
        },

        /**
         * Template method that is called out of render once the template has
         * been rendered to this view's DOM fragment. Other operations that need
         * to execute on the fragment can be kicked off here. The view's DOM
         * fragment will have already been appended to the document DOM by
         * PortfolioRouter.
         *
         * @method postRender
         */
        postRender: function () {
            // no op
        }
    });

}(window.Portfolio, Backbone, dust, _, jQuery));
