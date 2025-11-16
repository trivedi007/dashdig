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
				updateDashboardStats(response.data);
				hideLoading($container);
			} else {
				showError($container, response.data.message || 'Failed to load analytics data');
			}
		},
		error: function (xhr, status, error) {
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
		const apiKey = $('#dashdig_api_key').val();
		const trackingId = $('#dashdig_tracking_id').val();
		const $resultDiv = $('#dashdig-connection-result');

		// Validate API key
		if (!apiKey || apiKey.trim() === '') {
			$resultDiv.html('<div class="notice notice-error"><p>⚠ Please enter an API key first.</p></div>');
			return;
		}

		// Clear previous results
		$resultDiv.html('');

		// Update button state
		$button.prop('disabled', true).text('Testing...');

		// Make AJAX request
		$.ajax({
			url: dashdigAdmin.ajaxUrl,
			type: 'POST',
			data: {
				action: 'dashdig_test_connection',
				api_key: apiKey,
				tracking_id: trackingId,
				nonce: dashdigAdmin.nonce,
			},
			success: function (response) {
				if (response.success) {
					$resultDiv.html(
						'<div class="notice notice-success"><p>✓ Connection successful! API key is valid.</p></div>'
					);
				} else {
					$resultDiv.html(
						'<div class="notice notice-error"><p>✗ ' + 
						(response.data.message || 'Connection test failed') + 
						'</p></div>'
					);
				}
			},
			error: function (xhr, status, error) {
				$resultDiv.html(
					'<div class="notice notice-error"><p>✗ Connection test failed. Please try again.</p></div>'
				);
			},
			complete: function () {
				$button.prop('disabled', false).text('Test API Key');
			},
		});
	}

	/**
	 * Refresh analytics data.
	 */
	function refreshAnalytics(e) {
		e.preventDefault();
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
				displayInsights(response.data);
				hideLoading($container);
			} else {
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

	/**
	 * Settings page functionality
	 */
	// Test API Key Connection
	$('#dashdig-test-connection').on('click', function(e) {
		e.preventDefault();
		
		var $button = $(this);
		var $loader = $('#dashdig-test-loader');
		var $result = $('#dashdig-test-result');
		var apiKey = $('#dashdig_api_key').val().trim();
		var trackingId = $('#dashdig_tracking_id').val().trim();
		
		// Validate inputs
		if (!apiKey) {
			showTestResult('error', 'Please enter an API key.');
			return;
		}
		
		if (!trackingId) {
			showTestResult('error', 'Please enter a tracking ID.');
			return;
		}
		
		// Show loading state
		$button.prop('disabled', true);
		$loader.show();
		$result.hide();
		
		// Make AJAX request
		$.ajax({
			url: dashdigAdmin.ajaxUrl,
			type: 'POST',
			data: {
				action: 'dashdig_test_connection',
				api_key: apiKey,
				tracking_id: trackingId,
				nonce: dashdigAdmin.nonce
			},
			success: function(response) {
				if (response.success) {
					showTestResult('success', response.data.message || 'API key is valid! Connection successful.');
				} else {
					showTestResult('error', response.data.message || 'Failed to verify API key. Please check your credentials.');
				}
			},
			error: function(xhr, status, error) {
				showTestResult('error', 'Network error. Please try again.');
				console.error('AJAX Error:', error);
			},
			complete: function() {
				$button.prop('disabled', false);
				$loader.hide();
			}
		});
	});
	
	// Show test result message
	function showTestResult(type, message) {
		var $result = $('#dashdig-test-result');
		var icon = type === 'success' ? 'yes' : 'no';
		var color = type === 'success' ? '#46b450' : '#d63638';
		
		$result.html(
			'<div style="padding: 10px; border-left: 4px solid ' + color + '; background: #fff; margin-top: 10px;">' +
				'<span class="dashicons dashicons-' + icon + '" style="color: ' + color + '; margin-right: 5px; font-size: 20px; vertical-align: middle;"></span>' +
				'<strong style="color: ' + color + '; vertical-align: middle;">' + message + '</strong>' +
			'</div>'
		).fadeIn();
	}
	
	// Form validation before submit
	$('#dashdig-settings-form').on('submit', function(e) {
		var apiKey = $('#dashdig_api_key').val().trim();
		var trackingId = $('#dashdig_tracking_id').val().trim();
		
		if (!apiKey || !trackingId) {
			e.preventDefault();
			alert('Please fill in all required fields (API Key and Tracking ID).');
			return false;
		}
	});

})(jQuery);
