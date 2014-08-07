(function (Portfolio, Backbone, dust, _) {

    Portfolio.views.PortfolioView = Portfolio.views.CollectionView.extend({

        afterRender: function () {
            this.$el.find('.scroller').wrscroller();
        }

    });

}(window.Portfolio, Backbone, dust, _));
