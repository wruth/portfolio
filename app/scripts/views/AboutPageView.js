/*
 * View for about, just adds event handling for obfuscated mailto.
 */
(function (Portfolio) {

    /**
     * @class AboutPageView
     */
    Portfolio.views.AboutPageView = Portfolio.views.PageView.extend({

        events: function () {
            var superEvents = Portfolio.views.PageView.prototype.events();

            superEvents['click [data-label=contact]'] = Portfolio.functions.contact;

            return superEvents;
        }
    });

}(window.Portfolio));
