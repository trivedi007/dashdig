<?php
/**
 * The Gutenberg block editor class.
 *
 * Handles Gutenberg block integration for URL shortening.
 *
 * @package    Dashdig_URL_Shortener
 * @subpackage Dashdig_URL_Shortener/includes
 * @since      1.0.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The Gutenberg block editor class.
 *
 * @since 1.0.0
 */
class Dashdig_Block_Editor {

	/**
	 * Initialize the class.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
	}

	/**
	 * Register the Gutenberg block.
	 *
	 * @since 1.0.0
	 */
	public function register_block() {
		// Register block type.
		register_block_type(
			'dashdig/url-shortener',
			array(
				'editor_script'   => 'dashdig-block-editor',
				'editor_style'    => 'dashdig-block-editor-style',
				'render_callback' => array( $this, 'render_block' ),
				'attributes'      => array(
					'url'        => array(
						'type'    => 'string',
						'default' => '',
					),
					'linkText'   => array(
						'type'    => 'string',
						'default' => '',
					),
					'shortUrl'   => array(
						'type'    => 'string',
						'default' => '',
					),
					'autoShorten' => array(
						'type'    => 'boolean',
						'default' => true,
					),
				),
			)
		);
	}

	/**
	 * Enqueue block editor assets.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_block_editor_assets() {
		// Enqueue block editor JavaScript.
		wp_enqueue_script(
			'dashdig-block-editor',
			DASHDIG_PLUGIN_URL . 'assets/js/gutenberg-block.js',
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-api-fetch' ),
			DASHDIG_VERSION,
			true
		);

		// Enqueue block editor styles.
		wp_enqueue_style(
			'dashdig-block-editor-style',
			DASHDIG_PLUGIN_URL . 'assets/css/admin.css',
			array( 'wp-edit-blocks' ),
			DASHDIG_VERSION
		);

		// Pass data to JavaScript.
		wp_localize_script(
			'dashdig-block-editor',
			'dashdigBlock',
			array(
				'apiUrl'    => esc_url_raw( rest_url( 'dashdig/v1/shorten' ) ),
				'nonce'     => wp_create_nonce( 'wp_rest' ),
				'apiKeySet' => ! empty( get_option( 'dashdig_api_key' ) ),
			)
		);
	}

	/**
	 * Render the block on the frontend.
	 *
	 * @since 1.0.0
	 * @param array $attributes Block attributes.
	 * @return string Block HTML.
	 */
	public function render_block( $attributes ) {
		$url       = isset( $attributes['url'] ) ? $attributes['url'] : '';
		$link_text = isset( $attributes['linkText'] ) ? $attributes['linkText'] : '';
		$short_url = isset( $attributes['shortUrl'] ) ? $attributes['shortUrl'] : '';

		if ( empty( $url ) ) {
			return '';
		}

		// If no short URL is provided, use shortcode to generate it.
		if ( empty( $short_url ) ) {
			return do_shortcode( '[dashdig url="' . esc_url( $url ) . '" text="' . esc_attr( $link_text ) . '"]' );
		}

		// Use the provided short URL.
		$display_text = ! empty( $link_text ) ? $link_text : $short_url;

		return sprintf(
			'<a href="%s" target="_blank" rel="noopener noreferrer" class="dashdig-short-link">%s</a>',
			esc_url( $short_url ),
			esc_html( $display_text )
		);
	}
}

