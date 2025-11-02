<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and hooks for admin area.
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
 * The admin-specific functionality of the plugin.
 *
 * @since 1.0.0
 */
class Dashdig_Admin {

	/**
	 * Initialize the class.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		// Constructor.
	}

	/**
	 * Add admin menu items.
	 *
	 * @since 1.0.0
	 */
	public function add_admin_menu() {
		add_menu_page(
			__( 'Dashdig Analytics', 'dashdig-analytics' ),
			__( 'Dashdig', 'dashdig-analytics' ),
			'manage_options',
			'dashdig-analytics',
			array( $this, 'display_dashboard_page' ),
			'dashicons-chart-line',
			30
		);

		add_submenu_page(
			'dashdig-analytics',
			__( 'Dashboard', 'dashdig-analytics' ),
			__( 'Dashboard', 'dashdig-analytics' ),
			'manage_options',
			'dashdig-analytics',
			array( $this, 'display_dashboard_page' )
		);

		add_submenu_page(
			'dashdig-analytics',
			__( 'Settings', 'dashdig-analytics' ),
			__( 'Settings', 'dashdig-analytics' ),
			'manage_options',
			'dashdig-settings',
			array( $this, 'display_settings_page' )
		);
	}

	/**
	 * Register plugin settings.
	 *
	 * @since 1.0.0
	 */
	public function register_settings() {
		// Register settings with sanitization callbacks.
		register_setting(
			'dashdig_settings_group',
			'dashdig_tracking_enabled',
			array(
				'type'              => 'boolean',
				'sanitize_callback' => array( $this, 'sanitize_checkbox' ),
				'default'           => true,
			)
		);

		register_setting(
			'dashdig_settings_group',
			'dashdig_tracking_id',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
			)
		);

		register_setting(
			'dashdig_settings_group',
			'dashdig_site_id',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
			)
		);

		register_setting(
			'dashdig_settings_group',
			'dashdig_api_key',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
			)
		);

		register_setting(
			'dashdig_settings_group',
			'dashdig_track_admins',
			array(
				'type'              => 'boolean',
				'sanitize_callback' => array( $this, 'sanitize_checkbox' ),
				'default'           => false,
			)
		);

		// Add settings section.
		add_settings_section(
			'dashdig_main_settings',
			__( 'Main Settings', 'dashdig-analytics' ),
			array( $this, 'main_settings_callback' ),
			'dashdig-settings'
		);

		// Add settings fields.
		add_settings_field(
			'dashdig_tracking_enabled',
			__( 'Enable Tracking', 'dashdig-analytics' ),
			array( $this, 'tracking_enabled_callback' ),
			'dashdig-settings',
			'dashdig_main_settings'
		);

		add_settings_field(
			'dashdig_tracking_id',
			__( 'Tracking ID', 'dashdig-analytics' ),
			array( $this, 'tracking_id_callback' ),
			'dashdig-settings',
			'dashdig_main_settings'
		);

		add_settings_field(
			'dashdig_api_key',
			__( 'API Key', 'dashdig-analytics' ),
			array( $this, 'api_key_callback' ),
			'dashdig-settings',
			'dashdig_main_settings'
		);

		add_settings_field(
			'dashdig_track_admins',
			__( 'Track Admin Users', 'dashdig-analytics' ),
			array( $this, 'track_admins_callback' ),
			'dashdig-settings',
			'dashdig_main_settings'
		);
	}

	/**
	 * Sanitize checkbox value.
	 *
	 * @since 1.0.0
	 * @param mixed $value The checkbox value.
	 * @return bool Sanitized boolean value.
	 */
	public function sanitize_checkbox( $value ) {
		// Checkboxes send '1' when checked, nothing when unchecked.
		return ! empty( $value ) ? true : false;
	}

	/**
	 * Main settings section callback.
	 *
	 * @since 1.0.0
	 */
	public function main_settings_callback() {
		echo '<p>' . esc_html__( 'Configure your Dashdig Analytics settings below.', 'dashdig-analytics' ) . '</p>';
	}

	/**
	 * Tracking enabled field callback.
	 *
	 * @since 1.0.0
	 */
	public function tracking_enabled_callback() {
		$enabled = get_option( 'dashdig_tracking_enabled', true );
		?>
		<label>
			<input type="checkbox" name="dashdig_tracking_enabled" value="1" <?php checked( $enabled, true ); ?> />
			<?php esc_html_e( 'Enable analytics tracking on your website', 'dashdig-analytics' ); ?>
		</label>
		<?php
	}

	/**
	 * Tracking ID field callback.
	 *
	 * @since 1.0.0
	 */
	public function tracking_id_callback() {
		$tracking_id = get_option( 'dashdig_tracking_id', '' );
		?>
		<input type="text" name="dashdig_tracking_id" value="<?php echo esc_attr( $tracking_id ); ?>" class="regular-text" />
		<p class="description"><?php esc_html_e( 'Your Dashdig tracking ID (e.g., DASH-XXXXXXXXXX)', 'dashdig-analytics' ); ?></p>
		<?php
	}

	/**
	 * API key field callback.
	 *
	 * @since 1.0.0
	 */
	public function api_key_callback() {
		$api_key = get_option( 'dashdig_api_key', '' );
		?>
		<input type="password" name="dashdig_api_key" value="<?php echo esc_attr( $api_key ); ?>" class="regular-text" />
		<p class="description"><?php esc_html_e( 'Your Dashdig API key for accessing analytics data', 'dashdig-analytics' ); ?></p>
		<?php
	}

	/**
	 * Track admins field callback.
	 *
	 * @since 1.0.0
	 */
	public function track_admins_callback() {
		$track_admins = get_option( 'dashdig_track_admins', false );
		?>
		<label>
			<input type="checkbox" name="dashdig_track_admins" value="1" <?php checked( $track_admins, true ); ?> />
			<?php esc_html_e( 'Track admin user activity', 'dashdig-analytics' ); ?>
		</label>
		<?php
	}

	/**
	 * Display the dashboard page.
	 *
	 * @since 1.0.0
	 */
	public function display_dashboard_page() {
		require_once DASHDIG_ANALYTICS_PLUGIN_DIR . 'admin/views/dashboard.php';
	}

	/**
	 * Display the settings page.
	 *
	 * @since 1.0.0
	 */
	public function display_settings_page() {
		// Check user capabilities.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'dashdig-analytics' ) );
		}

		// Display success message if settings were saved.
		if ( isset( $_GET['settings-updated'] ) && $_GET['settings-updated'] === 'true' ) {
			add_settings_error(
				'dashdig_messages',
				'dashdig_message',
				__( 'Settings saved successfully!', 'dashdig-analytics' ),
				'success'
			);
		}

		?>
		<div class="wrap dashdig-settings-wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			
			<?php settings_errors( 'dashdig_messages' ); ?>
			
			<form method="post" action="options.php">
				<?php
				settings_fields( 'dashdig_settings_group' );
				do_settings_sections( 'dashdig-settings' );
				submit_button( __( 'Save Changes', 'dashdig-analytics' ) );
				?>
			</form>

			<div class="dashdig-help-section">
				<h2><?php esc_html_e( 'Need Help?', 'dashdig-analytics' ); ?></h2>
				<p><?php esc_html_e( 'Visit the Dashdig dashboard to get your tracking ID and API key.', 'dashdig-analytics' ); ?></p>
				<a href="https://dashdig.com/dashboard" target="_blank" class="button button-secondary">
					<?php esc_html_e( 'Go to Dashdig Dashboard', 'dashdig-analytics' ); ?>
				</a>
			</div>
		</div>
		<?php
	}

	/**
	 * Enqueue admin area styles and scripts.
	 *
	 * @since 1.0.0
	 * @param string $hook The current admin page hook.
	 */
	public function enqueue_admin_assets( $hook ) {
		// Only load on Dashdig admin pages.
		if ( strpos( $hook, 'dashdig' ) === false ) {
			return;
		}

		wp_enqueue_style(
			'dashdig-analytics-admin',
			DASHDIG_ANALYTICS_PLUGIN_URL . 'admin/css/admin.css',
			array(),
			DASHDIG_ANALYTICS_VERSION,
			'all'
		);

		wp_enqueue_script(
			'dashdig-analytics-admin',
			DASHDIG_ANALYTICS_PLUGIN_URL . 'admin/js/admin.js',
			array( 'jquery' ),
			DASHDIG_ANALYTICS_VERSION,
			true
		);

		wp_localize_script(
			'dashdig-analytics-admin',
			'dashdigAdmin',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'dashdig_admin_nonce' ),
				'apiUrl'  => DASHDIG_API_ENDPOINT,
			)
		);
	}
}


