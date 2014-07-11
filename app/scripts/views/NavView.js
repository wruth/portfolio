(function (Portfolio, Backbone, dust, _) {

    var _createMenuData = function () {
        var navList = [
            {
                label: 'About',
                route: '/#'
            },
            {
                label: 'Resume',
                route: '/#resume'
            },
            {
                label: 'Portfolio',
                route: '/#portfolio'
            }
        ];

        return { navList: navList };
    };

    Portfolio.views.NavView = Backbone.View.extend({

        initialize: function () {
            console.log('NavView initialize!');
            _.bindAll(this, 'render');
            this.listenTo(this.model, 'change:activePage', this.render);
        },

        render: function () {
            var _this = this;
            console.log('NavView render!');
            if (this.model.has('activePage')) {

                dust.render('nav', _createMenuData.call(this), function (err, output) {
                    if (err) {
                        throw err;
                    }

                    _this.$el.html(output);
                });
            }
        }

    });

}(window.Portfolio, Backbone, dust, _));
