<?php
/**
 * Admin Dashboard View
 *
 * This file displays the main analytics dashboard.
 *
 * @package    Dashdig_Analytics
 * @subpackage Dashdig_Analytics/admin/views
 * @since      1.0.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

$tracking_enabled = get_option( 'dashdig_tracking_enabled', true );
$tracking_id      = get_option( 'dashdig_tracking_id', '' );
$api_key          = get_option( 'dashdig_api_key', '' );
$is_configured    = ! empty( $tracking_id ) && ! empty( $api_key );
?>

<div class="wrap dashdig-dashboard-wrap">
	<!-- Header -->
	<div class="dashdig-header">
		<h1>⚡ <?php esc_html_e( 'Dashdig Analytics Dashboard', 'dashdig-analytics' ); ?></h1>
		<p><?php esc_html_e( 'Real-time analytics with AI-powered insights for your WordPress site', 'dashdig-analytics' ); ?></p>
	</div>

	<?php if ( ! $is_configured ) : ?>
		<!-- Configuration Notice -->
		<div class="notice notice-warning">
			<p>
				<strong><?php esc_html_e( 'Setup Required:', 'dashdig-analytics' ); ?></strong>
				<?php esc_html_e( 'Please configure your Tracking ID and API Key in settings to start tracking analytics.', 'dashdig-analytics' ); ?>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=dashdig-settings' ) ); ?>" class="button button-primary" style="margin-left: 10px;">
					<?php esc_html_e( 'Go to Settings', 'dashdig-analytics' ); ?>
				</a>
			</p>
		</div>
	<?php endif; ?>

	<?php if ( ! $tracking_enabled ) : ?>
		<!-- Tracking Disabled Notice -->
		<div class="notice notice-info">
			<p>
				<strong><?php esc_html_e( 'Tracking Disabled:', 'dashdig-analytics' ); ?></strong>
				<?php esc_html_e( 'Analytics tracking is currently disabled. Enable it in settings to collect data.', 'dashdig-analytics' ); ?>
			</p>
		</div>
	<?php endif; ?>

	<!-- Quick Links -->
	<div class="dashdig-quick-links">
		<a href="https://dashdig.com/dashboard" target="_blank" class="dashdig-quick-link">
			<span class="dashicons dashicons-external"></span>
			<?php esc_html_e( 'Open Dashdig Dashboard', 'dashdig-analytics' ); ?>
		</a>
		<a href="<?php echo esc_url( admin_url( 'admin.php?page=dashdig-settings' ) ); ?>" class="dashdig-quick-link">
			<span class="dashicons dashicons-admin-settings"></span>
			<?php esc_html_e( 'Settings', 'dashdig-analytics' ); ?>
		</a>
		<button id="dashdig-refresh-analytics" class="dashdig-quick-link" style="border: none; cursor: pointer;">
			<span class="dashicons dashicons-update"></span>
			<?php esc_html_e( 'Refresh Data', 'dashdig-analytics' ); ?>
		</button>
	</div>

	<?php if ( $is_configured && $tracking_enabled ) : ?>
		<!-- Statistics Grid -->
		<div class="dashdig-grid dashdig-stats-container">
			<!-- Page Views Card -->
			<div id="dashdig-stat-pageviews" class="dashdig-card">
				<h3 class="dashdig-card-title"><?php esc_html_e( 'Page Views', 'dashdig-analytics' ); ?></h3>
				<div class="dashdig-card-value">0</div>
				<div class="dashdig-card-change">
					<?php esc_html_e( 'Loading...', 'dashdig-analytics' ); ?>
				</div>
			</div>

			<!-- Visitors Card -->
			<div id="dashdig-stat-visitors" class="dashdig-card">
				<h3 class="dashdig-card-title"><?php esc_html_e( 'Unique Visitors', 'dashdig-analytics' ); ?></h3>
				<div class="dashdig-card-value">0</div>
				<div class="dashdig-card-change">
					<?php esc_html_e( 'Loading...', 'dashdig-analytics' ); ?>
				</div>
			</div>

			<!-- Bounce Rate Card -->
			<div id="dashdig-stat-bounce" class="dashdig-card">
				<h3 class="dashdig-card-title"><?php esc_html_e( 'Bounce Rate', 'dashdig-analytics' ); ?></h3>
				<div class="dashdig-card-value">0%</div>
				<div class="dashdig-card-change">
					<?php esc_html_e( 'Loading...', 'dashdig-analytics' ); ?>
				</div>
			</div>

			<!-- Avg Duration Card -->
			<div id="dashdig-stat-duration" class="dashdig-card">
				<h3 class="dashdig-card-title"><?php esc_html_e( 'Avg. Session', 'dashdig-analytics' ); ?></h3>
				<div class="dashdig-card-value">0s</div>
				<div class="dashdig-card-change">
					<?php esc_html_e( 'Loading...', 'dashdig-analytics' ); ?>
				</div>
			</div>
		</div>

		<!-- AI Insights Section -->
		<div class="dashdig-section">
			<div class="dashdig-insights">
				<h3>🤖 <?php esc_html_e( 'AI-Powered Insights', 'dashdig-analytics' ); ?></h3>
				<div class="dashdig-insights-content">
					<p><?php esc_html_e( 'Get intelligent recommendations based on your analytics data.', 'dashdig-analytics' ); ?></p>
					<button id="dashdig-get-insights" class="button button-primary">
						<?php esc_html_e( 'Generate Insights', 'dashdig-analytics' ); ?>
					</button>
				</div>
			</div>
		</div>

		<!-- Analytics Chart Section -->
		<div class="dashdig-section">
			<h2 class="dashdig-section-title"><?php esc_html_e( 'Traffic Overview', 'dashdig-analytics' ); ?></h2>
			<div class="dashdig-chart-container">
				<p style="text-align: center; color: #666; padding: 40px;">
					<?php esc_html_e( 'Chart visualization will be displayed here. Connect to Dashdig API to view detailed analytics.', 'dashdig-analytics' ); ?>
				</p>
			</div>
		</div>

		<!-- Top Pages Section -->
		<div class="dashdig-section">
			<h2 class="dashdig-section-title"><?php esc_html_e( 'Top Pages', 'dashdig-analytics' ); ?></h2>
			<div id="dashdig-top-pages">
				<p style="color: #666;">
					<?php esc_html_e( 'Loading top pages...', 'dashdig-analytics' ); ?>
				</p>
			</div>
		</div>

	<?php endif; ?>

	<!-- Footer Info -->
	<div class="dashdig-section">
		<h2 class="dashdig-section-title"><?php esc_html_e( 'About Dashdig Analytics', 'dashdig-analytics' ); ?></h2>
		<p>
			<?php
			printf(
				/* translators: %s: plugin version */
				esc_html__( 'Version %s | Powerful analytics tracking with AI-powered insights', 'dashdig-analytics' ),
				esc_html( DASHDIG_ANALYTICS_VERSION )
			);
			?>
		</p>
		<p>
			<a href="https://dashdig.com" target="_blank"><?php esc_html_e( 'Visit Dashdig.com', 'dashdig-analytics' ); ?></a> |
			<a href="https://dashdig.com/docs" target="_blank"><?php esc_html_e( 'Documentation', 'dashdig-analytics' ); ?></a> |
			<a href="https://dashdig.com/support" target="_blank"><?php esc_html_e( 'Support', 'dashdig-analytics' ); ?></a>
		</p>
	</div>
</div>


