# Re:Forma - Telegram Web App

A modern Telegram Web App built with Vue.js 3, featuring a comprehensive profile management system and beautiful UI design.

## 🚀 Live Demo

The app is automatically deployed to GitHub Pages: [https://yourusername.github.io/miniapp/](https://yourusername.github.io/miniapp/)

## 📱 Features

- **Telegram Integration**: Seamless integration with Telegram Web App API
- **Profile Management**: Comprehensive user profile with physical and mental health tracking
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Data**: Fetches profile data from your backend API
- **HTTPS Support**: Secure local development with self-signed certificates

## 🛠 Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript development
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Vite** - Fast build tool and dev server
- **Telegram Web App API** - Integration with Telegram

## 📁 Project Structure

```
miniapp/
├── src/
│   ├── components/     # Reusable Vue components
│   ├── views/         # Page components
│   ├── composables/   # Vue composables (useTelegram)
│   ├── services/      # API services
│   ├── router/        # Vue Router configuration
│   └── style.css      # Global styles
├── .github/workflows/ # GitHub Actions for deployment
├── scripts/          # Build and certificate scripts
└── certs/           # SSL certificates for local HTTPS
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/miniapp.git
   cd miniapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate SSL certificates for HTTPS**
   ```bash
   npm run generate-certs
   ```

4. **Start development server**
   ```bash
   # HTTP (port 3000)
   npm run dev
   
   # HTTPS (port 3000)
   npm run dev:https
   ```

5. **Open in browser**
   - HTTP: http://localhost:3000
   - HTTPS: https://localhost:3000

## 🏗 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🌐 GitHub Pages Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

2. **Update the base URL** in `vite.config.ts`:
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/'
   ```

3. **Push to main branch** - The workflow will automatically:
   - Build the project
   - Deploy to GitHub Pages
   - Make it available at `https://yourusername.github.io/your-repo-name/`

### Manual Deployment

If you need to deploy manually:

```bash
npm run build
# Upload dist/ folder to your web server
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for environment-specific settings:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### API Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
```

## 📱 Telegram Web App Integration

The app integrates with Telegram Web App API to:

- Fetch user information (avatar, username, etc.)
- Adapt to Telegram's theme (light/dark mode)
- Handle Telegram-specific UI behaviors

### Development Mode

When not running inside Telegram, the app uses mock data for development.

## 🎨 Design System

The app uses CSS custom properties for consistent theming:

```css
:root {
  --primary-bg: #1a1a1a;
  --secondary-bg: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --accent-green: #4CAF50;
  --accent-yellow: #FFC107;
  --border-color: #404040;
  --card-bg: #333333;
}
```

## 🔒 Security

- HTTPS support for local development
- Secure API communication
- Input validation and sanitization
- No sensitive data stored in localStorage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/miniapp/issues) page
2. Create a new issue with detailed information
3. Include browser console logs and steps to reproduce

## 🔄 Updates

The app automatically updates when you push to the main branch. GitHub Actions will:

1. Build the project
2. Run tests (if configured)
3. Deploy to GitHub Pages
4. Update the live site

---

Built with ❤️ using Vue.js 3 and modern web technologies. 