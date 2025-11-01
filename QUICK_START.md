# Quick Start Guide

Get the CREA DDF demo running in **5 minutes**.

---

## Prerequisites

- Node.js 18+ installed
- npm installed
- Git installed

---

## Steps

### 1. Clone & Setup (2 min)

```bash
# Clone the repo
git clone <your-repo-url>
cd crea-ddf-demo
```

### 2. Start Backend (1 min)

```bash
# Terminal 1
cd backend
npm install
npm run dev
```

Wait for: `🚀 CREA DDF API Server running on port 3001`

### 3. Start Frontend (1 min)

```bash
# Terminal 2 (new terminal)
cd frontend
npm install
npm run dev
```

Wait for: `ready - started server on 0.0.0.0:3000`

### 4. Open Browser (1 min)

Navigate to: **http://localhost:3000**

✅ **Done!** You should see the property search interface.

---

## Quick Test

Try these searches:

1. **Search by City:** Select "Toronto" from dropdown → Click "Search Properties"
2. **Filter by Price:** Set Min: $500,000, Max: $1,000,000 → Search
3. **Toggle Views:** Click "Map View" button to see properties on map
4. **View Details:** Click "View Details" on any property card

---

## What You're Seeing

- **30 realistic mock listings** across Ontario
- **Working search filters** (city, price, beds, baths, type)
- **Grid and map views**
- **Responsive design** (try resizing your browser)
- **Statistics dashboard** (total listings, avg price, cities)

---

## What's Running

- **Frontend:** http://localhost:3000 (Next.js)
- **Backend API:** http://localhost:3001 (Express)
- **Health Check:** http://localhost:3001/api/health

---

## API Examples

Try these in your browser or terminal:

```bash
# Get all listings
curl http://localhost:3001/api/listings

# Search Toronto properties
curl "http://localhost:3001/api/listings?city=Toronto"

# Filter by price
curl "http://localhost:3001/api/listings?minPrice=500000&maxPrice=1000000"

# Get statistics
curl http://localhost:3001/api/statistics

# Get cities
curl http://localhost:3001/api/cities
```

---

## Next Steps

### Explore the Code
- `backend/server.js` - API logic
- `backend/mock_listings.json` - Mock data (30 listings)
- `frontend/pages/index.js` - Main search page
- `frontend/components/` - React components

### Read Documentation
- `README.md` - Full project overview
- `docs/SETUP_GUIDE.md` - Detailed setup
- `docs/API_DOCUMENTATION.md` - API reference
- `docs/CREA_INTEGRATION_NOTES.md` - Production guide

### Customize
- Change listings data in `backend/mock_listings.json`
- Modify search filters in `frontend/components/SearchFilters.js`
- Update styling in `frontend/styles/globals.css`

---

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

**Module not found?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API not responding?**
- Make sure backend is running (Terminal 1)
- Check http://localhost:3001/api/health
- Look for errors in Terminal 1

---

## Docker Alternative

If you prefer Docker:

```bash
docker-compose up -d
```

This starts:
- Backend on port 3001
- Frontend on port 3000
- PostgreSQL on port 5432
- Redis on port 6379

---

## Questions?

- Check `docs/SETUP_GUIDE.md` for detailed troubleshooting
- Review error messages in terminal
- Contact: your.email@example.com

---

**Enjoy exploring the demo!** 🚀
