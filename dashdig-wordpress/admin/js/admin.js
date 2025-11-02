/**
 * Dashdig Analytics - Admin JavaScript
 *
 * @package    Dashdig_Analytics
 * @subpackage Dashdig_Analytics/admin/js
 * @since      1.0.0
 */

(function ($) {
	'use strict';

	/**
	 * Initialize admin dashboard.
	 */
	$(document).ready(function () {
		console.log('🚀 Dashdig Analytics Admin Loaded');

		// Initialize dashboard if on dashboard page
		if ($('.dashdig-dashboard-wrap').length) {
			initDashboard();
		}

		// Test API connection button
		$('#dashdig-test-connection').on('click', testApiConnection);

		// Refresh analytics button
		$('#dashdig-refresh-analytics').on('click', refreshAnalytics);

		// Get AI insights button
		$('#dashdig-get-insights').on('click', getAIInsights);
	});

	/**
	 * Initialize dashboard with data.
	 */
	function initDashboard() {
		console.log('📊 Initializing Dashdig Dashboard');

		// Load initial analytics data
		loadAnalyticsData();

		// Set up auto-refresh every 5 minutes
		setInterval(loadAnalyticsData, 300000);
	}

	/**
	 * Load analytics data from API.
	 */
	function loadAnalyticsData() {
		const $container = $('.dashdig-stats-container');

		if (!$container.length) {
			return;
		}

		// Show loading state
		showLoading($container);

		// Make AJAX request
		$.ajax({
			url: dashdigAdmin.ajaxUrl,
			type: 'POST',
			data: {
				action: 'dashdig_get_analytics',
				nonce: dashdigAdmin.nonce,
			},
			success: function (response) {
				if (response.success) {
					console.log('✅ Analytics data loaded:', response.data);
					updateDashboardStats(response.data);
					hideLoading($container);
				} else {
					console.error('❌ Failed to load analytics:', response.data);
					showError($container, response.data.message || 'Failed to load analytics data');
				}
			},
			error: function (xhr, status, error) {
				console.error('❌ AJAX Error:', error);
				showError($container, 'Network error. Please try again.');
			},
		});
	}

	/**
	 * Update dashboard statistics.
	 *
	 * @param {Object} data Analytics data.
	 */
	function updateDashboardStats(data) {
		// Update page views
		$('#dashdig-stat-pageviews .dashdig-card-value').text(
			formatNumber(data.pageViews || 0)
		);

		// Update visitors
		$('#dashdig-stat-visitors .dashdig-card-value').text(
			formatNumber(data.visitors || 0)
		);

		// Update bounce rate
		$('#dashdig-stat-bounce .dashdig-card-value').text(
			(data.bounceRate || 0).toFixed(1) + '%'
		);

		// Update average session duration
		$('#dashdig-stat-duration .dashdig-card-value').text(
			formatDuration(data.avgDuration || 0)
		);

		// Update change percentages
		updateChangeIndicator('#dashdig-stat-pageviews', data.pageViewsChange);
		updateChangeIndicator('#dashdig-stat-visitors', data.visitorsChange);
		updateChangeIndicator('#dashdig-stat-bounce', data.bounceRateChange, true);
		updateChangeIndicator('#dashdig-stat-duration', data.durationChange);
	}

	/**
	 * Update change indicator.
	 *
	 * @param {string} selector Element selector.
	 * @param {number} change   Change percentage.
	 * @param {boolean} inverse Whether lower is better.
	 */
	function updateChangeIndicator(selector, change, inverse = false) {
		if (!change) {
			return;
		}

		const $change = $(selector + ' .dashdig-card-change');
		const isPositive = inverse ? change < 0 : change > 0;
		const arrow = isPositive ? '↑' : '↓';

		$change
			.text(arrow + ' ' + Math.abs(change).toFixed(1) + '% vs last period')
			.toggleClass('negative', !isPositive);
	}

	/**
	 * Test API connection.
	 */
	function testApiConnection(e) {
		e.preventDefault();

		const $button = $(this);
		const originalText = $button.text();

		$button.prop('disabled', true).text('Testing...');

		$.ajax({
			url: dashdigAdmin.ajaxUrl,
			type: 'POST',
			data: {
				action: 'dashdig_test_connection',
				nonce: dashdigAdmin.nonce,
			},
			success: function (response) {
				if (response.success) {
					showNotice('✅ API connection successful!', 'success');
				} else {
					showNotice('❌ API connection failed: ' + response.data.message, 'error');
				}
			},
			error: function () {
				showNotice('❌ Network error. Please check your connection.', 'error');
			},
			complete: function () {
				$button.prop('disabled', false).text(originalText);
			},
		});
	}

	/**
	 * Refresh analytics data.
	 */
	function refreshAnalytics(e) {
		e.preventDefault();
		console.log('🔄 Refreshing analytics...');
		loadAnalyticsData();
	}

	/**
	 * Get AI insights.
	 */
	function getAIInsights(e) {
		e.preventDefault();

		const $button = $(this);
		const $container = $('.dashdig-insights-container');
		const originalText = $button.text();

		$button.prop('disabled', true).text('Generating Insights...');
		showLoading($container);

		$.ajax({
			url: dashdigAdmin.ajaxUrl,
			type: 'POST',
			data: {
				action: 'dashdig_get_insights',
				nonce: dashdigAdmin.nonce,
			},
			success: function (response) {
				if (response.success) {
					console.log('✅ AI Insights received:', response.data);
					displayInsights(response.data);
					hideLoading($container);
				} else {
					console.error('❌ Failed to get insights:', response.data);
					showError($container, response.data.message || 'Failed to generate insights');
				}
			},
			error: function () {
				showError($container, 'Network error. Please try again.');
			},
			complete: function () {
				$button.prop('disabled', false).text(originalText);
			},
		});
	}

	/**
	 * Display AI insights.
	 *
	 * @param {Object} data Insights data.
	 */
	function displayInsights(data) {
		const $container = $('.dashdig-insights-content');

		if (!$container.length || !data.insights) {
			return;
		}

		let html = '<ul class="dashdig-insights-list">';
		data.insights.forEach(function (insight) {
			html += '<li>' + insight + '</li>';
		});
		html += '</ul>';

		$container.html(html);
	}

	/**
	 * Show loading state.
	 *
	 * @param {jQuery} $container Container element.
	 */
	function showLoading($container) {
		$container.html(
			'<div class="dashdig-loading">' +
				'<div class="dashdig-spinner"></div>' +
				'</div>'
		);
	}

	/**
	 * Hide loading state.
	 *
	 * @param {jQuery} $container Container element.
	 */
	function hideLoading($container) {
		$container.find('.dashdig-loading').remove();
	}

	/**
	 * Show error message.
	 *
	 * @param {jQuery} $container Container element.
	 * @param {string} message    Error message.
	 */
	function showError($container, message) {
		$container.html(
			'<div class="dashdig-error">' +
				'<p>' +
				message +
				'</p>' +
				'</div>'
		);
	}

	/**
	 * Show admin notice.
	 *
	 * @param {string} message Notice message.
	 * @param {string} type    Notice type (success, error, warning, info).
	 */
	function showNotice(message, type = 'success') {
		const $notice = $(
			'<div class="notice notice-' +
				type +
				' is-dismissible">' +
				'<p>' +
				message +
				'</p>' +
				'</div>'
		);

		$('.dashdig-dashboard-wrap, .dashdig-settings-wrap')
			.first()
			.prepend($notice);

		// Auto dismiss after 5 seconds
		setTimeout(function () {
			$notice.fadeOut(function () {
				$(this).remove();
			});
		}, 5000);
	}

	/**
	 * Format number with commas.
	 *
	 * @param {number} num Number to format.
	 * @return {string} Formatted number.
	 */
	function formatNumber(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	/**
	 * Format duration in seconds to readable format.
	 *
	 * @param {number} seconds Duration in seconds.
	 * @return {string} Formatted duration.
	 */
	function formatDuration(seconds) {
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);

		if (minutes > 0) {
			return minutes + 'm ' + secs + 's';
		}

		return secs + 's';
	}
})(jQuery);


