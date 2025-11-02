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
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

	<?php settings_errors( 'dashdig_messages' ); ?>

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
				<h3><?php esc_html_e( 'Features', 'dashdig-url-shortener' ); ?></h3>
				<ul>
					<li>✅ <?php esc_html_e( 'Gutenberg block integration', 'dashdig-url-shortener' ); ?></li>
					<li>✅ <?php esc_html_e( 'Classic editor button', 'dashdig-url-shortener' ); ?></li>
					<li>✅ <?php esc_html_e( 'Shortcode support', 'dashdig-url-shortener' ); ?></li>
					<li>✅ <?php esc_html_e( 'Bulk URL shortening', 'dashdig-url-shortener' ); ?></li>
					<li>✅ <?php esc_html_e( 'Analytics dashboard', 'dashdig-url-shortener' ); ?></li>
					<li>✅ <?php esc_html_e( 'Custom post type', 'dashdig-url-shortener' ); ?></li>
				</ul>
			</div>

			<div class="dashdig-sidebar-box">
				<h3><?php esc_html_e( 'Usage Examples', 'dashdig-url-shortener' ); ?></h3>
				<p><strong><?php esc_html_e( 'Shortcode:', 'dashdig-url-shortener' ); ?></strong></p>
				<code>[dashdig url="https://example.com"]</code>
				<br><br>
				<code>[dashdig url="https://example.com" text="Click here"]</code>

				<p><strong><?php esc_html_e( 'Gutenberg Block:', 'dashdig-url-shortener' ); ?></strong></p>
				<p><?php esc_html_e( 'Search for "DashDig" in the block inserter', 'dashdig-url-shortener' ); ?></p>
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

