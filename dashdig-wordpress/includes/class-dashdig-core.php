<?php
/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
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
 * The core plugin class.
 *
 * @since 1.0.0
 */
class Dashdig_Core {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Dashdig_Admin $admin Maintains and registers all hooks for the admin area.
	 */
	protected $admin;

	/**
	 * The API handler for Dashdig API interactions.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Dashdig_API $api Handles API requests and responses.
	 */
	protected $api;

	/**
	 * The public-facing functionality of the plugin.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    Dashdig_Public $public Handles public-facing functionality.
	 */
	protected $public;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->load_dependencies();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * @since  1.0.0
	 * @access private
	 */
	private function load_dependencies() {
		// Admin class is already included in main plugin file.
		// API class is already included in main plugin file.
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since  1.0.0
	 * @access private
	 */
	private function define_admin_hooks() {
		$this->admin = new Dashdig_Admin();

		add_action( 'admin_menu', array( $this->admin, 'add_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this->admin, 'enqueue_admin_assets' ) );
		add_action( 'admin_init', array( $this->admin, 'register_settings' ) );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since  1.0.0
	 * @access private
	 */
	private function define_public_hooks() {
		// Initialize public class.
		$this->public = new Dashdig_Public( 'dashdig-analytics', DASHDIG_ANALYTICS_VERSION );

		// Register public hooks.
		add_action( 'wp_enqueue_scripts', array( $this->public, 'enqueue_styles' ) );
		add_action( 'wp_enqueue_scripts', array( $this->public, 'enqueue_scripts' ) );
	}

	/**
	 * Register the stylesheets and JavaScript for the public-facing side of the site.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_public_assets() {
		// Only load if tracking is enabled.
		$tracking_enabled = get_option( 'dashdig_tracking_enabled', true );

		if ( ! $tracking_enabled ) {
			return;
		}

		wp_enqueue_style(
			'dashdig-analytics-public',
			DASHDIG_ANALYTICS_PLUGIN_URL . 'public/css/public.css',
			array(),
			DASHDIG_ANALYTICS_VERSION,
			'all'
		);

		wp_enqueue_script(
			'dashdig-analytics-tracking',
			DASHDIG_ANALYTICS_PLUGIN_URL . 'public/js/tracking.js',
			array( 'jquery' ),
			DASHDIG_ANALYTICS_VERSION,
			true
		);

		// Pass data to JavaScript.
		wp_localize_script(
			'dashdig-analytics-tracking',
			'dashdigAnalytics',
			array(
				'ajaxUrl'    => admin_url( 'admin-ajax.php' ),
				'apiUrl'     => DASHDIG_API_ENDPOINT,
				'siteId'     => get_option( 'dashdig_site_id', '' ),
				'trackingId' => get_option( 'dashdig_tracking_id', '' ),
				'nonce'      => wp_create_nonce( 'dashdig_analytics_nonce' ),
			)
		);
	}


	/**
	 * Run the plugin.
	 *
	 * @since 1.0.0
	 */
	public function run() {
		// Plugin is running via hooks defined in constructor.
	}

	/**
	 * The code that runs during plugin activation.
	 *
	 * @since 1.0.0
	 */
	public static function activate() {
		// Set default options.
		add_option( 'dashdig_tracking_enabled', true );
		add_option( 'dashdig_track_admins', false );
		add_option( 'dashdig_tracking_id', '' );
		add_option( 'dashdig_site_id', '' );
		add_option( 'dashdig_api_key', '' );
		add_option( 'dashdig_version', DASHDIG_ANALYTICS_VERSION );

		// Flush rewrite rules.
		flush_rewrite_rules();
	}

	/**
	 * The code that runs during plugin deactivation.
	 *
	 * @since 1.0.0
	 */
	public static function deactivate() {
		// Flush rewrite rules.
		flush_rewrite_rules();
	}
}


