/**
 * Gutenberg Block JavaScript for DashDig URL Shortener
 *
 * @package    Dashdig_URL_Shortener
 * @subpackage Dashdig_URL_Shortener/assets/js
 * @since      1.0.0
 */

(function() {
	'use strict';

	var el = wp.element.createElement;
	var registerBlockType = wp.blocks.registerBlockType;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var PanelBody = wp.components.PanelBody;
	var TextControl = wp.components.TextControl;
	var ToggleControl = wp.components.ToggleControl;
	var Button = wp.components.Button;
	var Placeholder = wp.components.Placeholder;
	var Spinner = wp.components.Spinner;
	var Notice = wp.components.Notice;
	var __ = wp.i18n.__;
	var apiFetch = wp.apiFetch;

	/**
	 * Register the DashDig URL Shortener block
	 */
	registerBlockType('dashdig/url-shortener', {
		title: __('DashDig URL Shortener', 'dashdig-url-shortener'),
		description: __('Create and insert a shortened URL using DashDig', 'dashdig-url-shortener'),
		icon: 'admin-links',
		category: 'embed',
		keywords: [
			__('url', 'dashdig-url-shortener'),
			__('short', 'dashdig-url-shortener'),
			__('link', 'dashdig-url-shortener'),
			__('dashdig', 'dashdig-url-shortener')
		],
		supports: {
			html: false,
			align: false
		},
		attributes: {
			url: {
				type: 'string',
				default: ''
			},
			linkText: {
				type: 'string',
				default: ''
			},
			shortUrl: {
				type: 'string',
				default: ''
			},
			autoShorten: {
				type: 'boolean',
				default: true
			}
		},

		edit: function(props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var isSelected = props.isSelected;

			var url = attributes.url;
			var linkText = attributes.linkText;
			var shortUrl = attributes.shortUrl;
			var autoShorten = attributes.autoShorten;

			// State management
			var useState = wp.element.useState;
			var useEffect = wp.element.useEffect;
			
			var stateResult = useState({
				isLoading: false,
				error: null
			});
			var state = stateResult[0];
			var setState = stateResult[1];

			// Check if API key is configured
			if (!dashdigBlock.apiKeySet) {
				return el(
					Placeholder,
					{
						icon: 'admin-links',
						label: __('DashDig URL Shortener', 'dashdig-url-shortener')
					},
					el(
						'div',
						{ style: { textAlign: 'center' } },
						el(
							'p',
							{},
							__('Please configure your DashDig API key in the settings.', 'dashdig-url-shortener')
						),
						el(
							Button,
							{
								isPrimary: true,
								href: '/wp-admin/edit.php?post_type=dashdig_link&page=dashdig-settings',
								target: '_blank'
							},
							__('Go to Settings', 'dashdig-url-shortener')
						)
					)
				);
			}

			/**
			 * Shorten URL function
			 */
			function shortenUrl() {
				if (!url) {
					setState({
						isLoading: false,
						error: __('Please enter a URL', 'dashdig-url-shortener')
					});
					return;
				}

				// Validate URL
				try {
					new URL(url);
				} catch (e) {
					setState({
						isLoading: false,
						error: __('Please enter a valid URL (must start with http:// or https://)', 'dashdig-url-shortener')
					});
					return;
				}

				setState({
					isLoading: true,
					error: null
				});

				apiFetch({
					path: '/dashdig/v1/shorten',
					method: 'POST',
					data: {
						url: url
					}
				}).then(function(response) {
					if (response && response.shortUrl) {
						setAttributes({
							shortUrl: response.shortUrl
						});
						setState({
							isLoading: false,
							error: null
						});
					} else {
						setState({
							isLoading: false,
							error: __('Failed to shorten URL', 'dashdig-url-shortener')
						});
					}
				}).catch(function(error) {
					setState({
						isLoading: false,
						error: error.message || __('An error occurred while shortening the URL', 'dashdig-url-shortener')
					});
				});
			}

			/**
			 * Auto-shorten when URL changes (if enabled)
			 */
			useEffect(function() {
				if (autoShorten && url && !shortUrl && !state.isLoading) {
					// Debounce the API call
					var timeout = setTimeout(function() {
						shortenUrl();
					}, 1000);

					return function() {
						clearTimeout(timeout);
					};
				}
			}, [url, autoShorten]);

			/**
			 * Render the block editor interface
			 */
			return el(
				'div',
				{ className: 'wp-block-dashdig-url-shortener' },
				[
					// Inspector Controls (Sidebar)
					el(
						InspectorControls,
						{ key: 'inspector' },
						el(
							PanelBody,
							{
								title: __('Link Settings', 'dashdig-url-shortener'),
								initialOpen: true
							},
							[
								el(TextControl, {
									key: 'url',
									label: __('URL to Shorten', 'dashdig-url-shortener'),
									value: url,
									onChange: function(value) {
										setAttributes({ url: value });
									},
									placeholder: 'https://example.com',
									help: __('Enter the long URL you want to shorten', 'dashdig-url-shortener')
								}),
								el(TextControl, {
									key: 'linkText',
									label: __('Link Text', 'dashdig-url-shortener'),
									value: linkText,
									onChange: function(value) {
										setAttributes({ linkText: value });
									},
									placeholder: __('Click here', 'dashdig-url-shortener'),
									help: __('Optional: Custom text to display for the link', 'dashdig-url-shortener')
								}),
								el(ToggleControl, {
									key: 'autoShorten',
									label: __('Auto-shorten URL', 'dashdig-url-shortener'),
									checked: autoShorten,
									onChange: function(value) {
										setAttributes({ autoShorten: value });
									},
									help: __('Automatically shorten URL when you type', 'dashdig-url-shortener')
								}),
								!autoShorten && el(Button, {
									key: 'shortenButton',
									isPrimary: true,
									onClick: shortenUrl,
									disabled: state.isLoading || !url,
									style: { marginTop: '10px' }
								}, state.isLoading ? __('Shortening...', 'dashdig-url-shortener') : __('Shorten URL', 'dashdig-url-shortener'))
							]
						)
					),

					// Main editor content
					el(
						'div',
						{ key: 'content', className: 'dashdig-block-content' },
						[
							// Error message
							state.error && el(
								Notice,
								{
									key: 'error',
									status: 'error',
									isDismissible: true,
									onRemove: function() {
										setState({ isLoading: false, error: null });
									}
								},
								state.error
							),

							// URL input
							el(TextControl, {
								key: 'urlInput',
								label: __('URL to Shorten', 'dashdig-url-shortener'),
								value: url,
								onChange: function(value) {
									setAttributes({ url: value });
								},
								placeholder: 'https://example.com',
								className: 'dashdig-block-input'
							}),

							// Link text input
							el(TextControl, {
								key: 'linkTextInput',
								label: __('Link Text (Optional)', 'dashdig-url-shortener'),
								value: linkText,
								onChange: function(value) {
									setAttributes({ linkText: value });
								},
								placeholder: __('Click here', 'dashdig-url-shortener'),
								className: 'dashdig-block-input'
							}),

							// Shorten button (if not auto-shortening)
							!autoShorten && el(Button, {
								key: 'shortenBtn',
								isPrimary: true,
								onClick: shortenUrl,
								disabled: state.isLoading || !url
							}, state.isLoading ? __('Shortening...', 'dashdig-url-shortener') : __('Shorten URL', 'dashdig-url-shortener')),

							// Loading spinner
							state.isLoading && el(
								'div',
								{ key: 'loading', style: { padding: '20px', textAlign: 'center' } },
								el(Spinner)
							),

							// Preview shortened URL
							shortUrl && !state.isLoading && el(
								'div',
								{ key: 'preview', className: 'dashdig-block-preview' },
								[
									el('p', { key: 'label' }, el('strong', {}, __('Shortened URL:', 'dashdig-url-shortener'))),
									el(
										'a',
										{
											key: 'link',
											href: shortUrl,
											target: '_blank',
											rel: 'noopener noreferrer'
										},
										[
											el('span', { key: 'icon', className: 'dashicon dashicons-admin-links' }),
											el('span', { key: 'text' }, linkText || shortUrl)
										]
									)
								]
							)
						]
					)
				]
			);
		},

		save: function(props) {
			var attributes = props.attributes;
			var url = attributes.url;
			var linkText = attributes.linkText;
			var shortUrl = attributes.shortUrl;

			// Return null to use PHP render callback
			return null;
		}
	});

})();

