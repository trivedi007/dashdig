const QRCode = require('qrcode');

/**
 * Generate QR code with customization options
 * @param {string} url - The URL to encode in the QR code
 * @param {Object} options - Customization options
 * @param {number} options.size - Size in pixels (100-500, default: 300)
 * @param {string} options.foregroundColor - Foreground color hex code (default: '#000000')
 * @param {string} options.backgroundColor - Background color hex code (default: '#FFFFFF')
 * @param {string} options.format - Output format: 'png' or 'svg' (default: 'png')
 * @returns {Promise<string>} Base64 data URL or SVG string
 */
async function generateQRCode(url, options = {}) {
  const {
    size = 300,
    foregroundColor = '#000000',
    backgroundColor = '#FFFFFF',
    format = 'png'
  } = options;

  // Validate size
  const validatedSize = Math.max(100, Math.min(500, parseInt(size, 10) || 300));

  // Validate colors (basic hex validation)
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const validatedForeground = colorRegex.test(foregroundColor) ? foregroundColor : '#000000';
  const validatedBackground = colorRegex.test(backgroundColor) ? backgroundColor : '#FFFFFF';

  // QR code options
  const qrOptions = {
    width: validatedSize,
    margin: 2,
    color: {
      dark: validatedForeground,
      light: validatedBackground
    },
    errorCorrectionLevel: 'M' // Medium error correction
  };

  try {
    if (format === 'svg') {
      // Generate SVG string
      const svgString = await QRCode.toString(url, {
        ...qrOptions,
        type: 'svg'
      });
      return svgString;
    } else {
      // Generate PNG data URL
      const dataUrl = await QRCode.toDataURL(url, qrOptions);
      return dataUrl;
    }
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
}

/**
 * Generate QR code buffer for file download
 * @param {string} url - The URL to encode
 * @param {Object} options - Customization options
 * @returns {Promise<Buffer>} QR code image buffer
 */
async function generateQRCodeBuffer(url, options = {}) {
  const {
    size = 300,
    foregroundColor = '#000000',
    backgroundColor = '#FFFFFF'
  } = options;

  const validatedSize = Math.max(100, Math.min(500, parseInt(size, 10) || 300));
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const validatedForeground = colorRegex.test(foregroundColor) ? foregroundColor : '#000000';
  const validatedBackground = colorRegex.test(backgroundColor) ? backgroundColor : '#FFFFFF';

  try {
    const buffer = await QRCode.toBuffer(url, {
      width: validatedSize,
      margin: 2,
      color: {
        dark: validatedForeground,
        light: validatedBackground
      },
      errorCorrectionLevel: 'M'
    });
    return buffer;
  } catch (error) {
    console.error('QR code buffer generation error:', error);
    throw new Error(`Failed to generate QR code buffer: ${error.message}`);
  }
}

module.exports = {
  generateQRCode,
  generateQRCodeBuffer
};

