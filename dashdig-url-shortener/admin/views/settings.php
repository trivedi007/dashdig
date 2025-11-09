<?php
/**
 * Settings page template.
 *
 * @package    Dashdig_URL_Shortener
 * @subpackage Dashdig_URL_Shortener/admin/views
 * @since      1.0.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}
?>

<div class="wrap dashdig-settings-page">
	<!-- Branded Header -->
	<div class="dashdig-admin-header">
		<div class="dashdig-branding">
			<h1 class="dashdig-title">
				<span class="dashdig-logo">Dashdig</span>
				<span class="lightning">⚡</span>
			</h1>
			<p class="dashdig-tagline"><?php echo esc_html( DASHDIG_TAGLINE ); ?></p>
		</div>
		
		<p class="dashdig-description">
			<?php esc_html_e( 'Transform cryptic URLs into human-readable links that people actually remember.', 'dashdig' ); ?>
		</p>
	</div>

	<?php settings_errors( 'dashdig_messages' ); ?>

	<!-- Welcome Message -->
	<div class="dashdig-welcome">
		<h2><?php esc_html_e( 'Welcome to Dashdig!', 'dashdig' ); ?></h2>
		<p><?php esc_html_e( 'Start humanizing and shortenizing your WordPress URLs today.', 'dashdig' ); ?></p>
		
		<div class="quick-start">
			<h3><?php esc_html_e( 'Quick Start Guide:', 'dashdig' ); ?></h3>
			<ol>
				<li><?php esc_html_e( 'Enter your API key below', 'dashdig' ); ?></li>
				<li><?php esc_html_e( 'Create your first humanized URL', 'dashdig' ); ?></li>
				<li><?php esc_html_e( 'Share your memorable link!', 'dashdig' ); ?></li>
			</ol>
		</div>
	</div>

	<div class="dashdig-settings-container">
		<div class="dashdig-settings-main">
			<form action="options.php" method="post">
				<?php
				settings_fields( 'dashdig_settings' );
				do_settings_sections( 'dashdig_settings' );
				submit_button( __( 'Save Settings', 'dashdig-url-shortener' ) );
				?>
			</form>
		</div>

		<div class="dashdig-settings-sidebar">
			<div class="dashdig-sidebar-box">
				<h3><?php esc_html_e( 'Getting Started', 'dashdig-url-shortener' ); ?></h3>
				<ol>
					<li><?php esc_html_e( 'Sign up for a free account at', 'dashdig-url-shortener' ); ?> <a href="https://dashdig.com" target="_blank">DashDig.com</a></li>
					<li><?php esc_html_e( 'Get your API key from the dashboard', 'dashdig-url-shortener' ); ?></li>
					<li><?php esc_html_e( 'Enter your API key above', 'dashdig-url-shortener' ); ?></li>
					<li><?php esc_html_e( 'Start creating short links!', 'dashdig-url-shortener' ); ?></li>
				</ol>
			</div>

			<div class="dashdig-sidebar-box">
				<h3><?php esc_html_e( 'Features', 'dashdig' ); ?></h3>
				<ul>
					<li>⚡ <?php esc_html_e( 'AI-powered URL humanization', 'dashdig' ); ?></li>
					<li>🔗 <?php esc_html_e( 'One-click shortenization', 'dashdig' ); ?></li>
					<li>📱 <?php esc_html_e( 'Built-in QR codes', 'dashdig' ); ?></li>
					<li>📊 <?php esc_html_e( 'Click analytics', 'dashdig' ); ?></li>
					<li>🎨 <?php esc_html_e( 'Gutenberg & Classic editor', 'dashdig' ); ?></li>
					<li>🔖 <?php esc_html_e( 'Shortcode support', 'dashdig' ); ?></li>
				</ul>
			</div>

			<div class="dashdig-sidebar-box">
				<h3><?php esc_html_e( 'Usage Examples', 'dashdig' ); ?></h3>
				<p><strong><?php esc_html_e( 'Shortcode:', 'dashdig' ); ?></strong></p>
				<code>[dashdig url="https://example.com"]</code>
				<br><br>
				<code>[dashdig url="https://example.com" text="Click here"]</code>

				<p><strong><?php esc_html_e( 'Gutenberg Block:', 'dashdig' ); ?></strong></p>
				<p><?php esc_html_e( 'Search for "Dashdig" in the block inserter to humanize URLs', 'dashdig' ); ?></p>
			</div>

			<div class="dashdig-sidebar-box dashdig-help-box">
				<h3><?php esc_html_e( 'Need Help?', 'dashdig-url-shortener' ); ?></h3>
				<p>
					<a href="https://dashdig.com/docs" target="_blank"><?php esc_html_e( 'Documentation', 'dashdig-url-shortener' ); ?></a><br>
					<a href="https://dashdig.com/support" target="_blank"><?php esc_html_e( 'Support', 'dashdig-url-shortener' ); ?></a><br>
					<a href="https://github.com/dashdig/wordpress-plugin" target="_blank"><?php esc_html_e( 'GitHub', 'dashdig-url-shortener' ); ?></a>
				</p>
			</div>
		</div>
	</div>
</div>

