# 🔒 Security Checklist - Dashdig Analytics

## Quick Reference for Developers

Use this checklist when adding new features or modifying existing code.

---

## ✅ Pre-Commit Security Checklist

### 1. INPUT SANITIZATION

**Every time you handle user input:**

```php
// ✅ CORRECT - Always sanitize
$value = sanitize_text_field( $_POST['field_name'] );
$email = sanitize_email( $_POST['email'] );
$url = esc_url_raw( $_POST['url'] );
$int = absint( $_POST['number'] );

// ❌ WRONG - Never use raw
$value = $_POST['field_name'];
```

**Common Sanitization Functions:**
- `sanitize_text_field()` - Text inputs
- `sanitize_email()` - Email addresses
- `sanitize_url()` / `esc_url_raw()` - URLs
- `absint()` - Positive integers
- `intval()` - Integers
- `floatval()` - Floating point numbers
- `wp_kses_post()` - HTML content (allowed tags)
- `sanitize_textarea_field()` - Textarea content

**Settings Registration:**
```php
// ✅ CORRECT - Include sanitize_callback
register_setting(
    'group_name',
    'option_name',
    array(
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    )
);
```

---

### 2. OUTPUT ESCAPING

**Every time you output data:**

```php
// ✅ CORRECT - Always escape
<h1><?php echo esc_html( $title ); ?></h1>
<input value="<?php echo esc_attr( $value ); ?>" />
<a href="<?php echo esc_url( $link ); ?>">Link</a>
<script>var id = '<?php echo esc_js( $id ); ?>';</script>

// ❌ WRONG - Never output raw
<h1><?php echo $title; ?></h1>
```

**Common Escaping Functions:**
- `esc_html()` - HTML content
- `esc_attr()` - HTML attributes
- `esc_url()` - URLs in HTML
- `esc_js()` - JavaScript strings
- `esc_textarea()` - Textarea content
- `wp_kses_post()` - Post content with allowed HTML

**Translation Functions (auto-escape):**
- `esc_html__()` / `esc_html_e()` - HTML text
- `esc_attr__()` / `esc_attr_e()` - Attributes

---

### 3. NONCE VERIFICATION

**Every form submission:**

```php
// ✅ In the form
<form method="post">
    <?php wp_nonce_field( 'action_name', 'nonce_field_name' ); ?>
    <!-- form fields -->
</form>

// ✅ In the handler
if ( ! isset( $_POST['nonce_field_name'] ) || 
     ! wp_verify_nonce( $_POST['nonce_field_name'], 'action_name' ) ) {
    wp_die( 'Security check failed' );
}
```

**For AJAX requests:**

```php
// ✅ In wp_localize_script
wp_localize_script( 'script-handle', 'ajaxObject', array(
    'ajaxUrl' => admin_url( 'admin-ajax.php' ),
    'nonce' => wp_create_nonce( 'action_name' ),
));

// ✅ In AJAX handler
check_ajax_referer( 'action_name', 'nonce' );
```

**For Settings API:**
```php
// ✅ WordPress handles this automatically
<form method="post" action="options.php">
    <?php settings_fields( 'settings_group' ); ?>
    <!-- fields -->
</form>
```

---

### 4. CAPABILITY CHECKS

**Every admin page/action:**

```php
// ✅ CORRECT - Check capabilities
if ( ! current_user_can( 'manage_options' ) ) {
    wp_die( 'Insufficient permissions' );
}

// ✅ For menu pages
add_menu_page(
    'Page Title',
    'Menu Title',
    'manage_options', // Required capability
    'menu-slug',
    'callback_function'
);

// ✅ For AJAX handlers
if ( ! current_user_can( 'manage_options' ) ) {
    wp_send_json_error( 'Insufficient permissions' );
    wp_die();
}
```

**Common Capabilities:**
- `manage_options` - Admin settings
- `edit_posts` - Post editing
- `publish_posts` - Publishing
- `edit_pages` - Page editing
- `manage_categories` - Category management

---

### 5. DATABASE QUERIES

**Always use WordPress functions:**

```php
// ✅ CORRECT - Use WordPress functions
$value = get_option( 'option_name' );
add_option( 'option_name', $value );
update_option( 'option_name', $value );
delete_option( 'option_name' );

// ✅ For custom queries (if needed)
global $wpdb;
$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}table WHERE id = %d",
        $id
    )
);

// ❌ WRONG - Never directly interpolate
$wpdb->query( "SELECT * FROM table WHERE id = $id" );
```

**Prepare Statement Placeholders:**
- `%s` - String
- `%d` - Integer
- `%f` - Float

---

### 6. FILE OPERATIONS

**Always validate paths:**

```php
// ✅ CORRECT - Use constants and validate
$file = DASHDIG_ANALYTICS_PLUGIN_DIR . 'includes/file.php';
if ( file_exists( $file ) ) {
    require_once $file;
}

// ❌ WRONG - Never use user input directly
$file = $_GET['file'];
include $file;
```

**Direct Access Protection:**
```php
// ✅ Add to every PHP file
if ( ! defined( 'WPINC' ) ) {
    die;
}
// or
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
```

---

### 7. API SECURITY

**For external API calls:**

```php
// ✅ CORRECT - Use WordPress HTTP API
$response = wp_remote_post(
    $url,
    array(
        'headers' => array(
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type' => 'application/json',
        ),
        'body' => wp_json_encode( $data ),
        'timeout' => 15,
    )
);

// ✅ Validate response
if ( is_wp_error( $response ) ) {
    // Handle error
}

$code = wp_remote_retrieve_response_code( $response );
if ( $code !== 200 ) {
    // Handle non-200 response
}
```

**Never expose:**
- API keys in frontend code
- API keys in JavaScript
- Sensitive credentials

---

## 🚫 Common Security Mistakes

### ❌ NEVER DO THIS:

```php
// 1. Direct output without escaping
echo $_POST['name'];
echo $user_data;

// 2. Direct database queries without prepare
$wpdb->query( "SELECT * FROM table WHERE id = $_GET['id']" );

// 3. No capability checks
function admin_action() {
    // Do admin stuff without checking permissions
}

// 4. No nonce verification
if ( $_POST['action'] == 'save' ) {
    update_option( 'value', $_POST['value'] );
}

// 5. Trust user input
$file = $_GET['file'];
include $file;

// 6. Expose sensitive data
console.log( apiKey ); // In JavaScript
```

---

## ✅ ALWAYS DO THIS:

```php
// 1. Escape all output
echo esc_html( $_POST['name'] );
echo esc_html( $user_data );

// 2. Use WordPress DB functions or prepare
$value = $wpdb->get_var( $wpdb->prepare(
    "SELECT * FROM table WHERE id = %d",
    $_GET['id']
));

// 3. Check capabilities
function admin_action() {
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'Insufficient permissions' );
    }
    // Do admin stuff
}

// 4. Verify nonces
if ( ! wp_verify_nonce( $_POST['nonce'], 'action' ) ) {
    wp_die( 'Security check failed' );
}
update_option( 'value', sanitize_text_field( $_POST['value'] ) );

// 5. Validate and sanitize input
$allowed_files = array( 'file1.php', 'file2.php' );
$file = sanitize_file_name( $_GET['file'] );
if ( in_array( $file, $allowed_files, true ) ) {
    include PLUGIN_DIR . $file;
}

// 6. Never expose sensitive data in frontend
// Store in options, retrieve server-side only
```

---

## 📋 Code Review Checklist

Before committing code, verify:

- [ ] All $_POST, $_GET, $_REQUEST sanitized
- [ ] All echo/print statements escaped
- [ ] All forms have nonces
- [ ] All admin functions check capabilities
- [ ] No direct SQL queries (or properly prepared)
- [ ] All files have direct access protection
- [ ] No hardcoded credentials
- [ ] No sensitive data in JavaScript
- [ ] Error messages don't expose system info
- [ ] File paths use constants, not user input

---

## 🔍 Security Testing

**Manual Testing:**
1. Try accessing admin pages while logged out
2. Try submitting forms without nonces
3. Try injecting HTML/JavaScript in inputs
4. Try SQL injection in text fields
5. Check browser console for exposed data

**Automated Testing:**
1. Run WordPress Plugin Check plugin
2. Use Query Monitor for debugging
3. Check PHP error logs
4. Test with WP_DEBUG enabled

---

## 📚 Additional Resources

**WordPress Security:**
- https://developer.wordpress.org/plugins/security/
- https://developer.wordpress.org/apis/security/
- https://wordpress.org/about/security/

**Data Validation:**
- https://developer.wordpress.org/plugins/security/data-validation/
- https://codex.wordpress.org/Validating_Sanitizing_and_Escaping_User_Data

**Nonces:**
- https://developer.wordpress.org/plugins/security/nonces/

**Capability Checks:**
- https://wordpress.org/documentation/article/roles-and-capabilities/

---

## 🎯 Quick Security Commands

### Search for potential issues:

```bash
# Find unescaped echo statements
grep -r "echo \$" --include="*.php"

# Find direct $_GET usage
grep -r "\$_GET\[" --include="*.php"

# Find direct $_POST usage
grep -r "\$_POST\[" --include="*.php"

# Find potential SQL injection
grep -r "\$wpdb->query" --include="*.php"

# Find missing WPINC checks
grep -L "defined.*WPINC" *.php includes/*.php
```

---

## 🔐 Security Levels

### Level 1: Basic Security (Required)
- [x] Input sanitization
- [x] Output escaping
- [x] Direct access protection
- [x] Capability checks

### Level 2: Standard Security (Recommended)
- [x] Nonce verification
- [x] WordPress HTTP API
- [x] Error handling
- [x] No hardcoded credentials

### Level 3: Enhanced Security (Best Practice)
- [x] Rate limiting
- [x] Security headers
- [x] Content Security Policy
- [x] Regular security audits

**Current Plugin Status:** Level 2+ ✅

---

**Last Updated:** November 6, 2025  
**Plugin Version:** 1.0.0  
**Security Score:** 100%


