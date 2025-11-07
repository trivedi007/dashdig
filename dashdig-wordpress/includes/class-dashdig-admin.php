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
		// Register AJAX handlers.
		add_action( 'wp_ajax_dashdig_test_connection', array( $this, 'ajax_test_connection' ) );
	}

	/**
	 * Add admin menu items.
	 *
	 * Registers the Dashdig Analytics settings page under Settings menu.
	 *
	 * @since 1.0.0
	 */
	public function add_admin_menu() {
		add_options_page(
			__( 'Dashdig Analytics Settings', 'dashdig-analytics' ), // Page title
			__( 'Dashdig Analytics', 'dashdig-analytics' ),           // Menu title
			'manage_options',                                          // Capability
			'dashdig-settings',                                        // Menu slug
			array( $this, 'display_settings_page' )                   // Callback function
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
			'dashdig_options_group',
			'dashdig_tracking_id',
			array(
				'type'              => 'string',
				'sanitize_callback' => array( $this, 'sanitize_tracking_id' ),
				'default'           => '',
				'show_in_rest'      => false,
			)
		);

		register_setting(
			'dashdig_options_group',
			'dashdig_api_key',
			array(
				'type'              => 'string',
				'sanitize_callback' => array( $this, 'sanitize_api_key' ),
				'default'           => '',
				'show_in_rest'      => false,
			)
		);

		register_setting(
			'dashdig_options_group',
			'dashdig_enabled',
			array(
				'type'              => 'boolean',
				'sanitize_callback' => function( $value ) {
					// Checkbox returns '1' when checked, null when unchecked.
					return ! empty( $value ) ? 1 : 0;
				},
				'default'           => 0,
				'show_in_rest'      => false,
			)
		);

		register_setting(
			'dashdig_options_group',
			'dashdig_script_position',
			array(
				'type'              => 'string',
				'sanitize_callback' => array( $this, 'sanitize_script_position' ),
				'default'           => 'footer',
				'show_in_rest'      => false,
			)
		);

		register_setting(
			'dashdig_options_group',
			'dashdig_exclude_admins',
			array(
				'type'              => 'boolean',
				'sanitize_callback' => function( $value ) {
					// Checkbox returns '1' when checked, null when unchecked.
					return ! empty( $value ) ? 1 : 0;
				},
				'default'           => 1,
				'show_in_rest'      => false,
			)
		);

		// Add settings section.
		add_settings_section(
			'dashdig_main_settings',
			__( 'Main Settings', 'dashdig-analytics' ),
			array( $this, 'main_settings_callback' ),
			'dashdig-settings'
		);

		// Add settings section for advanced options.
		add_settings_section(
			'dashdig_advanced_settings',
			__( 'Advanced Settings', 'dashdig-analytics' ),
			array( $this, 'advanced_settings_callback' ),
			'dashdig-settings'
		);

		// Add settings fields - Main Section.
		add_settings_field(
			'dashdig_enabled',
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

		// Add settings fields - Advanced Section.
		add_settings_field(
			'dashdig_script_position',
			__( 'Script Position', 'dashdig-analytics' ),
			array( $this, 'script_position_callback' ),
			'dashdig-settings',
			'dashdig_advanced_settings'
		);

		add_settings_field(
			'dashdig_exclude_admins',
			__( 'Exclude Admin Users', 'dashdig-analytics' ),
			array( $this, 'exclude_admins_callback' ),
			'dashdig-settings',
			'dashdig_advanced_settings'
		);

		add_settings_field(
			'dashdig_track_admins',
			__( 'Track Admin Users (Legacy)', 'dashdig-analytics' ),
			array( $this, 'track_admins_callback' ),
			'dashdig-settings',
			'dashdig_advanced_settings'
		);
	}

	/**
	 * Sanitize checkbox value.
	 *
	 * @since 1.0.0
	 * @param mixed $value The checkbox value.
	 * @return int Sanitized boolean value (1 or 0).
	 */
	public function sanitize_checkbox( $value ) {
		// Checkboxes send '1' when checked, nothing when unchecked.
		return ! empty( $value ) ? 1 : 0;
	}

	/**
	 * Sanitize and validate API key.
	 *
	 * @since 1.0.0
	 * @param string $api_key The API key to sanitize.
	 * @return string Sanitized API key.
	 */
	public function sanitize_api_key( $api_key ) {
		$api_key = sanitize_text_field( $api_key );
		$api_key = trim( $api_key );

		// Validate format if not empty.
		if ( ! empty( $api_key ) ) {
			// Validate minimum length.
			if ( strlen( $api_key ) < 10 ) {
				add_settings_error(
					'dashdig_api_key',
					'invalid_api_key_length',
					__( 'API key is too short. Please enter a valid API key from your Dashdig dashboard.', 'dashdig-analytics' ),
					'error'
				);
				return get_option( 'dashdig_api_key', '' );
			}

			// Validate if it contains only allowed characters.
			if ( ! preg_match( '/^[a-zA-Z0-9_-]+$/', $api_key ) ) {
				add_settings_error(
					'dashdig_api_key',
					'invalid_api_key_format',
					__( 'API key contains invalid characters. Please check your API key.', 'dashdig-analytics' ),
					'error'
				);
				return get_option( 'dashdig_api_key', '' );
			}
		}

		return $api_key;
	}

	/**
	 * Sanitize and validate tracking ID.
	 *
	 * @since 1.0.0
	 * @param string $tracking_id The tracking ID to sanitize.
	 * @return string Sanitized tracking ID.
	 */
	public function sanitize_tracking_id( $tracking_id ) {
		$tracking_id = sanitize_text_field( $tracking_id );
		$tracking_id = trim( $tracking_id );

		// Validate format if not empty.
		if ( ! empty( $tracking_id ) ) {
			// Validate that it contains only allowed characters (alphanumeric, hyphens, underscores).
			if ( ! preg_match( '/^[a-zA-Z0-9\-_]+$/', $tracking_id ) ) {
				add_settings_error(
					'dashdig_tracking_id',
					'invalid_tracking_id_format',
					__( 'Invalid tracking ID format. Please use only letters, numbers, hyphens, and underscores.', 'dashdig-analytics' ),
					'error'
				);
				return get_option( 'dashdig_tracking_id', '' );
			}

			// Validate minimum length (at least 3 characters).
			if ( strlen( $tracking_id ) < 3 ) {
				add_settings_error(
					'dashdig_tracking_id',
					'invalid_tracking_id_length',
					__( 'Tracking ID is too short. Please enter at least 3 characters.', 'dashdig-analytics' ),
					'error'
				);
				return get_option( 'dashdig_tracking_id', '' );
			}
		}

		return $tracking_id;
	}

	/**
	 * Sanitize script position.
	 *
	 * @since 1.0.0
	 * @param string $position The script position.
	 * @return string Sanitized position.
	 */
	public function sanitize_script_position( $position ) {
		$valid_positions = array( 'header', 'footer' );
		$position = sanitize_text_field( $position );

		// Validate against allowed values.
		if ( ! in_array( $position, $valid_positions, true ) ) {
			add_settings_error(
				'dashdig_script_position',
				'invalid_position',
				__( 'Invalid script position. Defaulting to footer.', 'dashdig-analytics' ),
				'warning'
			);
			return 'footer';
		}

		return $position;
	}

	/**
	 * Main settings section callback.
	 *
	 * @since 1.0.0
	 */
	public function main_settings_callback() {
		echo '<p>' . esc_html__( 'Configure your Dashdig Analytics settings below.', 'dashdig-analytics' ) . '</p>';
		?>
		<p class="description">
			<?php
			printf(
				/* translators: %s: URL to Dashdig dashboard */
				esc_html__( 'Get your Tracking ID and API Key from your %s.', 'dashdig-analytics' ),
				'<a href="https://dashdig.com/dashboard" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Dashdig Dashboard', 'dashdig-analytics' ) . '</a>'
			);
			?>
		</p>
		<?php
	}

	/**
	 * Advanced settings section callback.
	 *
	 * @since 1.0.0
	 */
	public function advanced_settings_callback() {
		echo '<p>' . esc_html__( 'Advanced configuration options for Dashdig Analytics.', 'dashdig-analytics' ) . '</p>';
	}

	/**
	 * Tracking enabled field callback.
	 *
	 * @since 1.0.0
	 */
	public function tracking_enabled_callback() {
		$enabled = get_option( 'dashdig_enabled', true );
		?>
		<label>
			<input type="checkbox" name="dashdig_enabled" value="1" <?php checked( $enabled, true ); ?> />
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
		<p class="description">
			<?php esc_html_e( 'Legacy setting. Use "Exclude Admin Users" below for better control.', 'dashdig-analytics' ); ?>
		</p>
		<?php
	}

	/**
	 * Script position field callback.
	 *
	 * @since 1.0.0
	 */
	public function script_position_callback() {
		$position = get_option( 'dashdig_script_position', 'footer' );
		?>
		<select name="dashdig_script_position" id="dashdig_script_position">
			<option value="header" <?php selected( $position, 'header' ); ?>>
				<?php esc_html_e( 'Header (Load Early)', 'dashdig-analytics' ); ?>
			</option>
			<option value="footer" <?php selected( $position, 'footer' ); ?>>
				<?php esc_html_e( 'Footer (Recommended)', 'dashdig-analytics' ); ?>
			</option>
		</select>
		<p class="description">
			<?php esc_html_e( 'Choose where to load the tracking script. Footer is recommended for better page load performance.', 'dashdig-analytics' ); ?>
		</p>
		<?php
	}

	/**
	 * Exclude admins field callback.
	 *
	 * @since 1.0.0
	 */
	public function exclude_admins_callback() {
		$exclude_admins = get_option( 'dashdig_exclude_admins', true );
		?>
		<label>
			<input type="checkbox" name="dashdig_exclude_admins" value="1" <?php checked( $exclude_admins, true ); ?> />
			<?php esc_html_e( 'Exclude administrators from tracking', 'dashdig-analytics' ); ?>
		</label>
		<p class="description">
			<?php esc_html_e( 'When enabled, users with administrator capabilities will not be tracked.', 'dashdig-analytics' ); ?>
		</p>
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
		// Load the settings page template.
		require_once DASHDIG_ANALYTICS_PLUGIN_DIR . 'admin/partials/admin-display.php';
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

	/**
	 * AJAX handler to test API connection.
	 *
	 * Validates the API key and optionally tracking ID by making
	 * a test request to the Dashdig API.
	 *
	 * @since 1.0.0
	 */
	public function ajax_test_connection() {
		// Verify nonce.
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'dashdig_admin_nonce' ) ) {
			wp_send_json_error(
				array( 'message' => __( 'Security check failed.', 'dashdig-analytics' ) )
			);
			return;
		}

		// Check user capabilities.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				array( 'message' => __( 'Unauthorized. You do not have permission to perform this action.', 'dashdig-analytics' ) )
			);
			return;
		}

		// Get and sanitize API key.
		if ( ! isset( $_POST['api_key'] ) ) {
			wp_send_json_error(
				array( 'message' => __( 'API key is required.', 'dashdig-analytics' ) )
			);
			return;
		}

		$api_key = sanitize_text_field( wp_unslash( $_POST['api_key'] ) );

		// Validate API key.
		if ( empty( $api_key ) ) {
			wp_send_json_error(
				array( 'message' => __( 'API key cannot be empty.', 'dashdig-analytics' ) )
			);
			return;
		}

		// Get tracking ID if provided (optional).
		$tracking_id = isset( $_POST['tracking_id'] ) ? sanitize_text_field( wp_unslash( $_POST['tracking_id'] ) ) : '';

		// Prepare request body.
		$request_body = array();
		if ( ! empty( $tracking_id ) ) {
			$request_body['trackingId'] = $tracking_id;
		}

		// Test the connection by making a request to Dashdig API.
		$response = wp_remote_post(
			DASHDIG_API_ENDPOINT . '/verify',
			array(
				'headers' => array(
					'Authorization' => 'Bearer ' . $api_key,
					'Content-Type'  => 'application/json',
					'User-Agent'    => 'Dashdig-WordPress/' . DASHDIG_ANALYTICS_VERSION,
				),
				'body'    => wp_json_encode( $request_body ),
				'timeout' => 15,
			)
		);

		// Check for errors.
		if ( is_wp_error( $response ) ) {
			wp_send_json_error(
				array(
					'message' => sprintf(
						/* translators: %s: error message */
						__( 'Connection failed: %s', 'dashdig-analytics' ),
						$response->get_error_message()
					),
				)
			);
			return;
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = wp_remote_retrieve_body( $response );

		// Check response code.
		if ( 200 === $response_code ) {
			// Success!
			$data = json_decode( $response_body, true );
			
			wp_send_json_success(
				array(
					'message' => __( 'API key is valid! Connection successful.', 'dashdig-analytics' ),
					'data'    => $data,
				)
			);
		} elseif ( 401 === $response_code || 403 === $response_code ) {
			// Authentication failed.
			wp_send_json_error(
				array( 'message' => __( 'Invalid API key. Please check your credentials.', 'dashdig-analytics' ) )
			);
		} else {
			// Other error.
			$response_data = json_decode( $response_body, true );
			$error_message = isset( $response_data['message'] ) ? $response_data['message'] : __( 'Unknown error occurred.', 'dashdig-analytics' );
			
			wp_send_json_error(
				array(
					'message' => sprintf(
						/* translators: 1: HTTP response code, 2: error message */
						__( 'Server returned error (code %1$d): %2$s', 'dashdig-analytics' ),
						$response_code,
						$error_message
					),
				)
			);
		}
	}
}


