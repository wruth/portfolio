/*
 * Module defining the BatchImageLoader. BatchImageLoader accepts batches of
 * <img> elements, and manages loading the batches in sequential order. Images
 * should not directly assign their src properties, but rather assign the image
 * url to a data-imgsrc property. The BatchImageLoader will manage assigning
 * the urls to the src property as each batch is loaded.
 */
(function (Portfolio, imagesLoaded, $) {

    /**
     * @constructor
     */
    Portfolio.utilities.BatchImageLoader = function () {
        this.queue = [];
    };

    /**
     * Add a batch of img elements to load. Batches will be loaded in the order
     * added.
     *
     * @method addBatch
     * @param {Array} batch An Array of img elements.
     */
    Portfolio.utilities.BatchImageLoader.prototype.addBatch = function (batch) {
        this.queue.push(batch);

        if (this.queue.length === 1) {
            _loadBatch.call(this, batch);
        }
    };

    /**
     * Start loading the designated batch of img elements. This batch is assumed
     * to be the first item in the queue stack.
     *
     * @method _loadBatch
     * @private
     *
     * @param  {Array} batch An Array of img elements to load. They are expected
     *                       to have a 'data-imgsrc' property to use to assign
     *                       the value to the 'src' property.
     */
    function _loadBatch (batch) {
        var _this = this;

        //
        // initiate loading for each img element by assigning the value of its
        // 'data-imgsrc' attribute to it's 'src' attribute.
        //
        $(batch).each(function () {
            var $this = $(this);

            if ($this.data('imgsrc')) {
                $this.attr('src', $this.data('imgsrc'));
            }
        });

        /* jshint newcap:false */
        this.imagesLoaded = new imagesLoaded(batch, function () {
            _this.queue.shift();

            if (_this.queue.length) {
                _loadBatch.call(_this, _this.queue[0]);
            }
        });
        /* jshint newcap:true */
    }

}(window.Portfolio, window.imagesLoaded, jQuery));
