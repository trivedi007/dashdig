<?php
/**
 * The API client class.
 *
 * Handles all API interactions with DashDig backend.
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
 * The API client class.
 *
 * @since 1.0.0
 */
class Dashdig_API_Client {

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
	 * Initialize the API client.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->api_url = get_option( 'dashdig_api_endpoint', DASHDIG_API_ENDPOINT );
		$this->api_key = get_option( 'dashdig_api_key', '' );
	}

	/**
	 * Shorten a URL using DashDig API.
	 *
	 * @since 1.0.0
	 * @param string $long_url The long URL to shorten.
	 * @param array  $args Optional arguments (customSlug, expiresAt, password, etc.).
	 * @return array|WP_Error The API response or WP_Error on failure.
	 */
	public function shorten_url( $long_url, $args = array() ) {
		if ( empty( $this->api_key ) ) {
			return new WP_Error(
				'no_api_key',
				__( 'DashDig API key is not configured. Please configure it in Settings.', 'dashdig-url-shortener' )
			);
		}

		if ( empty( $long_url ) ) {
			return new WP_Error(
				'empty_url',
				__( 'URL cannot be empty.', 'dashdig-url-shortener' )
			);
		}

		// Validate URL format.
		if ( ! filter_var( $long_url, FILTER_VALIDATE_URL ) ) {
			return new WP_Error(
				'invalid_url',
				__( 'Invalid URL format.', 'dashdig-url-shortener' )
			);
		}

		$endpoint = trailingslashit( $this->api_url ) . 'urls/shorten';

		$body = array_merge(
			array( 'url' => $long_url ),
			$args
		);

		$response = wp_remote_post(
			$endpoint,
			array(
				'headers' => array(
					'Content-Type'  => 'application/json',
					'Authorization' => 'Bearer ' . $this->api_key,
				),
				'body'    => wp_json_encode( $body ),
				'timeout' => 30,
			)
		);

		return $this->parse_response( $response );
	}

	/**
	 * Get analytics for a shortened URL.
	 *
	 * @since 1.0.0
	 * @param string $short_code The short code of the URL.
	 * @return array|WP_Error The analytics data or WP_Error on failure.
	 */
	public function get_url_analytics( $short_code ) {
		if ( empty( $this->api_key ) ) {
			return new WP_Error(
				'no_api_key',
				__( 'DashDig API key is not configured.', 'dashdig-url-shortener' )
			);
		}

		$endpoint = trailingslashit( $this->api_url ) . 'urls/' . sanitize_text_field( $short_code ) . '/analytics';

		$response = wp_remote_get(
			$endpoint,
			array(
				'headers' => array(
					'Authorization' => 'Bearer ' . $this->api_key,
				),
				'timeout' => 30,
			)
		);

		return $this->parse_response( $response );
	}

	/**
	 * Get all shortened URLs for the account.
	 *
	 * @since 1.0.0
	 * @param array $args Query parameters (page, limit, etc.).
	 * @return array|WP_Error The list of URLs or WP_Error on failure.
	 */
	public function get_urls( $args = array() ) {
		if ( empty( $this->api_key ) ) {
			return new WP_Error(
				'no_api_key',
				__( 'DashDig API key is not configured.', 'dashdig-url-shortener' )
			);
		}

		$defaults = array(
			'page'  => 1,
			'limit' => 50,
		);

		$args = wp_parse_args( $args, $defaults );

		$endpoint = add_query_arg( $args, trailingslashit( $this->api_url ) . 'urls' );

		$response = wp_remote_get(
			$endpoint,
			array(
				'headers' => array(
					'Authorization' => 'Bearer ' . $this->api_key,
				),
				'timeout' => 30,
			)
		);

		return $this->parse_response( $response );
	}

	/**
	 * Delete a shortened URL.
	 *
	 * @since 1.0.0
	 * @param string $short_code The short code to delete.
	 * @return array|WP_Error The API response or WP_Error on failure.
	 */
	public function delete_url( $short_code ) {
		if ( empty( $this->api_key ) ) {
			return new WP_Error(
				'no_api_key',
				__( 'DashDig API key is not configured.', 'dashdig-url-shortener' )
			);
		}

		$endpoint = trailingslashit( $this->api_url ) . 'urls/' . sanitize_text_field( $short_code );

		$response = wp_remote_request(
			$endpoint,
			array(
				'method'  => 'DELETE',
				'headers' => array(
					'Authorization' => 'Bearer ' . $this->api_key,
				),
				'timeout' => 30,
			)
		);

		return $this->parse_response( $response );
	}

	/**
	 * Update a shortened URL.
	 *
	 * @since 1.0.0
	 * @param string $short_code The short code to update.
	 * @param array  $args Update parameters.
	 * @return array|WP_Error The API response or WP_Error on failure.
	 */
	public function update_url( $short_code, $args ) {
		if ( empty( $this->api_key ) ) {
			return new WP_Error(
				'no_api_key',
				__( 'DashDig API key is not configured.', 'dashdig-url-shortener' )
			);
		}

		$endpoint = trailingslashit( $this->api_url ) . 'urls/' . sanitize_text_field( $short_code );

		$response = wp_remote_request(
			$endpoint,
			array(
				'method'  => 'PUT',
				'headers' => array(
					'Content-Type'  => 'application/json',
					'Authorization' => 'Bearer ' . $this->api_key,
				),
				'body'    => wp_json_encode( $args ),
				'timeout' => 30,
			)
		);

		return $this->parse_response( $response );
	}

	/**
	 * Get overall account statistics.
	 *
	 * @since 1.0.0
	 * @return array|WP_Error The statistics or WP_Error on failure.
	 */
	public function get_statistics() {
		if ( empty( $this->api_key ) ) {
			return new WP_Error(
				'no_api_key',
				__( 'DashDig API key is not configured.', 'dashdig-url-shortener' )
			);
		}

		$endpoint = trailingslashit( $this->api_url ) . 'stats/overview';

		$response = wp_remote_get(
			$endpoint,
			array(
				'headers' => array(
					'Authorization' => 'Bearer ' . $this->api_key,
				),
				'timeout' => 30,
			)
		);

		return $this->parse_response( $response );
	}

	/**
	 * Parse API response.
	 *
	 * @since  1.0.0
	 * @access private
	 * @param  array|WP_Error $response The response from wp_remote_request.
	 * @return array|WP_Error Parsed response data or WP_Error.
	 */
	private function parse_response( $response ) {
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = wp_remote_retrieve_body( $response );
		$data          = json_decode( $response_body, true );

		// Check for HTTP errors.
		if ( $response_code < 200 || $response_code >= 300 ) {
			$error_message = __( 'API request failed.', 'dashdig-url-shortener' );

			if ( isset( $data['error'] ) ) {
				$error_message = sanitize_text_field( $data['error'] );
			} elseif ( isset( $data['message'] ) ) {
				$error_message = sanitize_text_field( $data['message'] );
			}

			return new WP_Error(
				'api_error',
				$error_message,
				array( 'status' => $response_code )
			);
		}

		// Return parsed JSON data.
		if ( null === $data && 'null' !== $response_body ) {
			return new WP_Error(
				'json_parse_error',
				__( 'Failed to parse API response.', 'dashdig-url-shortener' )
			);
		}

		return $data;
	}

	/**
	 * Verify API key is valid.
	 *
	 * @since 1.0.0
	 * @return bool|WP_Error True if valid, WP_Error otherwise.
	 */
	public function verify_api_key() {
		if ( empty( $this->api_key ) ) {
			return new WP_Error(
				'no_api_key',
				__( 'API key is empty.', 'dashdig-url-shortener' )
			);
		}

		// Try to get statistics to verify the key.
		$result = $this->get_statistics();

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return true;
	}
}

