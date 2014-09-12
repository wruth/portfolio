/*
 * NavView module defines NavView Class definition and attaches to the
 * Portfolio.views namespace. Renders simple nav bar for the app, stays in sync
 * with state of PageCollection instance provided.
 */
(function (Portfolio, Backbone, dust) {

    /**
     * Updates the active state of the nav items so that the appropriate one is
     * highlighted. Remove active class from all, then determine index of
     * current active item and apply active class.
     *
     * @method _updateActiveNavItem
     * @private
     */
    function _updateActiveNavItem () {
        var activeModel = this.collection.findWhere({active: true}),
            activeIndex = this.collection.indexOf(activeModel),
            activeEl;

        activeEl = this.$el.find('li')
            .removeClass('active')
            .get(activeIndex);

        if (activeEl) {
            $(activeEl).addClass('active');
        }
    }

    /**
     * Handler for the menu nav icon displayed in the nav lists's collapsed
     * state. Toggles a 'show' class on the nav list, which shows and hides
     * the list (by toggle display:none or display:block).
     *
     * @method _navIconClick
     * @private
     */
    function _handleNavIconClick () {
        this.$el.find('.nav-list').toggleClass('show');
    }

    /**
     * Handler for clicks in the nav list. Ensures the nav list is hidden on a
     * click when displayed compressed below a narrow breakpoint.
     *
     * @method  _handleNavListClick
     * @param {$.Event} ev jQuery Event object
     */
    function _handleNavListClick (ev) {
        $(ev.currentTarget).removeClass('show');
    }

    /**
     * @class NavView
     */
    Portfolio.views.NavView = Backbone.View.extend({

        tagName: 'nav',

        /**
         * MediaQueryList object matching for max-width 599px, where the
         * nav menu changes from compact to visible.
         *
         * @property mql
         * @type MediaQueryList
         */
        mql: null,

        events: {
            'click .contact': Portfolio.functions.contact,
            'click .nav-icon': _handleNavIconClick,
            'click .nav-list': _handleNavListClick
        },

        /**
         * Listen for active property change events on the NavCollection. This
         * is also what keeps the NavView from being garbage collected initially
         *
         * @method initialize
         */
        initialize: function () {
            var _this = this;

            //
            // a media query changes the nav menu from it's expanded always
            // visible state to it's collapsed state. In it's collapsed state
            // clicking the nav icon button toggles a 'show' class on the
            // nav list, toggling it's visibility. But the nav list should have
            // the 'show' class removed if the menu is re-expanded so that it is
            // collapsed by default if the window is resized smaller again.
            // This MediaQueryListener code checks for that condition and
            // handles the case.
            //
            if (window.matchMedia) {
                 this.mql = window.matchMedia('(max-width: 599px)');

                 this.mql.addListener(function (mql) {
                    if (!mql.matches) {
                        _this.$el.find('.nav-list').removeClass('show');
                    }
                 });
            }

            this.listenTo(this.collection, 'change:active', _updateActiveNavItem);
        },

        render: function () {
            var _this = this;

            dust.render('nav', this.collection.toJSON(), function (err, output) {
                if (err) {
                    throw err;
                }

                _this.$el.html(output);
            });

            return this;
        }

    });

}(window.Portfolio, Backbone, dust));
