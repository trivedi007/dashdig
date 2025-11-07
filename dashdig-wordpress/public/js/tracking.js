/**
 * Dashdig Analytics - Public Tracking Script
 *
 * Tracks user interactions and sends data to Dashdig API.
 *
 * @package    Dashdig_Analytics
 * @subpackage Dashdig_Analytics/public/js
 * @since      1.0.0
 */

(function ($) {
	'use strict';

	/**
	 * Dashdig Analytics Tracker
	 */
	const DashdigTracker = {
		/**
		 * Configuration
		 */
		config: {
			trackingId: '',
			apiUrl: '',
			autoTrack: true,
			trackClicks: true,
			trackScrollDepth: true,
			trackPageTime: true,
			debugMode: false,
		},

		/**
		 * Session data
		 */
		session: {
			startTime: Date.now(),
			pageViews: 0,
			interactions: 0,
			scrollDepth: 0,
			maxScrollDepth: 0,
		},

	/**
	 * Initialize tracker
	 */
	init: function () {
		// Get config from window or WordPress localization
		if (window.dashdigConfig) {
			this.config = { ...this.config, ...window.dashdigConfig };
		} else if (window.dashdigAnalytics) {
			this.config.trackingId = window.dashdigAnalytics.trackingId;
			this.config.apiUrl = window.dashdigAnalytics.apiUrl;
		}

		// Validate configuration
		if (!this.config.trackingId) {
			return;
		}

		// Check consent (if required)
		if (!this.hasConsent()) {
			return;
		}

			// Set up tracking
			if (this.config.autoTrack) {
				this.setupAutoTracking();
			}

			// Track page view
			this.trackPageView();

			// Track page exit
			this.setupPageExit();

			this.log('Tracker initialized', this.config);
		},

		/**
		 * Check if user has given consent
		 */
		hasConsent: function () {
			// Check localStorage for consent
			const consent = localStorage.getItem('dashdig_consent');
			return consent === 'true' || consent === null; // Default to true if not set
		},

		/**
		 * Set up automatic tracking
		 */
		setupAutoTracking: function () {
			// Track clicks
			if (this.config.trackClicks) {
				$(document).on('click', 'a, button', this.handleClick.bind(this));
			}

			// Track scroll depth
			if (this.config.trackScrollDepth) {
				$(window).on('scroll', this.debounce(this.handleScroll.bind(this), 500));
			}

			// Track form submissions
			$('form').on('submit', this.handleFormSubmit.bind(this));

			this.log('Auto-tracking enabled');
		},

		/**
		 * Track page view
		 */
		trackPageView: function () {
			const data = {
				event: 'pageview',
				page: {
					url: window.location.href,
					path: window.location.pathname,
					title: document.title,
					referrer: document.referrer,
				},
				session: {
					id: this.getSessionId(),
					startTime: this.session.startTime,
				},
				device: this.getDeviceInfo(),
				timestamp: new Date().toISOString(),
			};

			this.sendEvent(data);
			this.session.pageViews++;

			this.log('Page view tracked', data);
		},

		/**
		 * Handle click events
		 */
		handleClick: function (e) {
			const $target = $(e.currentTarget);

			// Skip if element has no-track attribute
			if ($target.attr('data-dashdig-ignore')) {
				return;
			}

			const data = {
				event: 'click',
				element: {
					tag: $target.prop('tagName').toLowerCase(),
					id: $target.attr('id') || '',
					class: $target.attr('class') || '',
					text: $target.text().substring(0, 100),
					href: $target.attr('href') || '',
				},
				page: {
					url: window.location.href,
					path: window.location.pathname,
				},
				session: {
					id: this.getSessionId(),
				},
				timestamp: new Date().toISOString(),
			};

			this.sendEvent(data);
			this.session.interactions++;

			this.log('Click tracked', data);
		},

		/**
		 * Handle scroll events
		 */
		handleScroll: function () {
			const scrollTop = $(window).scrollTop();
			const docHeight = $(document).height();
			const winHeight = $(window).height();
			const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100);

			this.session.scrollDepth = scrollPercent;

			// Track max scroll depth milestones (25%, 50%, 75%, 100%)
			if (scrollPercent > this.session.maxScrollDepth) {
				this.session.maxScrollDepth = scrollPercent;

				const milestones = [25, 50, 75, 100];
				const milestone = milestones.find(
					(m) => scrollPercent >= m && this.session.maxScrollDepth < m + 25
				);

				if (milestone) {
					this.sendEvent({
						event: 'scroll_depth',
						depth: milestone,
						page: {
							url: window.location.href,
							path: window.location.pathname,
						},
						session: {
							id: this.getSessionId(),
						},
						timestamp: new Date().toISOString(),
					});

					this.log('Scroll depth tracked:', milestone + '%');
				}
			}
		},

		/**
		 * Handle form submissions
		 */
		handleFormSubmit: function (e) {
			const $form = $(e.currentTarget);

			const data = {
				event: 'form_submit',
				form: {
					id: $form.attr('id') || '',
					class: $form.attr('class') || '',
					action: $form.attr('action') || '',
				},
				page: {
					url: window.location.href,
					path: window.location.pathname,
				},
				session: {
					id: this.getSessionId(),
				},
				timestamp: new Date().toISOString(),
			};

			this.sendEvent(data);

			this.log('Form submission tracked', data);
		},

		/**
		 * Set up page exit tracking
		 */
		setupPageExit: function () {
			const self = this;

			$(window).on('beforeunload', function () {
				const timeOnPage = Math.round((Date.now() - self.session.startTime) / 1000);

				self.sendEvent({
					event: 'page_exit',
					duration: timeOnPage,
					interactions: self.session.interactions,
					maxScrollDepth: self.session.maxScrollDepth,
					page: {
						url: window.location.href,
						path: window.location.pathname,
					},
					session: {
						id: self.getSessionId(),
					},
					timestamp: new Date().toISOString(),
				});

				self.log('Page exit tracked', { duration: timeOnPage });
			});
		},

		/**
		 * Send event to Dashdig API
		 */
		sendEvent: function (data) {
			// Add tracking ID to all events
			data.trackingId = this.config.trackingId;

			// Use Navigator.sendBeacon for reliable tracking even on page exit
			if (navigator.sendBeacon) {
				const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
				navigator.sendBeacon(this.config.apiUrl + '/analytics/track', blob);
			} else {
				// Fallback to AJAX
				$.ajax({
					url: this.config.apiUrl + '/analytics/track',
					type: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json',
					async: true,
				});
			}
		},

		/**
		 * Get or create session ID
		 */
		getSessionId: function () {
			let sessionId = sessionStorage.getItem('dashdig_session_id');

			if (!sessionId) {
				sessionId = this.generateId();
				sessionStorage.setItem('dashdig_session_id', sessionId);
			}

			return sessionId;
		},

		/**
		 * Get device information
		 */
		getDeviceInfo: function () {
			return {
				userAgent: navigator.userAgent,
				language: navigator.language,
				platform: navigator.platform,
				screenWidth: screen.width,
				screenHeight: screen.height,
				viewport: {
					width: $(window).width(),
					height: $(window).height(),
				},
			};
		},

		/**
		 * Generate unique ID
		 */
		generateId: function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				const r = (Math.random() * 16) | 0;
				const v = c === 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});
		},

		/**
		 * Debounce function
		 */
		debounce: function (func, wait) {
			let timeout;
			return function (...args) {
				clearTimeout(timeout);
				timeout = setTimeout(() => func.apply(this, args), wait);
			};
		},

	/**
	 * Log debug messages
	 */
	log: function (...args) {
		// Debug logging removed for production
	},
	};

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function () {
		DashdigTracker.init();
	});

	/**
	 * Expose tracker globally for manual tracking
	 */
	window.DashdigTracker = DashdigTracker;
})(jQuery);


