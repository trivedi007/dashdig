<?php
/**
 * The core shortener class.
 *
 * Handles URL shortening, custom post type, and shortcodes.
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
 * The core shortener class.
 *
 * @since 1.0.0
 */
class Dashdig_Shortener {

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

		// Register custom post type.
		add_action( 'init', array( $this, 'register_post_type' ) );

		// Register shortcodes.
		add_shortcode( 'dashdig', array( $this, 'shortcode_handler' ) );

		// Add meta boxes.
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'save_post_dashdig_link', array( $this, 'save_meta_box_data' ) );

		// Add custom columns.
		add_filter( 'manage_dashdig_link_posts_columns', array( $this, 'add_custom_columns' ) );
		add_action( 'manage_dashdig_link_posts_custom_column', array( $this, 'render_custom_columns' ), 10, 2 );

		// Make columns sortable.
		add_filter( 'manage_edit-dashdig_link_sortable_columns', array( $this, 'make_columns_sortable' ) );

		// Add bulk actions.
		add_filter( 'bulk_actions-edit-dashdig_link', array( $this, 'add_bulk_actions' ) );
		add_filter( 'handle_bulk_actions-edit-dashdig_link', array( $this, 'handle_bulk_actions' ), 10, 3 );
	}

	/**
	 * Register custom post type for shortened URLs.
	 *
	 * @since 1.0.0
	 */
	public function register_post_type() {
		$labels = array(
			'name'                  => _x( 'Shortened Links', 'Post type general name', 'dashdig-url-shortener' ),
			'singular_name'         => _x( 'Shortened Link', 'Post type singular name', 'dashdig-url-shortener' ),
			'menu_name'             => _x( 'DashDig Links', 'Admin Menu text', 'dashdig-url-shortener' ),
			'name_admin_bar'        => _x( 'Shortened Link', 'Add New on Toolbar', 'dashdig-url-shortener' ),
			'add_new'               => __( 'Add New', 'dashdig-url-shortener' ),
			'add_new_item'          => __( 'Add New Shortened Link', 'dashdig-url-shortener' ),
			'new_item'              => __( 'New Shortened Link', 'dashdig-url-shortener' ),
			'edit_item'             => __( 'Edit Shortened Link', 'dashdig-url-shortener' ),
			'view_item'             => __( 'View Shortened Link', 'dashdig-url-shortener' ),
			'all_items'             => __( 'All Links', 'dashdig-url-shortener' ),
			'search_items'          => __( 'Search Shortened Links', 'dashdig-url-shortener' ),
			'parent_item_colon'     => __( 'Parent Shortened Links:', 'dashdig-url-shortener' ),
			'not_found'             => __( 'No shortened links found.', 'dashdig-url-shortener' ),
			'not_found_in_trash'    => __( 'No shortened links found in Trash.', 'dashdig-url-shortener' ),
			'featured_image'        => _x( 'Link Preview Image', 'Overrides the "Featured Image" phrase', 'dashdig-url-shortener' ),
			'set_featured_image'    => _x( 'Set link preview image', 'Overrides the "Set featured image" phrase', 'dashdig-url-shortener' ),
			'remove_featured_image' => _x( 'Remove link preview image', 'Overrides the "Remove featured image" phrase', 'dashdig-url-shortener' ),
			'use_featured_image'    => _x( 'Use as link preview image', 'Overrides the "Use as featured image" phrase', 'dashdig-url-shortener' ),
			'archives'              => _x( 'Link archives', 'The post type archive label used in nav menus', 'dashdig-url-shortener' ),
			'insert_into_item'      => _x( 'Insert into link', 'Overrides the "Insert into post"/"Insert into page" phrase', 'dashdig-url-shortener' ),
			'uploaded_to_this_item' => _x( 'Uploaded to this link', 'Overrides the "Uploaded to this post"/"Uploaded to this page" phrase', 'dashdig-url-shortener' ),
			'filter_items_list'     => _x( 'Filter links list', 'Screen reader text for the filter links heading', 'dashdig-url-shortener' ),
			'items_list_navigation' => _x( 'Links list navigation', 'Screen reader text for the pagination heading', 'dashdig-url-shortener' ),
			'items_list'            => _x( 'Links list', 'Screen reader text for the items list heading', 'dashdig-url-shortener' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => 25,
			'menu_icon'          => 'dashicons-admin-links',
			'supports'           => array( 'title' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'dashdig_link', $args );
	}

	/**
	 * Add meta boxes.
	 *
	 * @since 1.0.0
	 */
	public function add_meta_boxes() {
		add_meta_box(
			'dashdig_link_details',
			__( 'Link Details', 'dashdig-url-shortener' ),
			array( $this, 'render_link_details_meta_box' ),
			'dashdig_link',
			'normal',
			'high'
		);

		add_meta_box(
			'dashdig_link_analytics',
			__( 'Analytics', 'dashdig-url-shortener' ),
			array( $this, 'render_analytics_meta_box' ),
			'dashdig_link',
			'side',
			'default'
		);
	}

	/**
	 * Render link details meta box.
	 *
	 * @since 1.0.0
	 * @param WP_Post $post The post object.
	 */
	public function render_link_details_meta_box( $post ) {
		// Add nonce for security.
		wp_nonce_field( 'dashdig_save_link_details', 'dashdig_link_details_nonce' );

		// Get existing values.
		$long_url    = get_post_meta( $post->ID, '_dashdig_long_url', true );
		$short_url   = get_post_meta( $post->ID, '_dashdig_short_url', true );
		$short_code  = get_post_meta( $post->ID, '_dashdig_short_code', true );
		$custom_slug = get_post_meta( $post->ID, '_dashdig_custom_slug', true );
		$expires_at  = get_post_meta( $post->ID, '_dashdig_expires_at', true );
		$password    = get_post_meta( $post->ID, '_dashdig_password', true );
		?>
		<table class="form-table">
			<tr>
				<th scope="row">
					<label for="dashdig_long_url"><?php esc_html_e( 'Long URL', 'dashdig-url-shortener' ); ?> <span class="required">*</span></label>
				</th>
				<td>
					<input type="url" id="dashdig_long_url" name="dashdig_long_url" value="<?php echo esc_url( $long_url ); ?>" class="large-text" required />
					<p class="description"><?php esc_html_e( 'The original URL you want to shorten.', 'dashdig-url-shortener' ); ?></p>
				</td>
			</tr>

			<?php if ( $short_url ) : ?>
				<tr>
					<th scope="row">
						<label><?php esc_html_e( 'Shortened URL', 'dashdig-url-shortener' ); ?></label>
					</th>
					<td>
						<input type="text" value="<?php echo esc_url( $short_url ); ?>" class="large-text" readonly />
						<button type="button" class="button dashdig-copy-btn" data-url="<?php echo esc_url( $short_url ); ?>">
							<?php esc_html_e( 'Copy', 'dashdig-url-shortener' ); ?>
						</button>
						<p class="description"><?php esc_html_e( 'Your shortened URL (read-only).', 'dashdig-url-shortener' ); ?></p>
					</td>
				</tr>
			<?php endif; ?>

			<tr>
				<th scope="row">
					<label for="dashdig_custom_slug"><?php esc_html_e( 'Custom Slug', 'dashdig-url-shortener' ); ?></label>
				</th>
				<td>
					<input type="text" id="dashdig_custom_slug" name="dashdig_custom_slug" value="<?php echo esc_attr( $custom_slug ); ?>" class="regular-text" />
					<p class="description"><?php esc_html_e( 'Optional custom slug (e.g., "my-link").', 'dashdig-url-shortener' ); ?></p>
				</td>
			</tr>

			<tr>
				<th scope="row">
					<label for="dashdig_expires_at"><?php esc_html_e( 'Expiration Date', 'dashdig-url-shortener' ); ?></label>
				</th>
				<td>
					<input type="datetime-local" id="dashdig_expires_at" name="dashdig_expires_at" value="<?php echo esc_attr( $expires_at ); ?>" />
					<p class="description"><?php esc_html_e( 'Optional expiration date for this link.', 'dashdig-url-shortener' ); ?></p>
				</td>
			</tr>

			<tr>
				<th scope="row">
					<label for="dashdig_password"><?php esc_html_e( 'Password Protection', 'dashdig-url-shortener' ); ?></label>
				</th>
				<td>
					<input type="text" id="dashdig_password" name="dashdig_password" value="<?php echo esc_attr( $password ); ?>" class="regular-text" />
					<p class="description"><?php esc_html_e( 'Optional password to protect this link.', 'dashdig-url-shortener' ); ?></p>
				</td>
			</tr>
		</table>
		<?php
	}

	/**
	 * Render analytics meta box.
	 *
	 * @since 1.0.0
	 * @param WP_Post $post The post object.
	 */
	public function render_analytics_meta_box( $post ) {
		$short_code = get_post_meta( $post->ID, '_dashdig_short_code', true );

		if ( ! $short_code ) {
			echo '<p>' . esc_html__( 'Analytics will be available after the link is created.', 'dashdig-url-shortener' ) . '</p>';
			return;
		}

		$analytics = $this->api_client->get_url_analytics( $short_code );

		if ( is_wp_error( $analytics ) ) {
			echo '<p class="error">' . esc_html( $analytics->get_error_message() ) . '</p>';
			return;
		}

		$clicks = isset( $analytics['clicks'] ) ? intval( $analytics['clicks'] ) : 0;
		?>
		<div class="dashdig-analytics-summary">
			<p><strong><?php esc_html_e( 'Total Clicks:', 'dashdig-url-shortener' ); ?></strong> <?php echo esc_html( number_format_i18n( $clicks ) ); ?></p>
			<p>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=dashdig-analytics&link=' . $short_code ) ); ?>" class="button">
					<?php esc_html_e( 'View Detailed Analytics', 'dashdig-url-shortener' ); ?>
				</a>
			</p>
		</div>
		<?php
	}

	/**
	 * Save meta box data.
	 *
	 * @since 1.0.0
	 * @param int $post_id The post ID.
	 */
	public function save_meta_box_data( $post_id ) {
		// Check if nonce is set.
		if ( ! isset( $_POST['dashdig_link_details_nonce'] ) ) {
			return;
		}

		// Verify nonce.
		if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['dashdig_link_details_nonce'] ) ), 'dashdig_save_link_details' ) ) {
			return;
		}

		// Check if autosave.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Check user permissions.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		// Get long URL.
		if ( ! isset( $_POST['dashdig_long_url'] ) || empty( $_POST['dashdig_long_url'] ) ) {
			return;
		}

		$long_url = esc_url_raw( wp_unslash( $_POST['dashdig_long_url'] ) );

		// Check if we need to create or update the short URL.
		$short_code = get_post_meta( $post_id, '_dashdig_short_code', true );

		// Prepare API arguments.
		$args = array();

		if ( isset( $_POST['dashdig_custom_slug'] ) && ! empty( $_POST['dashdig_custom_slug'] ) ) {
			$args['customSlug'] = sanitize_text_field( wp_unslash( $_POST['dashdig_custom_slug'] ) );
		}

		if ( isset( $_POST['dashdig_expires_at'] ) && ! empty( $_POST['dashdig_expires_at'] ) ) {
			$args['expiresAt'] = sanitize_text_field( wp_unslash( $_POST['dashdig_expires_at'] ) );
		}

		if ( isset( $_POST['dashdig_password'] ) && ! empty( $_POST['dashdig_password'] ) ) {
			$args['password'] = sanitize_text_field( wp_unslash( $_POST['dashdig_password'] ) );
		}

		// If no short code exists, create new shortened URL.
		if ( ! $short_code ) {
			$result = $this->api_client->shorten_url( $long_url, $args );

			if ( is_wp_error( $result ) ) {
				// Store error for display.
				set_transient( 'dashdig_error_' . $post_id, $result->get_error_message(), 30 );
				return;
			}

			// Save the shortened URL data.
			update_post_meta( $post_id, '_dashdig_long_url', $long_url );
			update_post_meta( $post_id, '_dashdig_short_url', sanitize_text_field( $result['shortUrl'] ) );
			update_post_meta( $post_id, '_dashdig_short_code', sanitize_text_field( $result['shortCode'] ) );
		} else {
			// Update existing URL.
			update_post_meta( $post_id, '_dashdig_long_url', $long_url );
		}

		// Save optional meta fields.
		if ( isset( $_POST['dashdig_custom_slug'] ) ) {
			update_post_meta( $post_id, '_dashdig_custom_slug', sanitize_text_field( wp_unslash( $_POST['dashdig_custom_slug'] ) ) );
		}

		if ( isset( $_POST['dashdig_expires_at'] ) ) {
			update_post_meta( $post_id, '_dashdig_expires_at', sanitize_text_field( wp_unslash( $_POST['dashdig_expires_at'] ) ) );
		}

		if ( isset( $_POST['dashdig_password'] ) ) {
			update_post_meta( $post_id, '_dashdig_password', sanitize_text_field( wp_unslash( $_POST['dashdig_password'] ) ) );
		}
	}

	/**
	 * Add custom columns to post list.
	 *
	 * @since 1.0.0
	 * @param array $columns The columns.
	 * @return array Modified columns.
	 */
	public function add_custom_columns( $columns ) {
		$new_columns = array();

		foreach ( $columns as $key => $value ) {
			$new_columns[ $key ] = $value;

			if ( 'title' === $key ) {
				$new_columns['short_url'] = __( 'Short URL', 'dashdig-url-shortener' );
				$new_columns['long_url']  = __( 'Original URL', 'dashdig-url-shortener' );
				$new_columns['clicks']    = __( 'Clicks', 'dashdig-url-shortener' );
			}
		}

		return $new_columns;
	}

	/**
	 * Render custom column content.
	 *
	 * @since 1.0.0
	 * @param string $column The column name.
	 * @param int    $post_id The post ID.
	 */
	public function render_custom_columns( $column, $post_id ) {
		switch ( $column ) {
			case 'short_url':
				$short_url = get_post_meta( $post_id, '_dashdig_short_url', true );
				if ( $short_url ) {
					echo '<a href="' . esc_url( $short_url ) . '" target="_blank">' . esc_html( $short_url ) . '</a>';
					echo '<br><button type="button" class="button-small dashdig-copy-btn" data-url="' . esc_url( $short_url ) . '">' . esc_html__( 'Copy', 'dashdig-url-shortener' ) . '</button>';
				} else {
					echo '—';
				}
				break;

			case 'long_url':
				$long_url = get_post_meta( $post_id, '_dashdig_long_url', true );
				if ( $long_url ) {
					echo '<a href="' . esc_url( $long_url ) . '" target="_blank" title="' . esc_attr( $long_url ) . '">' . esc_html( wp_trim_words( $long_url, 10, '...' ) ) . '</a>';
				} else {
					echo '—';
				}
				break;

			case 'clicks':
				$short_code = get_post_meta( $post_id, '_dashdig_short_code', true );
				if ( $short_code ) {
					// Get cached analytics or fetch fresh.
					$cache_key = 'dashdig_clicks_' . $short_code;
					$clicks    = get_transient( $cache_key );

					if ( false === $clicks ) {
						$analytics = $this->api_client->get_url_analytics( $short_code );
						$clicks    = is_wp_error( $analytics ) ? 0 : ( isset( $analytics['clicks'] ) ? intval( $analytics['clicks'] ) : 0 );
						set_transient( $cache_key, $clicks, 5 * MINUTE_IN_SECONDS );
					}

					echo esc_html( number_format_i18n( $clicks ) );
				} else {
					echo '0';
				}
				break;
		}
	}

	/**
	 * Make columns sortable.
	 *
	 * @since 1.0.0
	 * @param array $columns The sortable columns.
	 * @return array Modified sortable columns.
	 */
	public function make_columns_sortable( $columns ) {
		$columns['clicks'] = 'clicks';
		return $columns;
	}

	/**
	 * Add custom bulk actions.
	 *
	 * @since 1.0.0
	 * @param array $actions The bulk actions.
	 * @return array Modified bulk actions.
	 */
	public function add_bulk_actions( $actions ) {
		$actions['dashdig_refresh_analytics'] = __( 'Refresh Analytics', 'dashdig-url-shortener' );
		return $actions;
	}

	/**
	 * Handle custom bulk actions.
	 *
	 * @since 1.0.0
	 * @param string $redirect_to The redirect URL.
	 * @param string $action The action being taken.
	 * @param array  $post_ids The post IDs to take the action on.
	 * @return string The redirect URL.
	 */
	public function handle_bulk_actions( $redirect_to, $action, $post_ids ) {
		if ( 'dashdig_refresh_analytics' !== $action ) {
			return $redirect_to;
		}

		foreach ( $post_ids as $post_id ) {
			$short_code = get_post_meta( $post_id, '_dashdig_short_code', true );
			if ( $short_code ) {
				delete_transient( 'dashdig_clicks_' . $short_code );
			}
		}

		$redirect_to = add_query_arg( 'bulk_refreshed_analytics', count( $post_ids ), $redirect_to );
		return $redirect_to;
	}

	/**
	 * Handle shortcode.
	 *
	 * @since 1.0.0
	 * @param array  $atts Shortcode attributes.
	 * @param string $content Shortcode content.
	 * @return string The shortcode output.
	 */
	public function shortcode_handler( $atts, $content = null ) {
		$atts = shortcode_atts(
			array(
				'url'  => '',
				'text' => '',
			),
			$atts,
			'dashdig'
		);

		if ( empty( $atts['url'] ) ) {
			return '';
		}

		// Check if URL is already shortened.
		$short_url = $this->get_or_create_short_url( $atts['url'] );

		if ( is_wp_error( $short_url ) ) {
			return '<!-- DashDig Error: ' . esc_html( $short_url->get_error_message() ) . ' -->';
		}

		// Determine link text.
		$link_text = ! empty( $atts['text'] ) ? $atts['text'] : $short_url;

		return sprintf(
			'<a href="%s" target="_blank" rel="noopener noreferrer" class="dashdig-short-link">%s</a>',
			esc_url( $short_url ),
			esc_html( $link_text )
		);
	}

	/**
	 * Get or create shortened URL.
	 *
	 * @since 1.0.0
	 * @param string $long_url The long URL.
	 * @return string|WP_Error The short URL or error.
	 */
	private function get_or_create_short_url( $long_url ) {
		// Check if we already have this URL shortened.
		$existing = get_posts(
			array(
				'post_type'      => 'dashdig_link',
				'meta_key'       => '_dashdig_long_url',
				'meta_value'     => $long_url,
				'posts_per_page' => 1,
				'post_status'    => 'any',
			)
		);

		if ( ! empty( $existing ) ) {
			$short_url = get_post_meta( $existing[0]->ID, '_dashdig_short_url', true );
			if ( $short_url ) {
				return $short_url;
			}
		}

		// Create new shortened URL.
		$result = $this->api_client->shorten_url( $long_url );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		// Create post to track this URL.
		$post_id = wp_insert_post(
			array(
				'post_type'   => 'dashdig_link',
				'post_title'  => wp_trim_words( $long_url, 10 ),
				'post_status' => 'publish',
			)
		);

		if ( ! is_wp_error( $post_id ) && $post_id > 0 ) {
			update_post_meta( $post_id, '_dashdig_long_url', $long_url );
			update_post_meta( $post_id, '_dashdig_short_url', sanitize_text_field( $result['shortUrl'] ) );
			update_post_meta( $post_id, '_dashdig_short_code', sanitize_text_field( $result['shortCode'] ) );
		}

		return $result['shortUrl'];
	}

	/**
	 * Plugin activation.
	 *
	 * @since 1.0.0
	 */
	public static function activate() {
		// Trigger post type registration.
		$shortener = new self();
		$shortener->register_post_type();

		// Flush rewrite rules.
		flush_rewrite_rules();
	}

	/**
	 * Plugin deactivation.
	 *
	 * @since 1.0.0
	 */
	public static function deactivate() {
		// Flush rewrite rules.
		flush_rewrite_rules();
	}
}

