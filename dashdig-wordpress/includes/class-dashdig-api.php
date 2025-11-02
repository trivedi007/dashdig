<?php
/**
 * The API handler class.
 *
 * Handles all API interactions with Dashdig backend.
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
 * The API handler class.
 *
 * @since 1.0.0
 */
class Dashdig_API {

	/**
	 * API endpoint base URL.
	 *
	 * @since  1.0.0
	 * @access private
	 * @var    string $api_url The API base URL.
	 */
	private $api_url;

	/**
	 * API key for authentication.
	 *
	 * @since  1.0.0
	 * @access private
	 * @var    string $api_key The API key.
	 */
	private $api_key;

	/**
	 * Initialize the API handler.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->api_url = DASHDIG_API_ENDPOINT;
		$this->api_key = get_option( 'dashdig_api_key', '' );
	}

	/**
	 * Send tracking event to Dashdig API.
	 *
	 * @since 1.0.0
	 * @param array $event_data The event data to send.
	 * @return array|WP_Error The API response or WP_Error on failure.
	 */
	public function track_event( $event_data ) {
		$tracking_id = get_option( 'dashdig_tracking_id', '' );

		if ( empty( $tracking_id ) ) {
			return new WP_Error( 'no_tracking_id', __( 'Tracking ID is not configured.', 'dashdig-analytics' ) );
		}

		$endpoint = $this->api_url . '/analytics/track';

		$body = wp_json_encode(
			array_merge(
				$event_data,
				array(
					'trackingId' => $tracking_id,
					'timestamp'  => current_time( 'mysql' ),
					'source'     => 'wordpress',
				)
			)
		);

		$response = wp_remote_post(
			$endpoint,
			array(
				'headers' => $this->get_headers(),
				'body'    => $body,
				'timeout' => 15,
			)
		);

		return $this->handle_response( $response );
	}

	/**
	 * Get analytics data from Dashdig API.
	 *
	 * @since 1.0.0
	 * @param array $params Query parameters.
	 * @return array|WP_Error The API response or WP_Error on failure.
	 */
	public function get_analytics( $params = array() ) {
		$endpoint = $this->api_url . '/analytics/data';

		$query_params = http_build_query( $params );
		$url          = $endpoint . '?' . $query_params;

		$response = wp_remote_get(
			$url,
			array(
				'headers' => $this->get_headers(),
				'timeout' => 15,
			)
		);

		return $this->handle_response( $response );
	}

	/**
	 * Get AI insights from Dashdig API.
	 *
	 * @since 1.0.0
	 * @param array $params Parameters for insights.
	 * @return array|WP_Error The API response or WP_Error on failure.
	 */
	public function get_ai_insights( $params = array() ) {
		$endpoint = $this->api_url . '/analytics/insights';

		$body = wp_json_encode( $params );

		$response = wp_remote_post(
			$endpoint,
			array(
				'headers' => $this->get_headers(),
				'body'    => $body,
				'timeout' => 30,
			)
		);

		return $this->handle_response( $response );
	}

	/**
	 * Create a short URL using Dashdig.
	 *
	 * @since 1.0.0
	 * @param string $url         The URL to shorten.
	 * @param string $custom_slug Optional custom slug.
	 * @return array|WP_Error The API response or WP_Error on failure.
	 */
	public function create_short_url( $url, $custom_slug = null ) {
		$endpoint = $this->api_url . '/urls';

		$body = wp_json_encode(
			array(
				'url'        => $url,
				'customSlug' => $custom_slug,
				'source'     => 'wordpress',
			)
		);

		$response = wp_remote_post(
			$endpoint,
			array(
				'headers' => $this->get_headers(),
				'body'    => $body,
				'timeout' => 15,
			)
		);

		return $this->handle_response( $response );
	}

	/**
	 * Get request headers for API calls.
	 *
	 * @since  1.0.0
	 * @access private
	 * @return array The request headers.
	 */
	private function get_headers() {
		$headers = array(
			'Content-Type' => 'application/json',
			'User-Agent'   => 'Dashdig-WordPress/' . DASHDIG_ANALYTICS_VERSION,
		);

		if ( ! empty( $this->api_key ) ) {
			$headers['Authorization'] = 'Bearer ' . $this->api_key;
		}

		return $headers;
	}

	/**
	 * Handle API response.
	 *
	 * @since  1.0.0
	 * @access private
	 * @param  array|WP_Error $response The API response.
	 * @return array|WP_Error Parsed response data or WP_Error.
	 */
	private function handle_response( $response ) {
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = wp_remote_retrieve_body( $response );

		if ( $response_code < 200 || $response_code >= 300 ) {
			return new WP_Error(
				'api_error',
				sprintf(
					/* translators: %d: HTTP response code */
					__( 'API request failed with status code %d', 'dashdig-analytics' ),
					$response_code
				),
				array( 'response' => $response_body )
			);
		}

		$data = json_decode( $response_body, true );

		if ( json_last_error() !== JSON_ERROR_NONE ) {
			return new WP_Error(
				'json_error',
				__( 'Failed to parse API response', 'dashdig-analytics' )
			);
		}

		return $data;
	}

	/**
	 * Verify API key is valid.
	 *
	 * @since 1.0.0
	 * @return bool True if valid, false otherwise.
	 */
	public function verify_api_key() {
		if ( empty( $this->api_key ) ) {
			return false;
		}

		$endpoint = $this->api_url . '/verify';

		$response = wp_remote_get(
			$endpoint,
			array(
				'headers' => $this->get_headers(),
				'timeout' => 10,
			)
		);

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$response_code = wp_remote_retrieve_response_code( $response );

		return $response_code === 200;
	}
}


