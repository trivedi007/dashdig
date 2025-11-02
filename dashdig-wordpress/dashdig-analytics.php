<?php
/**
 * Plugin Name:       Dashdig Analytics
 * Plugin URI:        https://dashdig.com/wordpress-plugin
 * Description:       Powerful analytics tracking with AI-powered insights for your WordPress site
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Dashdig
 * Author URI:        https://dashdig.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dashdig-analytics
 * Domain Path:       /languages
 *
 * @package Dashdig_Analytics
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 */
define( 'DASHDIG_ANALYTICS_VERSION', '1.0.0' );

/**
 * Plugin directory path.
 */
define( 'DASHDIG_ANALYTICS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Plugin directory URL.
 */
define( 'DASHDIG_ANALYTICS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Plugin basename.
 */
define( 'DASHDIG_ANALYTICS_BASENAME', plugin_basename( __FILE__ ) );

/**
 * API endpoint for Dashdig backend.
 */
define( 'DASHDIG_API_ENDPOINT', 'https://dashdig-production.up.railway.app/api' );

/**
 * The code that runs during plugin activation.
 */
function activate_dashdig_analytics() {
	require_once DASHDIG_ANALYTICS_PLUGIN_DIR . 'includes/class-dashdig-core.php';
	Dashdig_Core::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_dashdig_analytics() {
	require_once DASHDIG_ANALYTICS_PLUGIN_DIR . 'includes/class-dashdig-core.php';
	Dashdig_Core::deactivate();
}

register_activation_hook( __FILE__, 'activate_dashdig_analytics' );
register_deactivation_hook( __FILE__, 'deactivate_dashdig_analytics' );

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since 1.0.0
 */
function run_dashdig_analytics() {
	// Load core classes.
	require_once DASHDIG_ANALYTICS_PLUGIN_DIR . 'includes/class-dashdig-core.php';
	require_once DASHDIG_ANALYTICS_PLUGIN_DIR . 'includes/class-dashdig-admin.php';
	require_once DASHDIG_ANALYTICS_PLUGIN_DIR . 'includes/class-dashdig-api.php';

	// Initialize the plugin.
	$plugin = new Dashdig_Core();
	$plugin->run();
}

run_dashdig_analytics();


