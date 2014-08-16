(function (Portfolio, Backbone, dust, _) {

    Portfolio.views.StaticView = Backbone.View.extend({

        tagName: 'section',

        className: 'container-12',

        name: null,

        initialize: function (options) {
            this.name = options.name;
        },

        render: function () {
            var _this = this;

            dust.render(this.name, {}, function (err, output) {

                if (err) {
                    throw err;
                }

                _this.$el.html(output);
            });

            return this;
        }
    });

}(window.Portfolio, Backbone, dust, _));
