var Portfolio = (function () {

	var init,
		observeViewport;

	// public
	init = function () {

		console.log('init Portfolio');

		observeViewport.init( $('.work_experience').find('.country') );

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
					$(el).addClass('visible');
				} else {
					// $(el).removeClass('visible');
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

	return {
		init: init
	};

})();


Portfolio.init();


