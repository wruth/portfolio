(function (Portfolio, Backbone, dust, _) {

    Portfolio.views.PortfolioView = Backbone.View.extend({

        tagName: 'section',

        className: 'container-12',

        initialize: function (options) {
            //
        },

        render: function () {
            var _this = this;

            dust.render('portfolio', {}, function (err, output) {

                if (err) {
                    throw err;
                }

                _this.$el.html(output);

            });

            return this;
        }
    });

}(window.Portfolio, Backbone, dust, _));
