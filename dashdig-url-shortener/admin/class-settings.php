<?php
/**
 * The settings class.
 *
 * Handles all admin settings and configuration.
 *
 * @package    Dashdig_URL_Shortener
 * @subpackage Dashdig_URL_Shortener/admin
 * @since      1.0.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The settings class.
 *
 * @since 1.0.0
 */
class Dashdig_Settings {

	/**
	 * API client instance.
	 *
	 * @since  1.0.0
	 * @access private
	 * @var    Dashdig_API_Client $api_client The API client.
	 */
	private $api_client;

	/**
	 * Initialize the class.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->api_client = new Dashdig_API_Client();

		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		add_action( 'admin_notices', array( $this, 'display_admin_notices' ) );

		// Register REST API endpoint for shortening URLs.
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );

		// Add settings link to plugin page.
		add_filter( 'plugin_action_links_' . DASHDIG_BASENAME, array( $this, 'add_settings_link' ) );

		// Add bulk shortening tool.
		add_action( 'admin_menu', array( $this, 'add_tools_page' ) );
		add_action( 'admin_post_dashdig_bulk_shorten', array( $this, 'handle_bulk_shorten' ) );
	}

	/**
	 * Add admin menu pages.
	 *
	 * @since 1.0.0
	 */
	public function add_admin_menu() {
		// Add main settings page.
		add_submenu_page(
			'edit.php?post_type=dashdig_link',
			__( 'DashDig Settings', 'dashdig-url-shortener' ),
			__( 'Settings', 'dashdig-url-shortener' ),
			'manage_options',
			'dashdig-settings',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Add tools page for bulk shortening.
	 *
	 * @since 1.0.0
	 */
	public function add_tools_page() {
		add_submenu_page(
			'edit.php?post_type=dashdig_link',
			__( 'Bulk Shorten URLs', 'dashdig-url-shortener' ),
			__( 'Bulk Tools', 'dashdig-url-shortener' ),
			'manage_options',
			'dashdig-bulk-tools',
			array( $this, 'render_bulk_tools_page' )
		);
	}

	/**
	 * Register plugin settings.
	 *
	 * @since 1.0.0
	 */
	public function register_settings() {
		// Register settings.
		register_setting(
			'dashdig_settings',
			'dashdig_api_key',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
			)
		);

		register_setting(
			'dashdig_settings',
			'dashdig_api_endpoint',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'esc_url_raw',
				'default'           => DASHDIG_API_ENDPOINT,
			)
		);

		register_setting(
			'dashdig_settings',
			'dashdig_custom_domain',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
			)
		);

		register_setting(
			'dashdig_settings',
			'dashdig_default_expiration',
			array(
				'type'              => 'integer',
				'sanitize_callback' => 'absint',
				'default'           => 0,
			)
		);

		// Add settings sections.
		add_settings_section(
			'dashdig_api_section',
			__( 'API Configuration', 'dashdig-url-shortener' ),
			array( $this, 'render_api_section' ),
			'dashdig_settings'
		);

		add_settings_section(
			'dashdig_general_section',
			__( 'General Settings', 'dashdig-url-shortener' ),
			array( $this, 'render_general_section' ),
			'dashdig_settings'
		);

		// Add settings fields.
		add_settings_field(
			'dashdig_api_key',
			__( 'API Key', 'dashdig-url-shortener' ),
			array( $this, 'render_api_key_field' ),
			'dashdig_settings',
			'dashdig_api_section'
		);

		add_settings_field(
			'dashdig_api_endpoint',
			__( 'API Endpoint', 'dashdig-url-shortener' ),
			array( $this, 'render_api_endpoint_field' ),
			'dashdig_settings',
			'dashdig_api_section'
		);

		add_settings_field(
			'dashdig_custom_domain',
			__( 'Custom Domain', 'dashdig-url-shortener' ),
			array( $this, 'render_custom_domain_field' ),
			'dashdig_settings',
			'dashdig_general_section'
		);

		add_settings_field(
			'dashdig_default_expiration',
			__( 'Default Expiration', 'dashdig-url-shortener' ),
			array( $this, 'render_default_expiration_field' ),
			'dashdig_settings',
			'dashdig_general_section'
		);
	}

	/**
	 * Render API section description.
	 *
	 * @since 1.0.0
	 */
	public function render_api_section() {
		echo '<p>' . esc_html__( 'Configure your DashDig API credentials. Get your API key from', 'dashdig-url-shortener' ) . ' <a href="https://dashdig.com/dashboard" target="_blank">' . esc_html__( 'DashDig Dashboard', 'dashdig-url-shortener' ) . '</a>.</p>';
	}

	/**
	 * Render general section description.
	 *
	 * @since 1.0.0
	 */
	public function render_general_section() {
		echo '<p>' . esc_html__( 'Configure default settings for URL shortening.', 'dashdig-url-shortener' ) . '</p>';
	}

	/**
	 * Render API key field.
	 *
	 * @since 1.0.0
	 */
	public function render_api_key_field() {
		$api_key = get_option( 'dashdig_api_key', '' );
		?>
		<input type="password" id="dashdig_api_key" name="dashdig_api_key" value="<?php echo esc_attr( $api_key ); ?>" class="regular-text" />
		<button type="button" class="button" id="dashdig-toggle-api-key">
			<?php esc_html_e( 'Show', 'dashdig-url-shortener' ); ?>
		</button>
		<p class="description">
			<?php esc_html_e( 'Your DashDig API key for authentication.', 'dashdig-url-shortener' ); ?>
		</p>
		<?php
	}

	/**
	 * Render API endpoint field.
	 *
	 * @since 1.0.0
	 */
	public function render_api_endpoint_field() {
		$api_endpoint = get_option( 'dashdig_api_endpoint', DASHDIG_API_ENDPOINT );
		?>
		<input type="url" id="dashdig_api_endpoint" name="dashdig_api_endpoint" value="<?php echo esc_url( $api_endpoint ); ?>" class="regular-text" />
		<p class="description">
			<?php esc_html_e( 'API endpoint URL (leave default unless using custom deployment).', 'dashdig-url-shortener' ); ?>
		</p>
		<?php
	}

	/**
	 * Render custom domain field.
	 *
	 * @since 1.0.0
	 */
	public function render_custom_domain_field() {
		$custom_domain = get_option( 'dashdig_custom_domain', '' );
		?>
		<input type="text" id="dashdig_custom_domain" name="dashdig_custom_domain" value="<?php echo esc_attr( $custom_domain ); ?>" class="regular-text" placeholder="yourdomain.com" />
		<p class="description">
			<?php esc_html_e( 'Optional custom domain for shortened URLs (requires configuration in DashDig dashboard).', 'dashdig-url-shortener' ); ?>
		</p>
		<?php
	}

	/**
	 * Render default expiration field.
	 *
	 * @since 1.0.0
	 */
	public function render_default_expiration_field() {
		$default_expiration = get_option( 'dashdig_default_expiration', 0 );
		?>
		<select id="dashdig_default_expiration" name="dashdig_default_expiration">
			<option value="0" <?php selected( $default_expiration, 0 ); ?>><?php esc_html_e( 'Never expire', 'dashdig-url-shortener' ); ?></option>
			<option value="1" <?php selected( $default_expiration, 1 ); ?>><?php esc_html_e( '1 day', 'dashdig-url-shortener' ); ?></option>
			<option value="7" <?php selected( $default_expiration, 7 ); ?>><?php esc_html_e( '7 days', 'dashdig-url-shortener' ); ?></option>
			<option value="30" <?php selected( $default_expiration, 30 ); ?>><?php esc_html_e( '30 days', 'dashdig-url-shortener' ); ?></option>
			<option value="90" <?php selected( $default_expiration, 90 ); ?>><?php esc_html_e( '90 days', 'dashdig-url-shortener' ); ?></option>
			<option value="365" <?php selected( $default_expiration, 365 ); ?>><?php esc_html_e( '1 year', 'dashdig-url-shortener' ); ?></option>
		</select>
		<p class="description">
			<?php esc_html_e( 'Default expiration time for new shortened URLs.', 'dashdig-url-shortener' ); ?>
		</p>
		<?php
	}

	/**
	 * Render settings page.
	 *
	 * @since 1.0.0
	 */
	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Check if settings were saved.
		if ( isset( $_GET['settings-updated'] ) ) {
			// Verify API key.
			$api_key = get_option( 'dashdig_api_key' );
			if ( ! empty( $api_key ) ) {
				$verification = $this->api_client->verify_api_key();
				if ( is_wp_error( $verification ) ) {
					add_settings_error(
						'dashdig_messages',
						'dashdig_api_key_invalid',
						sprintf(
							/* translators: %s: error message */
							__( 'API key verification failed: %s', 'dashdig-url-shortener' ),
							$verification->get_error_message()
						),
						'error'
					);
				} else {
					add_settings_error(
						'dashdig_messages',
						'dashdig_message',
						__( 'Settings saved and API key verified successfully!', 'dashdig-url-shortener' ),
						'success'
					);
				}
			}
		}

		require_once DASHDIG_PLUGIN_DIR . 'admin/views/settings.php';
	}

	/**
	 * Render bulk tools page.
	 *
	 * @since 1.0.0
	 */
	public function render_bulk_tools_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		require_once DASHDIG_PLUGIN_DIR . 'admin/views/bulk-tools.php';
	}

	/**
	 * Handle bulk shortening.
	 *
	 * @since 1.0.0
	 */
	public function handle_bulk_shorten() {
		// Check user permissions.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'dashdig-url-shortener' ) );
		}

		// Verify nonce.
		if ( ! isset( $_POST['dashdig_bulk_shorten_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['dashdig_bulk_shorten_nonce'] ) ), 'dashdig_bulk_shorten' ) ) {
			wp_die( esc_html__( 'Security check failed.', 'dashdig-url-shortener' ) );
		}

		$post_types = isset( $_POST['post_types'] ) ? array_map( 'sanitize_text_field', wp_unslash( $_POST['post_types'] ) ) : array( 'post' );
		$limit      = isset( $_POST['limit'] ) ? absint( $_POST['limit'] ) : 50;

		$shortened_count = 0;
		$error_count     = 0;

		// Get posts.
		$args = array(
			'post_type'      => $post_types,
			'posts_per_page' => $limit,
			'post_status'    => 'publish',
		);

		$posts = get_posts( $args );

		foreach ( $posts as $post ) {
			// Extract URLs from post content.
			$urls = $this->extract_urls_from_content( $post->post_content );

			foreach ( $urls as $url ) {
				// Skip if already shortened.
				$existing = get_posts(
					array(
						'post_type'      => 'dashdig_link',
						'meta_key'       => '_dashdig_long_url',
						'meta_value'     => $url,
						'posts_per_page' => 1,
					)
				);

				if ( ! empty( $existing ) ) {
					continue;
				}

				// Shorten URL.
				$result = $this->api_client->shorten_url( $url );

				if ( is_wp_error( $result ) ) {
					++$error_count;
					continue;
				}

				// Create post to track this URL.
				$link_post_id = wp_insert_post(
					array(
						'post_type'   => 'dashdig_link',
						'post_title'  => sprintf(
							/* translators: %s: post title */
							__( 'From: %s', 'dashdig-url-shortener' ),
							$post->post_title
						),
						'post_status' => 'publish',
					)
				);

				if ( ! is_wp_error( $link_post_id ) && $link_post_id > 0 ) {
					update_post_meta( $link_post_id, '_dashdig_long_url', $url );
					update_post_meta( $link_post_id, '_dashdig_short_url', sanitize_text_field( $result['shortUrl'] ) );
					update_post_meta( $link_post_id, '_dashdig_short_code', sanitize_text_field( $result['shortCode'] ) );
					update_post_meta( $link_post_id, '_dashdig_source_post', $post->ID );
					++$shortened_count;
				}
			}
		}

		// Redirect with results.
		$redirect_url = add_query_arg(
			array(
				'page'            => 'dashdig-bulk-tools',
				'shortened_count' => $shortened_count,
				'error_count'     => $error_count,
			),
			admin_url( 'edit.php?post_type=dashdig_link' )
		);

		wp_safe_redirect( $redirect_url );
		exit;
	}

	/**
	 * Extract URLs from content.
	 *
	 * @since  1.0.0
	 * @access private
	 * @param  string $content The content to extract URLs from.
	 * @return array Array of URLs.
	 */
	private function extract_urls_from_content( $content ) {
		$urls = array();

		// Remove shortcodes.
		$content = strip_shortcodes( $content );

		// Extract URLs.
		preg_match_all( '#\bhttps?://[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|/))#', $content, $matches );

		if ( ! empty( $matches[0] ) ) {
			$urls = array_unique( $matches[0] );
		}

		return $urls;
	}

	/**
	 * Register REST API routes.
	 *
	 * @since 1.0.0
	 */
	public function register_rest_routes() {
		register_rest_route(
			'dashdig/v1',
			'/shorten',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_shorten_url' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	/**
	 * REST API endpoint for shortening URLs.
	 *
	 * @since 1.0.0
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error The response.
	 */
	public function rest_shorten_url( $request ) {
		$url = $request->get_param( 'url' );

		if ( empty( $url ) ) {
			return new WP_Error( 'empty_url', __( 'URL is required.', 'dashdig-url-shortener' ), array( 'status' => 400 ) );
		}

		$result = $this->api_client->shorten_url( $url );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return new WP_REST_Response( $result, 200 );
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @since 1.0.0
	 * @param string $hook The current admin page.
	 */
	public function enqueue_admin_assets( $hook ) {
		// Enqueue on plugin pages.
		if ( strpos( $hook, 'dashdig' ) !== false || get_post_type() === 'dashdig_link' ) {
			wp_enqueue_style(
				'dashdig-admin',
				DASHDIG_PLUGIN_URL . 'assets/css/admin.css',
				array(),
				DASHDIG_VERSION
			);

			wp_enqueue_script(
				'dashdig-admin',
				DASHDIG_PLUGIN_URL . 'assets/js/admin.js',
				array( 'jquery' ),
				DASHDIG_VERSION,
				true
			);

			wp_localize_script(
				'dashdig-admin',
				'dashdigAdmin',
				array(
					'ajaxUrl' => admin_url( 'admin-ajax.php' ),
					'nonce'   => wp_create_nonce( 'dashdig_admin' ),
					'strings' => array(
						'copied'       => __( 'Copied!', 'dashdig-url-shortener' ),
						'copyFailed'   => __( 'Copy failed', 'dashdig-url-shortener' ),
						'confirmDelete' => __( 'Are you sure you want to delete this shortened URL?', 'dashdig-url-shortener' ),
					),
				)
			);
		}
	}

	/**
	 * Display admin notices.
	 *
	 * @since 1.0.0
	 */
	public function display_admin_notices() {
		// Check if API key is configured.
		$api_key = get_option( 'dashdig_api_key' );

		if ( empty( $api_key ) && ( isset( $_GET['post_type'] ) && 'dashdig_link' === $_GET['post_type'] ) ) {
			?>
			<div class="notice notice-warning is-dismissible">
				<p>
					<?php
					printf(
						/* translators: %s: settings page URL */
						__( 'DashDig URL Shortener: Please <a href="%s">configure your API key</a> to start shortening URLs.', 'dashdig-url-shortener' ),
						esc_url( admin_url( 'edit.php?post_type=dashdig_link&page=dashdig-settings' ) )
					);
					?>
				</p>
			</div>
			<?php
		}

		// Display bulk shorten results.
		if ( isset( $_GET['shortened_count'] ) ) {
			$shortened_count = absint( $_GET['shortened_count'] );
			$error_count     = isset( $_GET['error_count'] ) ? absint( $_GET['error_count'] ) : 0;
			?>
			<div class="notice notice-success is-dismissible">
				<p>
					<?php
					printf(
						/* translators: 1: number of shortened URLs, 2: number of errors */
						esc_html( _n( 'Successfully shortened %1$d URL.', 'Successfully shortened %1$d URLs.', $shortened_count, 'dashdig-url-shortener' ) ),
						$shortened_count
					);

					if ( $error_count > 0 ) {
						echo ' ';
						printf(
							/* translators: %d: number of errors */
							esc_html( _n( '%d error occurred.', '%d errors occurred.', $error_count, 'dashdig-url-shortener' ) ),
							$error_count
						);
					}
					?>
				</p>
			</div>
			<?php
		}
	}

	/**
	 * Add settings link to plugin page.
	 *
	 * @since 1.0.0
	 * @param array $links Plugin action links.
	 * @return array Modified plugin action links.
	 */
	public function add_settings_link( $links ) {
		$settings_link = '<a href="' . esc_url( admin_url( 'edit.php?post_type=dashdig_link&page=dashdig-settings' ) ) . '">' . __( 'Settings', 'dashdig-url-shortener' ) . '</a>';
		array_unshift( $links, $settings_link );
		return $links;
	}
}

