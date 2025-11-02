<?php
/**
 * The analytics class.
 *
 * Handles analytics dashboard widget and reporting.
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
 * The analytics class.
 *
 * @since 1.0.0
 */
class Dashdig_Analytics {

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

		add_action( 'wp_dashboard_setup', array( $this, 'add_dashboard_widget' ) );
		add_action( 'admin_menu', array( $this, 'add_analytics_page' ) );
	}

	/**
	 * Add dashboard widget.
	 *
	 * @since 1.0.0
	 */
	public function add_dashboard_widget() {
		wp_add_dashboard_widget(
			'dashdig_analytics_widget',
			__( 'DashDig URL Shortener - Analytics', 'dashdig-url-shortener' ),
			array( $this, 'render_dashboard_widget' )
		);
	}

	/**
	 * Add analytics page.
	 *
	 * @since 1.0.0
	 */
	public function add_analytics_page() {
		add_submenu_page(
			'edit.php?post_type=dashdig_link',
			__( 'Analytics', 'dashdig-url-shortener' ),
			__( 'Analytics', 'dashdig-url-shortener' ),
			'manage_options',
			'dashdig-analytics',
			array( $this, 'render_analytics_page' )
		);
	}

	/**
	 * Render dashboard widget.
	 *
	 * @since 1.0.0
	 */
	public function render_dashboard_widget() {
		$api_key = get_option( 'dashdig_api_key' );

		if ( empty( $api_key ) ) {
			?>
			<p>
				<?php
				printf(
					/* translators: %s: settings page URL */
					__( 'Please <a href="%s">configure your API key</a> to view analytics.', 'dashdig-url-shortener' ),
					esc_url( admin_url( 'edit.php?post_type=dashdig_link&page=dashdig-settings' ) )
				);
				?>
			</p>
			<?php
			return;
		}

		// Get statistics from cache or API.
		$cache_key = 'dashdig_dashboard_stats';
		$stats     = get_transient( $cache_key );

		if ( false === $stats ) {
			$stats = $this->api_client->get_statistics();

			if ( ! is_wp_error( $stats ) ) {
				set_transient( $cache_key, $stats, 5 * MINUTE_IN_SECONDS );
			}
		}

		if ( is_wp_error( $stats ) ) {
			?>
			<p class="dashdig-error">
				<?php
				printf(
					/* translators: %s: error message */
					__( 'Error loading analytics: %s', 'dashdig-url-shortener' ),
					esc_html( $stats->get_error_message() )
				);
				?>
			</p>
			<?php
			return;
		}

		// Get local link count.
		$link_count = wp_count_posts( 'dashdig_link' );
		$total_links = isset( $link_count->publish ) ? intval( $link_count->publish ) : 0;

		// Extract statistics.
		$total_clicks = isset( $stats['totalClicks'] ) ? intval( $stats['totalClicks'] ) : 0;
		$total_urls = isset( $stats['totalUrls'] ) ? intval( $stats['totalUrls'] ) : $total_links;
		$top_links = isset( $stats['topLinks'] ) ? $stats['topLinks'] : array();

		?>
		<div class="dashdig-dashboard-widget">
			<div class="dashdig-stats-grid">
				<div class="dashdig-stat-card">
					<div class="dashdig-stat-value"><?php echo esc_html( number_format_i18n( $total_links ) ); ?></div>
					<div class="dashdig-stat-label"><?php esc_html_e( 'Total Links', 'dashdig-url-shortener' ); ?></div>
				</div>

				<div class="dashdig-stat-card">
					<div class="dashdig-stat-value"><?php echo esc_html( number_format_i18n( $total_clicks ) ); ?></div>
					<div class="dashdig-stat-label"><?php esc_html_e( 'Total Clicks', 'dashdig-url-shortener' ); ?></div>
				</div>

				<div class="dashdig-stat-card">
					<div class="dashdig-stat-value">
						<?php
						if ( $total_links > 0 ) {
							echo esc_html( number_format_i18n( $total_clicks / $total_links, 1 ) );
						} else {
							echo '0';
						}
						?>
					</div>
					<div class="dashdig-stat-label"><?php esc_html_e( 'Avg. Clicks/Link', 'dashdig-url-shortener' ); ?></div>
				</div>
			</div>

			<?php if ( ! empty( $top_links ) ) : ?>
				<div class="dashdig-top-links">
					<h4><?php esc_html_e( 'Top Performers', 'dashdig-url-shortener' ); ?></h4>
					<table class="widefat">
						<thead>
							<tr>
								<th><?php esc_html_e( 'Short URL', 'dashdig-url-shortener' ); ?></th>
								<th><?php esc_html_e( 'Clicks', 'dashdig-url-shortener' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php foreach ( array_slice( $top_links, 0, 5 ) as $link ) : ?>
								<tr>
									<td>
										<a href="<?php echo esc_url( $link['shortUrl'] ); ?>" target="_blank">
											<?php echo esc_html( $link['shortCode'] ); ?>
										</a>
									</td>
									<td><?php echo esc_html( number_format_i18n( $link['clicks'] ) ); ?></td>
								</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				</div>
			<?php endif; ?>

			<p class="dashdig-widget-footer">
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=dashdig_link&page=dashdig-analytics' ) ); ?>" class="button button-primary">
					<?php esc_html_e( 'View Full Analytics', 'dashdig-url-shortener' ); ?>
				</a>
				<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=dashdig_link' ) ); ?>" class="button">
					<?php esc_html_e( 'Create Short Link', 'dashdig-url-shortener' ); ?>
				</a>
			</p>
		</div>
		<?php
	}

	/**
	 * Render analytics page.
	 *
	 * @since 1.0.0
	 */
	public function render_analytics_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$api_key = get_option( 'dashdig_api_key' );

		if ( empty( $api_key ) ) {
			?>
			<div class="wrap">
				<h1><?php esc_html_e( 'DashDig Analytics', 'dashdig-url-shortener' ); ?></h1>
				<div class="notice notice-warning">
					<p>
						<?php
						printf(
							/* translators: %s: settings page URL */
							__( 'Please <a href="%s">configure your API key</a> to view analytics.', 'dashdig-url-shortener' ),
							esc_url( admin_url( 'edit.php?post_type=dashdig_link&page=dashdig-settings' ) )
						);
						?>
					</p>
				</div>
			</div>
			<?php
			return;
		}

		// Check if viewing specific link analytics.
		$link_code = isset( $_GET['link'] ) ? sanitize_text_field( wp_unslash( $_GET['link'] ) ) : '';

		if ( ! empty( $link_code ) ) {
			$this->render_link_analytics( $link_code );
			return;
		}

		// Get overall statistics.
		$stats = $this->api_client->get_statistics();

		if ( is_wp_error( $stats ) ) {
			?>
			<div class="wrap">
				<h1><?php esc_html_e( 'DashDig Analytics', 'dashdig-url-shortener' ); ?></h1>
				<div class="notice notice-error">
					<p>
						<?php
						printf(
							/* translators: %s: error message */
							__( 'Error loading analytics: %s', 'dashdig-url-shortener' ),
							esc_html( $stats->get_error_message() )
						);
						?>
					</p>
				</div>
			</div>
			<?php
			return;
		}

		// Get local link count.
		$link_count = wp_count_posts( 'dashdig_link' );
		$total_links = isset( $link_count->publish ) ? intval( $link_count->publish ) : 0;

		$total_clicks = isset( $stats['totalClicks'] ) ? intval( $stats['totalClicks'] ) : 0;
		$total_urls = isset( $stats['totalUrls'] ) ? intval( $stats['totalUrls'] ) : $total_links;
		$top_links = isset( $stats['topLinks'] ) ? $stats['topLinks'] : array();

		?>
		<div class="wrap dashdig-analytics-page">
			<h1><?php esc_html_e( 'DashDig Analytics', 'dashdig-url-shortener' ); ?></h1>

			<div class="dashdig-stats-overview">
				<div class="dashdig-stat-box">
					<div class="dashdig-stat-icon dashicons dashicons-admin-links"></div>
					<div class="dashdig-stat-content">
						<div class="dashdig-stat-number"><?php echo esc_html( number_format_i18n( $total_links ) ); ?></div>
						<div class="dashdig-stat-title"><?php esc_html_e( 'Total Links', 'dashdig-url-shortener' ); ?></div>
					</div>
				</div>

				<div class="dashdig-stat-box">
					<div class="dashdig-stat-icon dashicons dashicons-chart-line"></div>
					<div class="dashdig-stat-content">
						<div class="dashdig-stat-number"><?php echo esc_html( number_format_i18n( $total_clicks ) ); ?></div>
						<div class="dashdig-stat-title"><?php esc_html_e( 'Total Clicks', 'dashdig-url-shortener' ); ?></div>
					</div>
				</div>

				<div class="dashdig-stat-box">
					<div class="dashdig-stat-icon dashicons dashicons-performance"></div>
					<div class="dashdig-stat-content">
						<div class="dashdig-stat-number">
							<?php
							if ( $total_links > 0 ) {
								echo esc_html( number_format_i18n( $total_clicks / $total_links, 1 ) );
							} else {
								echo '0';
							}
							?>
						</div>
						<div class="dashdig-stat-title"><?php esc_html_e( 'Avg. Clicks per Link', 'dashdig-url-shortener' ); ?></div>
					</div>
				</div>
			</div>

			<?php if ( ! empty( $top_links ) ) : ?>
				<div class="dashdig-top-performers">
					<h2><?php esc_html_e( 'Top Performing Links', 'dashdig-url-shortener' ); ?></h2>
					<table class="wp-list-table widefat fixed striped">
						<thead>
							<tr>
								<th><?php esc_html_e( 'Rank', 'dashdig-url-shortener' ); ?></th>
								<th><?php esc_html_e( 'Short Code', 'dashdig-url-shortener' ); ?></th>
								<th><?php esc_html_e( 'Short URL', 'dashdig-url-shortener' ); ?></th>
								<th><?php esc_html_e( 'Original URL', 'dashdig-url-shortener' ); ?></th>
								<th><?php esc_html_e( 'Clicks', 'dashdig-url-shortener' ); ?></th>
								<th><?php esc_html_e( 'Actions', 'dashdig-url-shortener' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php
							$rank = 1;
							foreach ( $top_links as $link ) :
								?>
								<tr>
									<td><?php echo esc_html( $rank++ ); ?></td>
									<td><code><?php echo esc_html( $link['shortCode'] ); ?></code></td>
									<td>
										<a href="<?php echo esc_url( $link['shortUrl'] ); ?>" target="_blank">
											<?php echo esc_html( $link['shortUrl'] ); ?>
										</a>
									</td>
									<td>
										<a href="<?php echo esc_url( $link['originalUrl'] ); ?>" target="_blank" title="<?php echo esc_attr( $link['originalUrl'] ); ?>">
											<?php echo esc_html( wp_trim_words( $link['originalUrl'], 8, '...' ) ); ?>
										</a>
									</td>
									<td><strong><?php echo esc_html( number_format_i18n( $link['clicks'] ) ); ?></strong></td>
									<td>
										<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=dashdig_link&page=dashdig-analytics&link=' . $link['shortCode'] ) ); ?>" class="button button-small">
											<?php esc_html_e( 'View Details', 'dashdig-url-shortener' ); ?>
										</a>
									</td>
								</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				</div>
			<?php else : ?>
				<div class="notice notice-info">
					<p><?php esc_html_e( 'No link data available yet. Create some short links to see analytics!', 'dashdig-url-shortener' ); ?></p>
				</div>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Render individual link analytics.
	 *
	 * @since 1.0.0
	 * @param string $link_code The short code of the link.
	 */
	private function render_link_analytics( $link_code ) {
		$analytics = $this->api_client->get_url_analytics( $link_code );

		if ( is_wp_error( $analytics ) ) {
			?>
			<div class="wrap">
				<h1><?php esc_html_e( 'Link Analytics', 'dashdig-url-shortener' ); ?></h1>
				<div class="notice notice-error">
					<p>
						<?php
						printf(
							/* translators: %s: error message */
							__( 'Error loading link analytics: %s', 'dashdig-url-shortener' ),
							esc_html( $analytics->get_error_message() )
						);
						?>
					</p>
				</div>
			</div>
			<?php
			return;
		}

		$short_url = isset( $analytics['shortUrl'] ) ? $analytics['shortUrl'] : '';
		$original_url = isset( $analytics['originalUrl'] ) ? $analytics['originalUrl'] : '';
		$clicks = isset( $analytics['clicks'] ) ? intval( $analytics['clicks'] ) : 0;
		$created_at = isset( $analytics['createdAt'] ) ? $analytics['createdAt'] : '';

		?>
		<div class="wrap dashdig-link-analytics-page">
			<h1><?php esc_html_e( 'Link Analytics', 'dashdig-url-shortener' ); ?></h1>

			<p>
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=dashdig_link&page=dashdig-analytics' ) ); ?>">
					&larr; <?php esc_html_e( 'Back to Analytics', 'dashdig-url-shortener' ); ?>
				</a>
			</p>

			<div class="dashdig-link-info">
				<h2><?php esc_html_e( 'Link Information', 'dashdig-url-shortener' ); ?></h2>
				<table class="form-table">
					<tr>
						<th><?php esc_html_e( 'Short URL:', 'dashdig-url-shortener' ); ?></th>
						<td>
							<a href="<?php echo esc_url( $short_url ); ?>" target="_blank"><?php echo esc_html( $short_url ); ?></a>
							<button type="button" class="button dashdig-copy-btn" data-url="<?php echo esc_url( $short_url ); ?>">
								<?php esc_html_e( 'Copy', 'dashdig-url-shortener' ); ?>
							</button>
						</td>
					</tr>
					<tr>
						<th><?php esc_html_e( 'Original URL:', 'dashdig-url-shortener' ); ?></th>
						<td><a href="<?php echo esc_url( $original_url ); ?>" target="_blank"><?php echo esc_html( $original_url ); ?></a></td>
					</tr>
					<tr>
						<th><?php esc_html_e( 'Total Clicks:', 'dashdig-url-shortener' ); ?></th>
						<td><strong><?php echo esc_html( number_format_i18n( $clicks ) ); ?></strong></td>
					</tr>
					<?php if ( $created_at ) : ?>
						<tr>
							<th><?php esc_html_e( 'Created:', 'dashdig-url-shortener' ); ?></th>
							<td><?php echo esc_html( date_i18n( get_option( 'date_format' ), strtotime( $created_at ) ) ); ?></td>
						</tr>
					<?php endif; ?>
				</table>
			</div>

			<div class="dashdig-click-stats">
				<h2><?php esc_html_e( 'Click Statistics', 'dashdig-url-shortener' ); ?></h2>
				<div class="dashdig-stat-card-large">
					<div class="dashdig-stat-value-large"><?php echo esc_html( number_format_i18n( $clicks ) ); ?></div>
					<div class="dashdig-stat-label-large"><?php esc_html_e( 'Total Clicks', 'dashdig-url-shortener' ); ?></div>
				</div>
			</div>
		</div>
		<?php
	}
}

