# ShamBit Frontend

A Next.js frontend application for ShamBit - India's premier spiritual travel platform. Experience sacred journeys through curated destinations, packages, and cultural immersion.

![ShamBit Logo](https://img.shields.io/badge/ShamBit-Spiritual%20Travel-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🕉️ About ShamBit

ShamBit connects travelers with India's spiritual heritage through:
- **Sacred Cities**: Ayodhya, Varanasi, Rishikesh, Haridwar, Mathura, Vrindavan
- **Context-Aware Content**: Dynamic content based on selected destinations
- **Custom Packages**: Modular travel experiences with hotels, transport, and guides
- **Cultural Immersion**: Articles, guides, and authentic local experiences

## ✨ Features

### 🎨 Sacred Design System
- **Apple-inspired minimalism** with Indian spiritual elements
- **Sacred Premium Palette**: Deep Saffron, Temple Gold, Ivory White, Midnight Blue
- **Typography**: Playfair Display (headings) + Inter (body text)
- **Smooth animations** with Framer Motion

### 🏠 Homepage Sections
- ✅ **Hero with City Selector** - Dynamic city selection
- ✅ **"How It Works"** - 3-step process
- ✅ **Services** - Comprehensive travel services
- ✅ **Featured Cities** - Context-aware city display
- ✅ **Featured Packages** - Dynamic package listings
- ✅ **Latest Articles** - Content based on selected city

### 🔌 Real API Integration
- **No dummy data** - All content from Django REST API
- **City-Context Awareness** - Content adapts to selected city
- **TypeScript interfaces** for all data models
- **Error handling** and loading states

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- ShamBit Backend API running (see [backend repo](https://github.com/amitkumarupadhyay1/shambit_travels_api_backend))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/amitkumarupadhyay1/shambit_travels_frontend.git
cd shambit_travels_frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run test-backend # Test API connectivity
```

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles & design system
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/          # React components
│   ├── layout/         # Header, Footer
│   ├── home/           # Homepage sections
│   └── common/         # Shared components
├── lib/                # Utilities and API
│   ├── api.ts          # API service layer
│   └── utils.ts        # Helper functions
└── styles/             # Additional styles
```

## 🎨 Design System

### Colors (Sacred Premium Palette)
```css
--color-primary-saffron: #D97706;  /* Spiritual warmth */
--color-primary-gold: #C9A227;     /* Divine elegance */
--color-primary-ivory: #FAF7F0;    /* Calm background */
--color-primary-midnight: #0F172A; /* Luxury contrast */
```

### Typography
- **Headings**: Playfair Display (mythological grandeur)
- **Body**: Inter (Apple-like cleanliness)
- **Accent**: Noto Serif Devanagari (Sanskrit feel)

### Animations
- **Duration**: 0.6s ease-out
- **Style**: Graceful, slow, premium feel
- **Library**: Framer Motion

## 🔗 API Integration

### Backend Connection
The frontend connects to the Django REST API:

```typescript
// Development
NEXT_PUBLIC_API_URL=http://localhost:8000/api

// Production
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Key Endpoints
- `GET /api/cities/` - List all cities
- `GET /api/articles/` - List articles
- `GET /api/packages/packages/` - List packages
- `GET /api/packages/experiences/` - List experiences

## 🌍 Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=ShamBit
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Contact Information
NEXT_PUBLIC_SUPPORT_EMAIL=support@shambit.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919005457111

# Social Media
NEXT_PUBLIC_FACEBOOK_URL=https://fb.com/shambitofficial
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/shambitofficial
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Other Platforms
- **Netlify**: Static site deployment
- **AWS S3 + CloudFront**: Custom deployment
- **Railway**: Full-stack deployment

## 🧪 Testing

### Backend Connectivity
```bash
npm run test-backend
```

### Manual Testing
1. Visit homepage at `http://localhost:3000`
2. Test city selector dropdown
3. Verify context-aware content changes
4. Check responsive design on mobile

## 📱 Features by Section

### Hero Section
- City selector with real API data
- Context switching for entire site
- Smooth animations and transitions

### City-Context Awareness
When a city is selected, all sections adapt:
- **Articles**: Show city-specific content
- **Packages**: Filter by selected city
- **Images**: Display relevant visuals

### Package Builder (Future)
- Modular component system
- Real-time pricing
- Custom itinerary creation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to ShamBit.

## 🔗 Related Repositories

- **Backend API**: [shambit_travels_api_backend](https://github.com/amitkumarupadhyay1/shambit_travels_api_backend)

## 📞 Support

- **Email**: support@shambit.com
- **WhatsApp**: +91 9005457111
- **Social**: [@shambitofficial](https://instagram.com/shambitofficial)

---

**Built with ❤️ for India's spiritual heritage**