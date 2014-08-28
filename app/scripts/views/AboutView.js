(function (Portfolio) {

    Portfolio.views.AboutView = Portfolio.views.PageView.extend({

        events: function () {
            var superEvents = Portfolio.views.PageView.prototype.events();

            superEvents['click [data-label=contact]'] = Portfolio.functions.contact;

            return superEvents;
        }
    });

}(window.Portfolio));
