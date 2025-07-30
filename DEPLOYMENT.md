# Deployment Guide - Re:Forma Telegram Web App

This guide covers deploying the Re:Forma app with HTTPS support for production use.

## Local Development with HTTPS

### 1. Generate SSL Certificates
```bash
npm run generate-certs
```

### 2. Start Development Server with HTTPS
```bash
npm run dev:https
```

The app will be available at `https://localhost:3000`

**Note**: Since we're using self-signed certificates, your browser will show a security warning. Click "Advanced" and "Proceed to localhost" to continue.

## Production Deployment Options

### Option 1: Vercel (Recommended for Telegram Web Apps)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
npm run build
vercel --prod
```

3. **Configure Custom Domain** (if needed):
```bash
vercel domains add your-domain.com
```

Vercel automatically provides HTTPS certificates via Let's Encrypt.

### Option 2: Netlify

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to Netlify**:
   - Drag and drop the `dist` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=dist`

3. **Custom Domain**: Add your domain in Netlify dashboard for automatic HTTPS.

### Option 3: GitHub Pages

1. **Add GitHub Pages workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. **Enable GitHub Pages** in repository settings.

### Option 4: Custom Server (Node.js/Express)

1. **Install dependencies**:
```bash
npm install express helmet
```

2. **Create server file** (`server.js`):
```javascript
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://telegram.org"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.telegram.org"]
    }
  }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

// HTTPS configuration
const httpsOptions = {
  key: fs.readFileSync('./certs/private-key.pem'),
  cert: fs.readFileSync('./certs/certificate.pem')
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
```

3. **Add to package.json**:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

## Telegram Web App Configuration

### 1. Bot Setup
1. Create a bot with [@BotFather](https://t.me/botfather)
2. Use `/newapp` command to create a web app
3. Set the web app URL to your deployed HTTPS URL

### 2. Environment Variables
Create `.env` file for production:
```env
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_APP_URL=https://your-domain.com
```

### 3. Security Considerations
- Always use HTTPS in production
- Implement proper CORS headers
- Use Content Security Policy (CSP)
- Validate Telegram Web App data
- Rate limit API endpoints

## SSL Certificate Management

### Let's Encrypt (Free)
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Commercial Certificates
- Purchase from providers like DigiCert, GlobalSign, etc.
- Follow their installation instructions

## Monitoring and Analytics

### 1. Add Google Analytics
```javascript
// In main.ts
if (import.meta.env.PROD) {
  // Google Analytics code
}
```

### 2. Error Tracking
```bash
npm install @sentry/vue
```

### 3. Performance Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Set up uptime monitoring

## Troubleshooting

### Common Issues

1. **Mixed Content Errors**: Ensure all resources use HTTPS
2. **CORS Issues**: Configure proper CORS headers
3. **Telegram Web App Not Loading**: Check bot configuration and URL
4. **SSL Certificate Errors**: Verify certificate installation

### Debug Commands
```bash
# Check SSL certificate
openssl s_client -connect your-domain.com:443

# Test HTTPS
curl -I https://your-domain.com

# Check security headers
curl -I -H "User-Agent: Mozilla/5.0" https://your-domain.com
```

## Performance Optimization

1. **Enable Gzip compression**
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Optimize images and assets**
5. **Use service workers for offline support**

## Backup and Recovery

1. **Regular backups** of your deployment
2. **Version control** for all configuration
3. **Documentation** of deployment procedures
4. **Rollback procedures** for quick recovery 