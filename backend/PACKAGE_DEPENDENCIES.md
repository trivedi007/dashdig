# Package Dependencies for DashDig Backend

## Required NPM Packages

### SMS Verification (Twilio)

```bash
npm install twilio
```

**Package**: `twilio`  
**Version**: `^5.0.0` (or latest)  
**Purpose**: SMS sending and verification via Twilio API

Add to your `package.json`:

```json
{
  "dependencies": {
    "twilio": "^5.0.0"
  }
}
```

### Rate Limiting (Optional but Recommended)

```bash
npm install express-rate-limit
```

**Package**: `express-rate-limit`  
**Version**: `^7.0.0` (or latest)  
**Purpose**: API rate limiting for SMS endpoints

Add to your `package.json`:

```json
{
  "dependencies": {
    "express-rate-limit": "^7.0.0"
  }
}
```

### Email Verification (Nodemailer)

```bash
npm install nodemailer
```

**Package**: `nodemailer`  
**Version**: `^6.9.0` (or latest)  
**Purpose**: Email sending for email verification

Add to your `package.json`:

```json
{
  "dependencies": {
    "nodemailer": "^6.9.0"
  }
}
```

## Complete package.json Example

```json
{
  "name": "dashdig-backend",
  "version": "1.0.0",
  "description": "DashDig URL Shortener Backend",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest",
    "test:email": "node src/test/test-email-verification.js",
    "test:sms": "node src/test/test-sms-verification.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^8.0.0",
    "dotenv": "^16.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^7.0.0",
    "nodemailer": "^6.9.0",
    "twilio": "^5.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

## Installation Commands

### Install All Dependencies

```bash
# Install all dependencies
npm install

# Or using yarn
yarn install
```

### Install Production Only

```bash
npm install --production
```

### Install Specific Features

```bash
# Email verification only
npm install nodemailer

# SMS verification only
npm install twilio

# Both verification systems
npm install nodemailer twilio

# With rate limiting
npm install nodemailer twilio express-rate-limit
```

## Peer Dependencies

These are typically already installed in an Express.js project:

```json
{
  "peerDependencies": {
    "express": "^4.18.0",
    "mongoose": "^8.0.0"
  }
}
```

## Optional Dependencies

### For Enhanced Security

```bash
npm install helmet cors express-validator
```

### For Logging

```bash
npm install winston morgan
```

### For Testing

```bash
npm install --save-dev jest supertest mongodb-memory-server
```

## Dependency Sizes

| Package | Size (Minified) | Size (Gzipped) |
|---------|-----------------|----------------|
| twilio | ~500 KB | ~150 KB |
| nodemailer | ~300 KB | ~90 KB |
| express-rate-limit | ~15 KB | ~5 KB |

## Security Updates

Always keep dependencies up to date:

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix
```

## Version Compatibility

| Package | Minimum Node.js | Recommended |
|---------|----------------|-------------|
| twilio | 14.x | 18.x+ |
| nodemailer | 12.x | 18.x+ |
| express | 12.x | 18.x+ |
| mongoose | 14.x | 18.x+ |

## Environment-Specific Installation

### Development

```bash
npm install
```

### Production

```bash
npm ci --production
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy source
COPY . .

# Start app
CMD ["npm", "start"]
```

## Troubleshooting

### Issue: Twilio installation fails

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install twilio
```

### Issue: Native dependencies fail

```bash
# Install build tools (Linux)
sudo apt-get install build-essential

# Install build tools (macOS)
xcode-select --install

# Install build tools (Windows)
npm install --global windows-build-tools
```

### Issue: Version conflicts

```bash
# Check installed versions
npm list twilio nodemailer

# Force specific version
npm install twilio@5.0.0
```

## Alternative Package Managers

### Yarn

```bash
# Add dependencies
yarn add twilio nodemailer express-rate-limit

# Install all
yarn install

# Production only
yarn install --production
```

### PNPM

```bash
# Add dependencies
pnpm add twilio nodemailer express-rate-limit

# Install all
pnpm install

# Production only
pnpm install --prod
```

## License Compatibility

All listed packages use permissive licenses:
- **twilio**: MIT
- **nodemailer**: MIT
- **express-rate-limit**: MIT
- **express**: MIT
- **mongoose**: MIT

Safe for commercial use without restrictions.

## Support & Documentation

- **Twilio**: https://www.twilio.com/docs/libraries/node
- **Nodemailer**: https://nodemailer.com/
- **express-rate-limit**: https://github.com/express-rate-limit/express-rate-limit
- **Express**: https://expressjs.com/
- **Mongoose**: https://mongoosejs.com/

---

**Need Help?**
- Check package documentation
- Review `SMS_QUICK_START.md` for setup
- See `ENV_EXAMPLE.md` for configuration

