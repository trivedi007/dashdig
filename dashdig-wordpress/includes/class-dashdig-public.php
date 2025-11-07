<?php
/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and handles all public-facing
 * functionality including tracking script injection.
 *
 * @package    Dashdig_Analytics
 * @subpackage Dashdig_Analytics/includes
 * @since      1.0.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The public-facing functionality of the plugin.
 *
 * Handles tracking script injection with comprehensive validation,
 * security checks, and performance optimization.
 *
 * @package    Dashdig_Analytics
 * @subpackage Dashdig_Analytics/includes
 * @since      1.0.0
 */
class Dashdig_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since  1.0.0
	 * @access private
	 * @var    string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since  1.0.0
	 * @access private
	 * @var    string $version The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 1.0.0
	 * @param string $plugin_name The name of the plugin.
	 * @param string $version     The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;

		// Register tracking script hooks.
		$this->register_tracking_hooks();
	}

	/**
	 * Register tracking script hooks based on user preferences.
	 *
	 * @since 1.0.0
	 */
	private function register_tracking_hooks() {
		// Don't load on admin pages.
		if ( is_admin() ) {
			return;
		}

		// Get script position preference.
		$position = get_option( 'dashdig_script_position', 'footer' );
		$position = sanitize_text_field( $position );

		// Hook to appropriate action based on position.
		if ( 'header' === $position ) {
			add_action( 'wp_head', array( $this, 'dashdig_inject_tracking_script' ), 99 );
		} else {
			add_action( 'wp_footer', array( $this, 'dashdig_inject_tracking_script' ), 99 );
		}
	}

	/**
	 * Inject Dashdig tracking script with conditional checks.
	 *
	 * This method performs comprehensive validation before injecting
	 * the tracking script to ensure security, performance, and proper configuration.
	 *
	 * @since 1.0.0
	 */
	public function dashdig_inject_tracking_script() {
		// Don't load on admin pages.
		if ( is_admin() ) {
			return;
		}

		// Check if tracking is enabled.
		$enabled = get_option( 'dashdig_enabled', false );
		$enabled = rest_sanitize_boolean( $enabled );
		if ( ! $enabled ) {
			return;
		}

		// Get and validate API key.
		$api_key = get_option( 'dashdig_api_key', '' );
		$api_key = sanitize_text_field( $api_key );

		if ( empty( $api_key ) || strlen( $api_key ) < 10 ) {
			return;
		}

		// Get tracking ID (optional).
		$tracking_id = get_option( 'dashdig_tracking_id', '' );
		$tracking_id = sanitize_text_field( $tracking_id );

		// Check if user should be excluded.
		$exclude_admins = get_option( 'dashdig_exclude_admins', true );
		$exclude_admins = rest_sanitize_boolean( $exclude_admins );

		if ( $exclude_admins && current_user_can( 'manage_options' ) ) {
			return;
		}

		// Apply developer filter to allow programmatic control.
		$should_load = apply_filters( 'dashdig_should_load_script', true );
		if ( ! $should_load ) {
			return;
		}

		// Apply filter to allow modification of script URL.
		$script_url = apply_filters(
			'dashdig_script_url',
			'https://cdn.dashdig.com/latest/dashdig.min.js'
		);
		$script_url = esc_url( $script_url );

		// Output the tracking script.
		$this->output_tracking_script( $api_key, $tracking_id, $script_url );
	}

	/**
	 * Output the Dashdig tracking script.
	 *
	 * @since 1.0.0
	 * @param string $api_key     The Dashdig API key.
	 * @param string $tracking_id The Dashdig tracking ID.
	 * @param string $script_url  The URL to the tracking script.
	 */
	private function output_tracking_script( $api_key, $tracking_id, $script_url ) {
		?>
		<!-- Dashdig Analytics -->
		<script id="dashdig-analytics-script">
		(function() {
			var script = document.createElement('script');
			script.src = <?php echo wp_json_encode( $script_url ); ?>;
			script.async = true;
			script.setAttribute('data-dashdig-key', <?php echo wp_json_encode( $api_key ); ?>);
			<?php if ( ! empty( $tracking_id ) ) : ?>
			script.setAttribute('data-dashdig-tracking-id', <?php echo wp_json_encode( $tracking_id ); ?>);
			<?php endif; ?>

			window.dashdigConfig = {
				apiKey: <?php echo wp_json_encode( $api_key ); ?>,
				<?php if ( ! empty( $tracking_id ) ) : ?>
				trackingId: <?php echo wp_json_encode( $tracking_id ); ?>,
				<?php endif; ?>
				apiUrl: <?php echo wp_json_encode( DASHDIG_API_ENDPOINT ); ?>,
				autoTrack: true
			};

			script.onerror = function() {
				if (window.console && console.warn) {
					console.warn('Dashdig Analytics: Failed to load tracking script');
				}
			};

			(document.head || document.getElementsByTagName('head')[0]).appendChild(script);
		})();
		</script>
		<!-- End Dashdig Analytics -->
		<?php
	}

	/**
	 * Enqueue public-facing stylesheets.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style(
			$this->plugin_name,
			DASHDIG_ANALYTICS_PLUGIN_URL . 'public/css/public.css',
			array(),
			$this->version,
			'all'
		);
	}

	/**
	 * Enqueue public-facing scripts.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_scripts() {
		// Only enqueue if needed for specific functionality.
		// The main tracking script is injected directly via dashdig_inject_tracking_script().
	}
}

