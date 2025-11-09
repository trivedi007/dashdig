<?php
/**
 * Plugin Name:       Dashdig - Humanize and Shortenize URLs
 * Plugin URI:        https://dashdig.com
 * Description:       Transform cryptic URLs into human-readable links. Humanize and shortenize URLs with AI-powered smart shortening right from your WordPress dashboard.
 * Version:           1.2.0
 * Requires at least: 5.0
 * Requires PHP:      7.4
 * Author:            Dashdig
 * Author URI:        https://dashdig.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dashdig
 * Domain Path:       /languages
 *
 * @package Dashdig_URL_Shortener
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 */
define( 'DASHDIG_VERSION', '1.2.0' );
define( 'DASHDIG_PLUGIN_NAME', 'Dashdig - Humanize and Shortenize URLs' );
define( 'DASHDIG_TAGLINE', 'Humanize and Shortenize URLs' );

/**
 * Plugin directory path.
 */
define( 'DASHDIG_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Plugin directory URL.
 */
define( 'DASHDIG_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Plugin basename.
 */
define( 'DASHDIG_BASENAME', plugin_basename( __FILE__ ) );

/**
 * API endpoint for DashDig backend.
 */
define( 'DASHDIG_API_ENDPOINT', 'https://dashdig-production.up.railway.app/api' );

/**
 * The code that runs during plugin activation.
 */
function activate_dashdig_url_shortener() {
	require_once DASHDIG_PLUGIN_DIR . 'includes/class-shortener.php';
	Dashdig_Shortener::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_dashdig_url_shortener() {
	require_once DASHDIG_PLUGIN_DIR . 'includes/class-shortener.php';
	Dashdig_Shortener::deactivate();
}

register_activation_hook( __FILE__, 'activate_dashdig_url_shortener' );
register_deactivation_hook( __FILE__, 'deactivate_dashdig_url_shortener' );

/**
 * Load plugin textdomain for internationalization.
 */
function dashdig_load_textdomain() {
	load_plugin_textdomain(
		'dashdig-url-shortener',
		false,
		dirname( DASHDIG_BASENAME ) . '/languages'
	);
}
add_action( 'plugins_loaded', 'dashdig_load_textdomain' );

/**
 * Load required dependencies.
 */
require_once DASHDIG_PLUGIN_DIR . 'includes/class-api-client.php';
require_once DASHDIG_PLUGIN_DIR . 'includes/class-shortener.php';
require_once DASHDIG_PLUGIN_DIR . 'includes/class-block-editor.php';
require_once DASHDIG_PLUGIN_DIR . 'admin/class-settings.php';
require_once DASHDIG_PLUGIN_DIR . 'admin/class-analytics.php';

/**
 * Initialize the plugin.
 */
function run_dashdig_url_shortener() {
	// Initialize admin functionality.
	if ( is_admin() ) {
		$settings  = new Dashdig_Settings();
		$analytics = new Dashdig_Analytics();
	}

	// Initialize shortener (handles shortcodes and post type).
	$shortener = new Dashdig_Shortener();

	// Initialize Gutenberg blocks.
	$block_editor = new Dashdig_Block_Editor();
}

add_action( 'plugins_loaded', 'run_dashdig_url_shortener' );

