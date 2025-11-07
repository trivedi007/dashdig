<?php
/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://dashdig.com
 * @since      1.0.0
 *
 * @package    Dashdig_Analytics
 * @subpackage Dashdig_Analytics/admin/partials
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Check user capabilities.
if ( ! current_user_can( 'manage_options' ) ) {
	wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'dashdig-analytics' ) );
}

// Get current options.
$api_key          = get_option( 'dashdig_api_key', '' );
$tracking_enabled = get_option( 'dashdig_enabled', true );
$script_position  = get_option( 'dashdig_script_position', 'footer' );
$exclude_admins   = get_option( 'dashdig_exclude_admins', true );
$tracking_id      = get_option( 'dashdig_tracking_id', '' );

// Check if settings were saved.
if ( isset( $_GET['settings-updated'] ) && sanitize_text_field( wp_unslash( $_GET['settings-updated'] ) ) === 'true' ) {
	add_settings_error(
		'dashdig_messages',
		'dashdig_message',
		__( 'Settings saved successfully!', 'dashdig-analytics' ),
		'success'
	);
}

// Determine tracking status.
$is_configured = ! empty( $api_key ) && ! empty( $tracking_id );
$status_class  = ( $tracking_enabled && $is_configured ) ? 'active' : 'inactive';
$status_text   = ( $tracking_enabled && $is_configured ) ? __( 'Active', 'dashdig-analytics' ) : __( 'Inactive', 'dashdig-analytics' );
?>

<div class="wrap dashdig-settings-wrap">
	<!-- Header -->
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	
	<?php settings_errors( 'dashdig_messages' ); ?>

	<!-- Status Bar -->
	<div class="dashdig-status-bar" style="margin: 20px 0; padding: 15px; background: #fff; border-left: 4px solid <?php echo $status_class === 'active' ? '#46b450' : '#dc3232'; ?>; box-shadow: 0 1px 1px rgba(0,0,0,.04);">
		<h2 style="margin: 0 0 10px 0; font-size: 18px;">
			<?php esc_html_e( 'Tracking Status:', 'dashdig-analytics' ); ?>
			<span style="color: <?php echo $status_class === 'active' ? '#46b450' : '#dc3232'; ?>; font-weight: 600;">
				<?php echo esc_html( $status_text ); ?>
			</span>
		</h2>
		
		<?php if ( ! $is_configured ) : ?>
			<p style="margin: 0; color: #d63638;">
				<span class="dashicons dashicons-warning" style="margin-right: 5px;"></span>
				<?php esc_html_e( 'Please enter your API Key and Tracking ID to start tracking.', 'dashdig-analytics' ); ?>
			</p>
		<?php else : ?>
			<p style="margin: 0; color: #2271b1;">
				<span class="dashicons dashicons-yes" style="margin-right: 5px;"></span>
				<?php esc_html_e( 'Your site is connected to Dashdig Analytics.', 'dashdig-analytics' ); ?>
			</p>
		<?php endif; ?>

		<!-- Test Connection Result -->
		<div id="dashdig-test-result" style="margin-top: 10px; display: none;"></div>
	</div>

	<!-- Main Settings Form -->
	<form method="post" action="options.php" id="dashdig-settings-form">
		<?php
		// Output security fields for the registered setting.
		// CRITICAL: This must match the group name in register_setting().
		settings_fields( 'dashdig_options_group' );
		?>

		<div style="background: #fff; padding: 20px; box-shadow: 0 1px 1px rgba(0,0,0,.04);">
			<h2 class="title"><?php esc_html_e( 'Configuration', 'dashdig-analytics' ); ?></h2>
			<p class="description">
				<?php
				printf(
					/* translators: %s: URL to Dashdig dashboard */
					esc_html__( 'Get your credentials from your %s.', 'dashdig-analytics' ),
					'<a href="https://dashdig.com/dashboard" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Dashdig Dashboard', 'dashdig-analytics' ) . ' <span class="dashicons dashicons-external" style="font-size: 14px; vertical-align: middle;"></span></a>'
				);
				?>
			</p>

			<table class="form-table" role="presentation">
				<tbody>
					<!-- Tracking ID -->
					<tr>
						<th scope="row">
							<label for="dashdig_tracking_id">
								<?php esc_html_e( 'Tracking ID', 'dashdig-analytics' ); ?>
								<span style="color: #d63638;">*</span>
							</label>
						</th>
						<td>
							<input type="text" 
								   id="dashdig_tracking_id" 
								   name="dashdig_tracking_id" 
								   value="<?php echo esc_attr( $tracking_id ); ?>" 
								   class="regular-text" 
								   placeholder="DASH-XXXXXXXXXX"
								   required />
							<p class="description">
								<?php
								printf(
									/* translators: %s: URL to widget settings */
									esc_html__( 'Your unique tracking ID from %s', 'dashdig-analytics' ),
									'<a href="https://dashdig.com/dashboard/widget" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Dashboard → Widget Settings', 'dashdig-analytics' ) . '</a>'
								);
								?>
							</p>
						</td>
					</tr>

					<!-- API Key -->
					<tr>
						<th scope="row">
							<label for="dashdig_api_key">
								<?php esc_html_e( 'Dashdig API Key', 'dashdig-analytics' ); ?>
								<span style="color: #d63638;">*</span>
							</label>
						</th>
						<td>
							<input type="text" 
								   id="dashdig_api_key" 
								   name="dashdig_api_key" 
								   value="<?php echo esc_attr( $api_key ); ?>" 
								   class="regular-text code" 
								   placeholder="your-api-key-here"
								   required />
							<p class="description">
								<?php
								printf(
									/* translators: %s: URL to dashboard */
									esc_html__( 'Get your API key from %s', 'dashdig-analytics' ),
									'<a href="https://dashdig.com/dashboard/widget" target="_blank" rel="noopener noreferrer">https://dashdig.com/dashboard/widget</a>'
								);
								?>
							</p>
							<p>
								<button type="button" id="dashdig-test-connection" class="button button-secondary" style="margin-top: 5px;">
									<span class="dashicons dashicons-update" style="font-size: 16px; vertical-align: middle; margin-right: 3px;"></span>
									<?php esc_html_e( 'Test API Key', 'dashdig-analytics' ); ?>
								</button>
								<span id="dashdig-test-loader" style="display: none; margin-left: 10px;">
									<span class="spinner is-active" style="float: none; margin: 0;"></span>
								</span>
							</p>
						</td>
					</tr>

				<!-- Enable Tracking -->
				<tr>
					<th scope="row">
						<?php esc_html_e( 'Enable Tracking', 'dashdig-analytics' ); ?>
					</th>
					<td>
						<fieldset>
							<label for="dashdig_enabled">
								<input type="checkbox" 
									   name="dashdig_enabled" 
									   id="dashdig_enabled" 
									   value="1" 
									   <?php checked( 1, get_option( 'dashdig_enabled', false ) ); ?> />
								<?php esc_html_e( 'Turn tracking on/off without removing API key', 'dashdig-analytics' ); ?>
							</label>
							<p class="description">
								<?php esc_html_e( 'Uncheck this to temporarily disable tracking while keeping your configuration.', 'dashdig-analytics' ); ?>
							</p>
						</fieldset>
					</td>
				</tr>

					<!-- Script Position -->
					<tr>
						<th scope="row">
							<label for="dashdig_script_position">
								<?php esc_html_e( 'Script Position', 'dashdig-analytics' ); ?>
							</label>
						</th>
						<td>
							<select id="dashdig_script_position" name="dashdig_script_position" class="regular-text">
								<option value="header" <?php selected( $script_position, 'header' ); ?>>
									<?php esc_html_e( 'Header (wp_head) - Load Early', 'dashdig-analytics' ); ?>
								</option>
								<option value="footer" <?php selected( $script_position, 'footer' ); ?>>
									<?php esc_html_e( 'Footer (wp_footer) - Recommended', 'dashdig-analytics' ); ?>
								</option>
							</select>
							<p class="description">
								<span class="dashicons dashicons-lightbulb" style="color: #2271b1; font-size: 16px; vertical-align: middle;"></span>
								<strong><?php esc_html_e( 'Recommendation:', 'dashdig-analytics' ); ?></strong>
								<?php esc_html_e( 'Footer is recommended for better page load performance.', 'dashdig-analytics' ); ?>
							</p>
						</td>
					</tr>

				<!-- Exclude Administrators -->
				<tr>
					<th scope="row">
						<?php esc_html_e( 'Exclude Administrators', 'dashdig-analytics' ); ?>
					</th>
					<td>
						<fieldset>
							<label for="dashdig_exclude_admins">
								<input type="checkbox" 
									   name="dashdig_exclude_admins" 
									   id="dashdig_exclude_admins" 
									   value="1" 
									   <?php checked( 1, get_option( 'dashdig_exclude_admins', true ) ); ?> />
								<?php esc_html_e( 'Don\'t track logged-in administrators', 'dashdig-analytics' ); ?>
							</label>
							<p class="description">
								<?php esc_html_e( 'When enabled, users with administrator role will not be tracked.', 'dashdig-analytics' ); ?>
							</p>
						</fieldset>
					</td>
				</tr>
				</tbody>
			</table>

			<?php submit_button( __( 'Save Settings', 'dashdig-analytics' ), 'primary', 'submit', false ); ?>
		</div>
	</form>

	<!-- Help Section -->
	<div style="background: #fff; padding: 20px; margin-top: 20px; box-shadow: 0 1px 1px rgba(0,0,0,.04);">
		<h2 class="title">
			<span class="dashicons dashicons-sos" style="color: #2271b1; font-size: 24px; vertical-align: middle; margin-right: 5px;"></span>
			<?php esc_html_e( 'Need Help?', 'dashdig-analytics' ); ?>
		</h2>
		
		<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">
			<!-- Documentation -->
			<div style="padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
				<h3 style="margin: 0 0 10px 0; font-size: 16px;">
					<span class="dashicons dashicons-book" style="color: #2271b1;"></span>
					<?php esc_html_e( 'Documentation', 'dashdig-analytics' ); ?>
				</h3>
				<p style="margin: 0 0 10px 0;">
					<?php esc_html_e( 'Learn how to set up and use Dashdig Analytics.', 'dashdig-analytics' ); ?>
				</p>
				<a href="https://dashdig.com/docs" target="_blank" rel="noopener noreferrer" class="button button-secondary">
					<?php esc_html_e( 'View Documentation', 'dashdig-analytics' ); ?>
					<span class="dashicons dashicons-external" style="font-size: 14px; vertical-align: middle;"></span>
				</a>
			</div>

			<!-- Dashboard -->
			<div style="padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
				<h3 style="margin: 0 0 10px 0; font-size: 16px;">
					<span class="dashicons dashicons-dashboard" style="color: #2271b1;"></span>
					<?php esc_html_e( 'Dashdig Dashboard', 'dashdig-analytics' ); ?>
				</h3>
				<p style="margin: 0 0 10px 0;">
					<?php esc_html_e( 'View your analytics and manage your account.', 'dashdig-analytics' ); ?>
				</p>
				<a href="https://dashdig.com/dashboard" target="_blank" rel="noopener noreferrer" class="button button-secondary">
					<?php esc_html_e( 'Go to Dashboard', 'dashdig-analytics' ); ?>
					<span class="dashicons dashicons-external" style="font-size: 14px; vertical-align: middle;"></span>
				</a>
			</div>

			<!-- Support -->
			<div style="padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
				<h3 style="margin: 0 0 10px 0; font-size: 16px;">
					<span class="dashicons dashicons-email" style="color: #2271b1;"></span>
					<?php esc_html_e( 'Support', 'dashdig-analytics' ); ?>
				</h3>
				<p style="margin: 0 0 10px 0;">
					<?php esc_html_e( 'Get help from our support team.', 'dashdig-analytics' ); ?>
				</p>
				<a href="https://dashdig.com/support" target="_blank" rel="noopener noreferrer" class="button button-secondary">
					<?php esc_html_e( 'Contact Support', 'dashdig-analytics' ); ?>
					<span class="dashicons dashicons-external" style="font-size: 14px; vertical-align: middle;"></span>
				</a>
			</div>
		</div>
	</div>

	<!-- Plugin Information -->
	<div style="margin-top: 20px; padding: 15px; background: #f6f7f7; border-radius: 4px;">
		<p style="margin: 0; color: #646970; font-size: 13px;">
			<?php
			printf(
				/* translators: %s: plugin version */
				esc_html__( 'Dashdig Analytics Plugin v%s', 'dashdig-analytics' ),
				esc_html( DASHDIG_ANALYTICS_VERSION )
			);
			?>
			&bull;
			<a href="https://wordpress.org/plugins/dashdig-analytics/" target="_blank" rel="noopener noreferrer">
				<?php esc_html_e( 'WordPress.org', 'dashdig-analytics' ); ?>
			</a>
			&bull;
			<a href="https://github.com/dashdig/dashdig-analytics-wordpress" target="_blank" rel="noopener noreferrer">
				<?php esc_html_e( 'GitHub', 'dashdig-analytics' ); ?>
			</a>
			&bull;
			<a href="https://dashdig.com/privacy" target="_blank" rel="noopener noreferrer">
				<?php esc_html_e( 'Privacy Policy', 'dashdig-analytics' ); ?>
			</a>
		</p>
	</div>
</div>

<!-- JavaScript for Test Connection -->
<script type="text/javascript">
jQuery(document).ready(function($) {
	'use strict';
	
	// Test API Key Connection
	$('#dashdig-test-connection').on('click', function(e) {
		e.preventDefault();
		
		var $button = $(this);
		var $loader = $('#dashdig-test-loader');
		var $result = $('#dashdig-test-result');
		var apiKey = $('#dashdig_api_key').val().trim();
		var trackingId = $('#dashdig_tracking_id').val().trim();
		
		// Validate inputs
		if (!apiKey) {
			showTestResult('error', '<?php echo esc_js( __( 'Please enter an API key.', 'dashdig-analytics' ) ); ?>');
			return;
		}
		
		if (!trackingId) {
			showTestResult('error', '<?php echo esc_js( __( 'Please enter a tracking ID.', 'dashdig-analytics' ) ); ?>');
			return;
		}
		
		// Show loading state
		$button.prop('disabled', true);
		$loader.show();
		$result.hide();
		
		// Make AJAX request
		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: {
				action: 'dashdig_test_connection',
				api_key: apiKey,
				tracking_id: trackingId,
				nonce: '<?php echo esc_js( wp_create_nonce( 'dashdig_test_connection' ) ); ?>'
			},
			success: function(response) {
				if (response.success) {
					showTestResult('success', response.data.message || '<?php echo esc_js( __( 'API key is valid! Connection successful.', 'dashdig-analytics' ) ); ?>');
				} else {
					showTestResult('error', response.data.message || '<?php echo esc_js( __( 'Failed to verify API key. Please check your credentials.', 'dashdig-analytics' ) ); ?>');
				}
			},
			error: function(xhr, status, error) {
				showTestResult('error', '<?php echo esc_js( __( 'Network error. Please try again.', 'dashdig-analytics' ) ); ?>');
				console.error('AJAX Error:', error);
			},
			complete: function() {
				$button.prop('disabled', false);
				$loader.hide();
			}
		});
	});
	
	// Show test result message
	function showTestResult(type, message) {
		var $result = $('#dashdig-test-result');
		var icon = type === 'success' ? 'yes' : 'no';
		var color = type === 'success' ? '#46b450' : '#d63638';
		
		$result.html(
			'<div style="padding: 10px; border-left: 4px solid ' + color + '; background: #fff; margin-top: 10px;">' +
				'<span class="dashicons dashicons-' + icon + '" style="color: ' + color + '; margin-right: 5px; font-size: 20px; vertical-align: middle;"></span>' +
				'<strong style="color: ' + color + '; vertical-align: middle;">' + message + '</strong>' +
			'</div>'
		).fadeIn();
	}
	
	// Form validation before submit
	$('#dashdig-settings-form').on('submit', function(e) {
		var apiKey = $('#dashdig_api_key').val().trim();
		var trackingId = $('#dashdig_tracking_id').val().trim();
		
		if (!apiKey || !trackingId) {
			e.preventDefault();
			alert('<?php echo esc_js( __( 'Please fill in all required fields (API Key and Tracking ID).', 'dashdig-analytics' ) ); ?>');
			return false;
		}
	});
});
</script>

<style type="text/css">
/* Additional styling for better UI */
.dashdig-settings-wrap .form-table th {
	padding: 20px 10px 20px 0;
	font-weight: 600;
}

.dashdig-settings-wrap .form-table td {
	padding: 15px 10px;
}

.dashdig-settings-wrap .form-table input[type="text"],
.dashdig-settings-wrap .form-table select {
	max-width: 500px;
}

.dashdig-settings-wrap .button-primary {
	height: 40px;
	padding: 0 30px;
	font-size: 14px;
}

.dashdig-settings-wrap .description {
	font-size: 13px;
	line-height: 1.5;
}

@media (max-width: 782px) {
	.dashdig-settings-wrap .form-table th,
	.dashdig-settings-wrap .form-table td {
		padding: 10px;
	}
}
</style>

