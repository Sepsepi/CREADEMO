# Setup Guide - CREA DDF Demo

Complete guide to get the demo running on your local machine.

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Docker Setup](#docker-setup)
4. [Troubleshooting](#troubleshooting)
5. [Next Steps](#next-steps)

---

## Quick Start

Get the demo running in 5 minutes:

```bash
# 1. Clone the repository
git clone <repository-url>
cd crea-ddf-demo

# 2. Start backend
cd backend
npm install
npm run dev

# 3. In a new terminal, start frontend
cd frontend
npm install
npm run dev

# 4. Open browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001/api/health
```

That's it! The app is now running with mock data.

---

## Detailed Setup

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

**Optional (for production):**
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Redis** 7+ ([Download](https://redis.io/download/))
- **Docker** ([Download](https://www.docker.com/))

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd crea-ddf-demo
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# (Optional) Edit .env if needed
nano .env

# Start development server
npm run dev
```

**Expected Output:**
```
🚀 CREA DDF API Server running on port 3001
📍 Health check: http://localhost:3001/api/health
🏠 Listings: http://localhost:3001/api/listings
📊 Statistics: http://localhost:3001/api/statistics

⚠️  Currently using MOCK data. For production, connect to real CREA DDF API.
```

**Test the API:**
```bash
# In a new terminal
curl http://localhost:3001/api/health

# Should return:
# {"status":"ok","message":"CREA DDF API is running","mode":"mock"}
```

### Step 3: Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# (Optional) Edit .env.local if backend is on different port
nano .env.local

# Start development server
npm run dev
```

**Expected Output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Linting and checking validity of types
event - compiled client and server successfully
```

### Step 4: Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/listings

You should see:
- Search interface with filters
- 30 mock property listings
- Grid and map view toggle
- Statistics dashboard

---

## Docker Setup

Run the entire stack with Docker Compose (easiest for production-like environment).

### Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop/))

### Steps

```bash
# 1. Navigate to project root
cd crea-ddf-demo

# 2. Build and start all services
docker-compose up -d

# 3. View logs (optional)
docker-compose logs -f

# 4. Check status
docker-compose ps
```

**Services Started:**
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 3001)
- Frontend (port 3000)

**Stop Services:**
```bash
docker-compose down
```

**Rebuild After Changes:**
```bash
docker-compose up -d --build
```

---

## Database Setup (Optional)

If you want to use a real PostgreSQL database instead of in-memory mock data:

### Step 1: Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql-15
sudo systemctl start postgresql
```

**Windows:**
Download and install from [PostgreSQL.org](https://www.postgresql.org/download/windows/)

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE crea_ddf;
CREATE USER crea_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE crea_ddf TO crea_user;

# Exit
\q
```

### Step 3: Run Migrations

```bash
# From project root
cd backend

# Run migration file
psql -U crea_user -d crea_ddf -f migrations/001_create_listings.sql
```

### Step 4: Update Backend Configuration

Edit `backend/.env`:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crea_ddf
DB_USER=crea_user
DB_PASSWORD=your_secure_password
```

### Step 5: Load Mock Data into Database

Create a seed script:

```bash
# backend/scripts/seed.js
const { Pool } = require('pg');
const mockData = require('../mock_listings.json');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function seed() {
  console.log('🌱 Seeding database...');

  for (const listing of mockData.listings) {
    await pool.query(
      `INSERT INTO listings (
        listing_key, list_price, street_address, city, province, postal_code,
        bedrooms_total, bathroom_total, property_type, property_subtype,
        listing_date, status, description, latitude, longitude,
        agent_name, brokerage_name, square_footage, year_built, parking_spaces
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      ON CONFLICT (listing_key) DO NOTHING`,
      [
        listing.ListingKey,
        listing.ListPrice,
        listing.StreetAddress,
        listing.City,
        listing.Province,
        listing.PostalCode,
        listing.BedroomsTotal,
        listing.BathroomTotal,
        listing.PropertyType,
        listing.PropertySubType,
        listing.ListingDate,
        listing.Status,
        listing.Description,
        listing.Latitude,
        listing.Longitude,
        listing.AgentName,
        listing.BrokerageName,
        listing.SquareFootage,
        listing.YearBuilt,
        listing.ParkingSpaces
      ]
    );
  }

  console.log('✅ Database seeded successfully');
  await pool.end();
}

seed().catch(console.error);
```

Run the seed:
```bash
node scripts/seed.js
```

---

## Troubleshooting

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find process using port
lsof -ti:3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3002 npm run dev
```

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Won't Start

**Error:** Various startup errors

**Solutions:**
1. Check Node.js version: `node --version` (should be 18+)
2. Check if port 3001 is available
3. Verify `.env` file exists
4. Check logs for specific error messages

### Frontend Shows API Error

**Error:** "Failed to fetch listings"

**Solutions:**
1. Ensure backend is running on port 3001
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Test API directly: `curl http://localhost:3001/api/health`
4. Check browser console for CORS errors

### Database Connection Error

**Error:** "ECONNREFUSED" or "authentication failed"

**Solutions:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check database credentials in `.env`
3. Ensure database exists: `psql -l`
4. Test connection: `psql -U crea_user -d crea_ddf`

---

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Backend: Automatically restarts on file changes (nodemon)
- Frontend: Automatically refreshes on file changes (Next.js)

### Debugging

**Backend:**
```bash
# Start with debugging
DEBUG=* npm run dev

# Or use VS Code debugger
# Add to .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/backend/server.js",
  "console": "integratedTerminal"
}
```

**Frontend:**
```bash
# Next.js debugging is built-in
# Just use browser DevTools
```

### API Testing

Use these tools to test the API:

**cURL:**
```bash
curl http://localhost:3001/api/listings?city=Toronto&minPrice=500000
```

**Postman/Insomnia:**
Import these endpoints:
- GET http://localhost:3001/api/listings
- GET http://localhost:3001/api/listings/:listingKey
- GET http://localhost:3001/api/cities
- GET http://localhost:3001/api/statistics

---

## Next Steps

After getting the demo running:

1. **Explore the Code**
   - Review `backend/server.js` for API logic
   - Check `frontend/pages/index.js` for UI
   - Examine database schema in `backend/migrations/`

2. **Customize**
   - Modify search filters
   - Add new property fields
   - Update UI styling

3. **Add Features**
   - Implement listing detail page
   - Add user authentication
   - Create saved searches

4. **Prepare for Production**
   - Read `CREA_INTEGRATION_NOTES.md`
   - Get CREA DDF credentials
   - Set up production database

5. **Deploy**
   - Deploy backend to Railway/Render
   - Deploy frontend to Vercel
   - Set up environment variables

---

## Additional Resources

- [README.md](../README.md) - Project overview
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [CREA_INTEGRATION_NOTES.md](CREA_INTEGRATION_NOTES.md) - Production guide

---

## Support

Having issues? Try:
1. Check this troubleshooting section
2. Review error messages carefully
3. Search for similar issues online
4. Contact: your.email@example.com

---

*Happy coding! 🚀*
