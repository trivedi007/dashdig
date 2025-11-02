<?php
/**
 * Bulk tools page template.
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

<div class="wrap dashdig-bulk-tools-page">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

	<p class="description">
		<?php esc_html_e( 'Bulk shorten URLs found in your existing posts. This tool will scan your posts for URLs and create shortened versions.', 'dashdig-url-shortener' ); ?>
	</p>

	<div class="dashdig-bulk-tools-container">
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="dashdig-bulk-form">
			<?php wp_nonce_field( 'dashdig_bulk_shorten', 'dashdig_bulk_shorten_nonce' ); ?>
			<input type="hidden" name="action" value="dashdig_bulk_shorten" />

			<table class="form-table">
				<tr>
					<th scope="row">
						<label for="post_types"><?php esc_html_e( 'Post Types', 'dashdig-url-shortener' ); ?></label>
					</th>
					<td>
						<?php
						$post_types = get_post_types( array( 'public' => true ), 'objects' );
						foreach ( $post_types as $post_type ) {
							if ( 'dashdig_link' === $post_type->name ) {
								continue;
							}
							?>
							<label>
								<input type="checkbox" name="post_types[]" value="<?php echo esc_attr( $post_type->name ); ?>" <?php checked( 'post' === $post_type->name ); ?> />
								<?php echo esc_html( $post_type->label ); ?>
							</label><br>
							<?php
						}
						?>
						<p class="description">
							<?php esc_html_e( 'Select which post types to scan for URLs.', 'dashdig-url-shortener' ); ?>
						</p>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<label for="limit"><?php esc_html_e( 'Limit', 'dashdig-url-shortener' ); ?></label>
					</th>
					<td>
						<input type="number" id="limit" name="limit" value="50" min="1" max="500" class="small-text" />
						<p class="description">
							<?php esc_html_e( 'Maximum number of posts to process (1-500).', 'dashdig-url-shortener' ); ?>
						</p>
					</td>
				</tr>
			</table>

			<p class="submit">
				<button type="submit" class="button button-primary button-large">
					<?php esc_html_e( 'Start Bulk Shortening', 'dashdig-url-shortener' ); ?>
				</button>
			</p>
		</form>

		<div class="dashdig-bulk-info">
			<h2><?php esc_html_e( 'How It Works', 'dashdig-url-shortener' ); ?></h2>
			<ol>
				<li><?php esc_html_e( 'Scans selected post types for URLs in content', 'dashdig-url-shortener' ); ?></li>
				<li><?php esc_html_e( 'Skips URLs that are already shortened', 'dashdig-url-shortener' ); ?></li>
				<li><?php esc_html_e( 'Creates shortened versions via DashDig API', 'dashdig-url-shortener' ); ?></li>
				<li><?php esc_html_e( 'Saves shortened URLs as custom posts for tracking', 'dashdig-url-shortener' ); ?></li>
			</ol>

			<div class="notice notice-info inline">
				<p>
					<strong><?php esc_html_e( 'Note:', 'dashdig-url-shortener' ); ?></strong>
					<?php esc_html_e( 'This tool does not automatically replace URLs in your posts. It creates shortened versions that you can manually use. To automatically insert shortened URLs, use the Gutenberg block or shortcode.', 'dashdig-url-shortener' ); ?>
				</p>
			</div>
		</div>
	</div>
</div>

