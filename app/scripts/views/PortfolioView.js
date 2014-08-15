(function (Portfolio, Backbone, dust, _) {

    Portfolio.views.PortfolioView = Portfolio.views.CollectionView.extend({

        afterRender: function () {
            _.defer(function (view) {
                view.$el.find('.scroller').wrscroller({
                    scrollDuration: 500,
                    scrollEasing: 'easeInOutQuad'
                });
            }, this);
        }

    });

}(window.Portfolio, Backbone, dust, _));
