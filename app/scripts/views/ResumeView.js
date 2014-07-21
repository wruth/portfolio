(function (Portfolio, Backbone, dust, _) {

    Portfolio.views.ResumeView = Backbone.View.extend({

        tagName: 'section',

        className: 'resume container-12',

        initialize: function (options) {
            _.bindAll(this, 'render');

            if (!this.constructor.collection) {
                var collection = new Backbone.Collection();
                collection.url = '/data/resume.json';

                this.listenTo(collection, 'sync', this.render);
                this.listenTo(collection, 'error', function () {
                    //
                    // TODO: provide ui feedback, perhpas by setting flag and
                    // then render(), which will check for the flag
                    //
                    console.error('Error loading resume collection!');
                });

                collection.fetch();

                this.constructor.collection = collection;
            }
        },

        render: function () {
            var _this = this;

            if (this.constructor.collection.length > 0) {
                dust.render('resume', this.constructor.collection.toJSON(), function (err, output) {

                    if (err) {
                        throw err;
                    }

                    _this.$el.html(output);
                });
            }
            else {
                // TODO: render loading view
                console.log('loading resume...');
            }

            // TODO: handle possible error view state
            return this;
        }
    });

}(window.Portfolio, Backbone, dust, _));
