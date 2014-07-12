(function (Portfolio, Backbone, dust, _) {


    Portfolio.views.NavView = Backbone.View.extend({

        initialize: function () {
            console.log('NavView initialize!');
            _.bindAll(this, 'render');
            this.listenTo(this.collection, 'change:active', this.render);
        },

        render: function () {
            var _this = this;
            console.log('NavView render!');
            if (this.collection.getActivePage()) {

                dust.render('nav', this.collection.toJSON(), function (err, output) {
                    if (err) {
                        throw err;
                    }

                    _this.$el.html(output);
                });
            }
        }

    });

}(window.Portfolio, Backbone, dust, _));
