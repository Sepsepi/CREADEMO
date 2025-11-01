# CREA DDF Integration Demo

🏠 **A modern real estate listing platform powered by CREA DDF API**

This is a full-stack demonstration project showcasing integration with the CREA DDF (Data Distribution Facility) system for Canadian MLS real estate listings.

![Demo Status](https://img.shields.io/badge/status-demo-blue)
![Stack](https://img.shields.io/badge/stack-MERN-green)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

---

## 🎯 What This Demonstrates

This project showcases a production-ready architecture for integrating with CREA DDF:

- ✅ **Full-stack real estate platform** - Backend API + Frontend UI
- ✅ **RESTful API design** - Clean, scalable endpoints for property data
- ✅ **Advanced search & filtering** - Price, location, bedrooms, bathrooms, property type
- ✅ **Responsive design** - Mobile-first UI built with Tailwind CSS
- ✅ **Map integration** - Ready for Mapbox integration (placeholder included)
- ✅ **Database schema** - PostgreSQL schema optimized for MLS data
- ✅ **Security best practices** - Environment variables, input validation, CORS
- ✅ **Caching strategy** - Redis-ready for performance optimization
- ✅ **Production-ready code** - Clean, documented, maintainable

---

## 🔧 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database for listing data
- **Redis** - Caching layer (ready to integrate)

### Frontend
- **Next.js** - React framework with SSR
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Mapbox GL** - Map integration (placeholder ready)

### Integration
- **RETS Client** - For production CREA DDF connection (ready to integrate)
- Currently using **mock data** that matches CREA DDF structure

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (optional for this demo)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd crea-ddf-demo
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend API will start on `http://localhost:3001`

### 3. Frontend Setup
```bash
# Open a new terminal
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Access the Application
Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **API Health Check**: http://localhost:3001/api/health
- **API Docs**: http://localhost:3001/api/listings

---

## 📁 Project Structure

```
crea-ddf-demo/
├── backend/                    # Node.js/Express API
│   ├── server.js              # Main server file
│   ├── mock_listings.json     # Mock CREA DDF data (30 listings)
│   ├── migrations/            # PostgreSQL database schema
│   │   └── 001_create_listings.sql
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # Next.js React app
│   ├── pages/
│   │   ├── index.js           # Home page with search
│   │   └── _app.js            # Next.js app wrapper
│   ├── components/
│   │   ├── SearchFilters.js   # Search interface
│   │   ├── ListingCard.js     # Property card component
│   │   └── MapView.js         # Map view component
│   ├── lib/
│   │   └── api.js             # API client functions
│   ├── styles/
│   │   └── globals.css        # Global styles + Tailwind
│   ├── package.json
│   └── .env.local.example
│
├── docs/                       # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── SETUP_GUIDE.md
│   └── CREA_INTEGRATION_NOTES.md
│
├── screenshots/                # Demo screenshots
├── docker-compose.yml          # Docker setup
└── README.md                   # This file
```

---

## 🎨 Features

### Current Features (Demo)
- ✅ Property search with multiple filters
- ✅ Grid and map view toggle
- ✅ Responsive design (mobile, tablet, desktop)
- ✅30 realistic mock MLS listings
- ✅ Property detail cards with photos
- ✅ Statistics dashboard
- ✅ Pagination support
- ✅ Clean, modern UI

### Ready for Production
- 🔄 Real CREA DDF/RETS integration
- 🔄 User authentication
- 🔄 Saved searches
- 🔄 Favorite listings
- 🔄 Agent contact forms
- 🔄 Email notifications
- 🔄 Advanced map with clustering
- 🔄 Photo galleries with lightbox
- 🔄 SEO optimization

---

## 🗄️ Database Schema

The PostgreSQL schema includes:

**Tables:**
- `listings` - Main property data
- `listing_photos` - Property images
- `agents` - Real estate agents
- `brokerages` - Brokerages information

**Key Features:**
- Full-text search support
- Optimized indexes for common queries
- JSONB for flexible feature storage
- Automatic timestamp updates
- Foreign key relationships

See `backend/migrations/001_create_listings.sql` for complete schema.

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Get Listings
```
GET /api/listings?city=Toronto&minPrice=500000&maxPrice=1000000&beds=3
```

**Query Parameters:**
- `city` - Filter by city name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `beds` - Minimum bedrooms
- `baths` - Minimum bathrooms
- `propertyType` - Property type (Detached, Condo, etc.)
- `page` - Page number (pagination)
- `limit` - Results per page
- `sortOrder` - Sort order (asc/desc)

### Get Single Listing
```
GET /api/listings/:listingKey
```

### Get Cities
```
GET /api/cities
```

### Get Statistics
```
GET /api/statistics
```

See `docs/API_DOCUMENTATION.md` for complete API reference.

---

## 📝 Note on CREA Credentials

⚠️ **This demo currently uses mock data** that matches the CREA DDF structure.

### For Production Deployment:

1. **Obtain CREA DDF Certification**
   - Join CREA as a member (~$500-1,000/year)
   - Complete CREA DDF training
   - Get approved by your local real estate board

2. **Get API Credentials**
   - Receive RETS login URL
   - Obtain username and password
   - Configure data feed permissions

3. **Update Configuration**
   - Replace `CREAClient` mock class in `server.js`
   - Integrate RETS library (`node-rets` or `rets-client`)
   - Add credentials to `.env` file
   - Enable automated data sync

4. **Compliance**
   - Follow CREA data usage policies
   - Implement data retention rules
   - Add required disclaimers
   - Set up automated updates (typically every 15 minutes)

See `docs/CREA_INTEGRATION_NOTES.md` for detailed integration guide.

---

## 🔐 Security Features

- ✅ Environment variables for sensitive data
- ✅ CORS configuration
- ✅ Input validation on filters
- ✅ SQL injection protection (using parameterized queries)
- ✅ Rate limiting ready (commented in code)
- ✅ HTTPS required for production
- ✅ Secure credential storage

---

## 🚢 Deployment

### Option 1: Docker (Recommended)
```bash
docker-compose up -d
```

### Option 2: Cloud Platforms

**Backend:**
- Railway.app (free tier available)
- Render.com (free tier available)
- Heroku
- AWS/GCP/Azure

**Frontend:**
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

**Database:**
- Supabase (free PostgreSQL)
- Railway
- AWS RDS
- DigitalOcean Managed Database

---

## 🎯 Next Steps for Production

1. **Integrate Real CREA DDF API**
   - Replace mock client with RETS connection
   - Test with live data
   - Set up automated sync

2. **Add User Features**
   - User authentication (Auth0, Firebase, or custom)
   - Saved searches
   - Favorite listings
   - Email alerts

3. **Enhance UI**
   - Real Mapbox integration with API key
   - Photo gallery with lightbox
   - Virtual tours support
   - Advanced filters (school districts, amenities, etc.)

4. **SEO & Performance**
   - Server-side rendering for listing pages
   - Sitemap generation
   - Meta tags optimization
   - Image optimization (Next.js Image component)
   - Implement Redis caching

5. **Agent Features**
   - Contact forms
   - Lead management
   - Showing requests
   - CRM integration

6. **Analytics**
   - Google Analytics
   - User behavior tracking
   - Search analytics
   - Performance monitoring

---

## 💰 CREA DDF Integration Costs

**Typical Costs:**
- CREA Membership: $500-1,000/year
- Board Fees: Varies by region ($500-2,000/year)
- Development Time: 1-2 weeks for full integration
- Maintenance: Ongoing (data sync, updates)

**What You Get:**
- Access to all MLS listings in your region
- Real-time data updates (every 15 min)
- Property photos
- Agent/brokerage information
- Historical sold data
- Market statistics

---

## 🛠️ Development

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Quality
```bash
# Linting
npm run lint

# Format code
npm run format
```

---

## 📸 Screenshots

![Home Page](screenshots/home-page.png)
![Search Results](screenshots/search-results.png)
![Map View](screenshots/map-view.png)
![Property Details](screenshots/property-details.png)

---

## 🤝 Contributing

This is a demo project. Feel free to fork and customize for your needs.

---

## 📄 License

MIT License - feel free to use this code for your projects.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

---

## 🙏 Acknowledgments

- CREA for the DDF API specification
- Real estate data structure based on RESO standards
- Mock data generated for demonstration purposes
- Built with modern web technologies

---

## 📞 Contact

For questions about this demo or CREA DDF integration services:

**Email:** your.email@example.com
**LinkedIn:** [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

**Built with ❤️ for the CREA DDF Integration Project**

*This demo showcases my ability to build production-ready real estate platforms with CREA DDF integration. Ready to discuss bringing this to production with real MLS data!*
