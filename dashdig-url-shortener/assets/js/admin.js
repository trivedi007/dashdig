/**
 * Admin JavaScript for DashDig URL Shortener
 *
 * @package    Dashdig_URL_Shortener
 * @subpackage Dashdig_URL_Shortener/assets/js
 * @since      1.0.0
 */

(function($) {
	'use strict';

	/**
	 * All of the code for admin-facing JavaScript functionality
	 * should reside in this file.
	 */

	$(document).ready(function() {

		/**
		 * Toggle API key visibility
		 */
		$('#dashdig-toggle-api-key').on('click', function() {
			var $input = $('#dashdig_api_key');
			var $button = $(this);
			
			if ($input.attr('type') === 'password') {
				$input.attr('type', 'text');
				$button.text(dashdigAdmin.strings.hide || 'Hide');
			} else {
				$input.attr('type', 'password');
				$button.text(dashdigAdmin.strings.show || 'Show');
			}
		});

		/**
		 * Copy shortened URL to clipboard
		 */
		$(document).on('click', '.dashdig-copy-btn', function(e) {
			e.preventDefault();
			
			var $button = $(this);
			var url = $button.data('url');
			
			if (!url) {
				// Try to get URL from adjacent input
				var $input = $button.siblings('input[type="text"]');
				if ($input.length) {
					url = $input.val();
				}
			}
			
			if (!url) {
				return;
			}

			// Copy to clipboard
			copyToClipboard(url).then(function() {
				// Show success feedback
				var originalText = $button.text();
				$button.addClass('copied').text(dashdigAdmin.strings.copied || 'Copied!');
				
				setTimeout(function() {
					$button.removeClass('copied').text(originalText);
				}, 2000);
			}).catch(function(err) {
				console.error('Failed to copy:', err);
				alert(dashdigAdmin.strings.copyFailed || 'Failed to copy to clipboard');
			});
		});

		/**
		 * Copy to clipboard helper function
		 */
		function copyToClipboard(text) {
			// Modern approach using Clipboard API
			if (navigator.clipboard && window.isSecureContext) {
				return navigator.clipboard.writeText(text);
			} else {
				// Fallback for older browsers
				return new Promise(function(resolve, reject) {
					var $temp = $('<textarea>');
					$temp.val(text);
					$temp.css({
						position: 'absolute',
						left: '-9999px'
					});
					$('body').append($temp);
					$temp.select();
					
					try {
						var successful = document.execCommand('copy');
						if (successful) {
							resolve();
						} else {
							reject(new Error('Copy command failed'));
						}
					} catch (err) {
						reject(err);
					} finally {
						$temp.remove();
					}
				});
			}
		}

		/**
		 * Confirm delete action
		 */
		$(document).on('click', '.dashdig-delete-link', function(e) {
			if (!confirm(dashdigAdmin.strings.confirmDelete || 'Are you sure you want to delete this shortened URL?')) {
				e.preventDefault();
				return false;
			}
		});

		/**
		 * Handle bulk shorten form submission
		 */
		$('.dashdig-bulk-form').on('submit', function() {
			var $form = $(this);
			var $button = $form.find('button[type="submit"]');
			var originalText = $button.html();
			
			// Disable button and show loading state
			$button.prop('disabled', true).html('<span class="dashdig-spinner"></span> ' + (dashdigAdmin.strings.processing || 'Processing...'));
			
			// Form will submit normally, but we've provided feedback
		});

		/**
		 * Auto-dismiss notices after 5 seconds
		 */
		setTimeout(function() {
			$('.notice.is-dismissible').fadeOut(500, function() {
				$(this).remove();
			});
		}, 5000);

		/**
		 * Refresh analytics cache
		 */
		$('.dashdig-refresh-analytics').on('click', function(e) {
			e.preventDefault();
			
			var $button = $(this);
			var originalText = $button.text();
			
			$button.prop('disabled', true).text(dashdigAdmin.strings.refreshing || 'Refreshing...');
			
			$.ajax({
				url: dashdigAdmin.ajaxUrl,
				type: 'POST',
				data: {
					action: 'dashdig_refresh_analytics',
					nonce: dashdigAdmin.nonce
				},
				success: function(response) {
					if (response.success) {
						location.reload();
					} else {
						alert(response.data || 'Failed to refresh analytics');
						$button.prop('disabled', false).text(originalText);
					}
				},
				error: function() {
					alert(dashdigAdmin.strings.ajaxError || 'An error occurred');
					$button.prop('disabled', false).text(originalText);
				}
			});
		});

		/**
		 * Classic Editor button integration
		 */
		if (typeof QTags !== 'undefined') {
			QTags.addButton(
				'dashdig_shortener',
				'DashDig',
				function() {
					var url = prompt('Enter URL to shorten:', 'https://');
					if (url && url !== 'https://') {
						QTags.insertContent('[dashdig url="' + url + '"]');
					}
				},
				'',
				'',
				'Insert DashDig shortened URL',
				200
			);
		}

		/**
		 * TinyMCE Classic Editor button
		 */
		if (typeof tinymce !== 'undefined') {
			tinymce.PluginManager.add('dashdig_shortener', function(editor) {
				editor.addButton('dashdig_shortener', {
					text: 'DashDig',
					icon: false,
					tooltip: 'Insert DashDig shortened URL',
					onclick: function() {
						editor.windowManager.open({
							title: 'DashDig URL Shortener',
							body: [
								{
									type: 'textbox',
									name: 'url',
									label: 'URL to shorten',
									value: 'https://',
									placeholder: 'https://example.com'
								},
								{
									type: 'textbox',
									name: 'text',
									label: 'Link text (optional)',
									value: '',
									placeholder: 'Click here'
								}
							],
							onsubmit: function(e) {
								var url = e.data.url;
								var text = e.data.text;
								
								if (!url || url === 'https://') {
									return;
								}
								
								var shortcode = '[dashdig url="' + url + '"';
								if (text) {
									shortcode += ' text="' + text + '"';
								}
								shortcode += ']';
								
								editor.insertContent(shortcode);
							}
						});
					}
				});
			});

			// Register the button
			$(document).on('tinymce-editor-init', function(event, editor) {
				if (editor.settings.toolbar && editor.settings.toolbar.indexOf('dashdig_shortener') === -1) {
					editor.settings.toolbar += ' dashdig_shortener';
				}
			});
		}

		/**
		 * Settings page: Test API connection
		 */
		$('.dashdig-test-api').on('click', function(e) {
			e.preventDefault();
			
			var $button = $(this);
			var apiKey = $('#dashdig_api_key').val();
			var apiEndpoint = $('#dashdig_api_endpoint').val();
			
			if (!apiKey) {
				alert(dashdigAdmin.strings.apiKeyRequired || 'Please enter an API key');
				return;
			}
			
			$button.prop('disabled', true).text(dashdigAdmin.strings.testing || 'Testing...');
			
			$.ajax({
				url: dashdigAdmin.ajaxUrl,
				type: 'POST',
				data: {
					action: 'dashdig_test_api',
					nonce: dashdigAdmin.nonce,
					api_key: apiKey,
					api_endpoint: apiEndpoint
				},
				success: function(response) {
					if (response.success) {
						alert(dashdigAdmin.strings.apiSuccess || 'API connection successful!');
					} else {
						alert(dashdigAdmin.strings.apiFailed + ': ' + (response.data || 'Unknown error'));
					}
					$button.prop('disabled', false).text(dashdigAdmin.strings.testApi || 'Test Connection');
				},
				error: function() {
					alert(dashdigAdmin.strings.ajaxError || 'An error occurred');
					$button.prop('disabled', false).text(dashdigAdmin.strings.testApi || 'Test Connection');
				}
			});
		});

		/**
		 * Sortable columns click handler
		 */
		$('.tablenav-pages a, .manage-column.sortable a, .manage-column.sorted a').on('click', function() {
			// Show loading state
			$('.wp-list-table').addClass('dashdig-loading');
		});

		/**
		 * Bulk actions confirmation
		 */
		$('#doaction, #doaction2').on('click', function(e) {
			var action = $(this).siblings('select').val();
			
			if (action === 'delete') {
				if (!confirm(dashdigAdmin.strings.confirmBulkDelete || 'Are you sure you want to delete the selected items?')) {
					e.preventDefault();
					return false;
				}
			}
		});

		/**
		 * Character counter for custom slug
		 */
		$('#dashdig_custom_slug').on('input', function() {
			var value = $(this).val();
			var length = value.length;
			var maxLength = 50; // Reasonable limit for slugs
			
			var $counter = $(this).siblings('.dashdig-char-counter');
			if (!$counter.length) {
				$counter = $('<span class="dashdig-char-counter description"></span>');
				$(this).after($counter);
			}
			
			$counter.text(length + ' / ' + maxLength + ' characters');
			
			if (length > maxLength) {
				$counter.css('color', '#d63638');
			} else {
				$counter.css('color', '#646970');
			}
		});

		/**
		 * URL validation on input
		 */
		$('#dashdig_long_url, input[name="dashdig_long_url"]').on('blur', function() {
			var $input = $(this);
			var url = $input.val();
			
			if (url && !isValidUrl(url)) {
				$input.css('border-color', '#d63638');
				
				var $error = $input.siblings('.dashdig-url-error');
				if (!$error.length) {
					$error = $('<p class="dashdig-url-error description" style="color: #d63638;"></p>');
					$input.after($error);
				}
				$error.text(dashdigAdmin.strings.invalidUrl || 'Please enter a valid URL (must start with http:// or https://)');
			} else {
				$input.css('border-color', '');
				$input.siblings('.dashdig-url-error').remove();
			}
		});

		/**
		 * URL validation helper
		 */
		function isValidUrl(string) {
			try {
				var url = new URL(string);
				return url.protocol === 'http:' || url.protocol === 'https:';
			} catch (_) {
				return false;
			}
		}

		/**
		 * Initialize tooltips if available
		 */
		if (typeof $.fn.tooltip !== 'undefined') {
			$('[data-tooltip]').tooltip();
		}

	}); // End document ready

})(jQuery);

