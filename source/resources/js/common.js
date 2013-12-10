var Portfolio = (function () {

	var init,
		observeViewport,
		fixedTracking,
		clickTracking;

	// public
	init = function () {

		observeViewport.init( $('.work_experience').find('.country') );

		clickTracking.init();

	};


	// private

	observeViewport = {

		init: function () {
			for (var i = arguments.length - 1; i >= 0; i--) {
				this.watchViewportForElements(arguments[i]);
			}
		},

		isElementInViewport: function (el) {
			var rect = el.getBoundingClientRect();
			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) && /*or $(window).height() */
				rect.right <= (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */
			);
		},

		givenElementInViewport: function (el) {
			return (function () {
				if ( this.isElementInViewport(el) ) {
					$(el).addClass('country-visible');
				} else {
					// $(el).removeClass('country-visible');
				}
			}).bind(this);
		},

		watchViewportForElements: function (elements) {
			elements.each((function (index, el) {
				if (window.addEventListener) {
					addEventListener('DOMContentLoaded', this.givenElementInViewport(el), false);
					addEventListener('load', this.givenElementInViewport(el), false);
					addEventListener('scroll', this.givenElementInViewport(el), false);
					addEventListener('resize', this.givenElementInViewport(el), false);
				} else if (window.attachEvent)  {
					attachEvent('DOMContentLoaded', this.givenElementInViewport(el));
					attachEvent('load', this.givenElementInViewport(el));
					attachEvent('scroll', this.givenElementInViewport(el));
					attachEvent('resize', this.givenElementInViewport(el));
				}
			}).bind(this));
		}

	};

	// thanks to gaug.es not allowing event tracking
	fixedTracking = {

		initialized: false,

		trackingTarget: null,

		init: function () {


			if (typeof _gauges !== 'undefined' && !this.initialized) {

				_gauges.title = (function () {

					return this.getTrackingTarget();

				}).bind(this);

				this.initialized = true;

				return true;

			}

			return this.initialized;

		},

		getTrackingTarget: function () {

			var trackingTarget = Portfolio.trackingTarget;

			if (trackingTarget) {
				this.trackingTarget = null;
				return trackingTarget;
			}

			return document.title;

		}

	};

	clickTracking = {

		init: function () {

			var links = $('a[data-gauges-event]');

			links.on('click', (function (event) {

				if (fixedTracking.init()) {

					Portfolio.trackingTarget = 'click: ' + $(event.target).data('gauges-event');

					_gauges.push(['track']);
				}

			}).bind(this));

		}

	};

	return {
		init: init,
		trackingTarget: fixedTracking.trackingTarget
	};

})();


Portfolio.init();






