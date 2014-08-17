(function (Portfolio, Backbone, dust, _) {

    Portfolio.views.CollectionView = Backbone.View.extend({

        name: null,

        tagName: 'section',

        className: function () {
            return this.name + ' container-12';
        },

        constructor: function (options) {

            if (options.name) {
                this.name = options.name;
                Backbone.View.prototype.constructor.call(this, options);
            }
            else {
                throw new Error('CollectionView option object must have a name property!');
            }
        },

        initialize: function (options) {
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

}(window.Portfolio, Backbone, dust, _));
