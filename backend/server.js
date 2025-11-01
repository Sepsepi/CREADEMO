const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock CREA DDF Client
// In production, this would connect to real CREA DDF via RETS protocol
class CREAClient {
  constructor() {
    // Load mock data
    const mockDataPath = path.join(__dirname, 'mock_listings.json');
    const data = fs.readFileSync(mockDataPath, 'utf8');
    this.mockData = JSON.parse(data);
  }

  /**
   * Get listings with filters
   * @param {Object} filters - Search filters (minPrice, maxPrice, city, beds, etc.)
   * @returns {Array} Filtered listings
   */
  async getListings(filters = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...this.mockData.listings];

    // Apply price filters
    if (filters.minPrice) {
      const minPrice = parseInt(filters.minPrice);
      filtered = filtered.filter(l => l.ListPrice >= minPrice);
    }

    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      filtered = filtered.filter(l => l.ListPrice <= maxPrice);
    }

    // Apply city filter
    if (filters.city) {
      filtered = filtered.filter(l =>
        l.City.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Apply bedrooms filter
    if (filters.beds) {
      const beds = parseInt(filters.beds);
      filtered = filtered.filter(l => l.BedroomsTotal >= beds);
    }

    // Apply bathrooms filter
    if (filters.baths) {
      const baths = parseFloat(filters.baths);
      filtered = filtered.filter(l => l.BathroomTotal >= baths);
    }

    // Apply property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(l =>
        l.PropertySubType.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    // Apply status filter (default to Active only)
    const status = filters.status || 'Active';
    filtered = filtered.filter(l => l.Status === status);

    // Sort by price (default: highest first)
    const sortOrder = filters.sortOrder || 'desc';
    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.ListPrice - b.ListPrice;
      }
      return b.ListPrice - a.ListPrice;
    });

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedResults = filtered.slice(startIndex, endIndex);

    return {
      listings: paginatedResults,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit)
    };
  }

  /**
   * Get single listing by ListingKey
   * @param {string} listingKey - Unique listing identifier
   * @returns {Object|null} Listing details or null if not found
   */
  async getListingDetails(listingKey) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const listing = this.mockData.listings.find(l => l.ListingKey === listingKey);
    return listing || null;
  }

  /**
   * Get unique cities from listings
   * @returns {Array} Array of city names
   */
  async getCities() {
    const cities = [...new Set(this.mockData.listings.map(l => l.City))];
    return cities.sort();
  }

  /**
   * Get property statistics
   * @returns {Object} Statistics about listings
   */
  async getStatistics() {
    const listings = this.mockData.listings;
    const prices = listings.map(l => l.ListPrice);

    return {
      totalListings: listings.length,
      averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      citiesCount: [...new Set(listings.map(l => l.City))].length,
      propertyTypes: [...new Set(listings.map(l => l.PropertySubType))]
    };
  }
}

// Initialize CREA client
const creaClient = new CREAClient();

// Routes

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CREA DDF API is running',
    mode: 'mock' // In production, this would be 'live'
  });
});

/**
 * GET /api/listings
 * Get listings with optional filters
 * Query params: minPrice, maxPrice, city, beds, baths, propertyType, page, limit, sortOrder
 */
app.get('/api/listings', async (req, res) => {
  try {
    const filters = {
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      city: req.query.city,
      beds: req.query.beds,
      baths: req.query.baths,
      propertyType: req.query.propertyType,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
      sortOrder: req.query.sortOrder
    };

    const result = await creaClient.getListings(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listings',
      message: error.message
    });
  }
});

/**
 * GET /api/listings/:listingKey
 * Get detailed information for a single listing
 */
app.get('/api/listings/:listingKey', async (req, res) => {
  try {
    const { listingKey } = req.params;
    const listing = await creaClient.getListingDetails(listingKey);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found',
        message: `No listing found with key: ${listingKey}`
      });
    }

    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Error fetching listing details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listing details',
      message: error.message
    });
  }
});

/**
 * GET /api/cities
 * Get list of all available cities
 */
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await creaClient.getCities();

    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cities',
      message: error.message
    });
  }
});

/**
 * GET /api/statistics
 * Get statistics about listings
 */
app.get('/api/statistics', async (req, res) => {
  try {
    const stats = await creaClient.getStatistics();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 CREA DDF API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Listings: http://localhost:${PORT}/api/listings`);
  console.log(`📊 Statistics: http://localhost:${PORT}/api/statistics\n`);
  console.log(`⚠️  Currently using MOCK data. For production, connect to real CREA DDF API.\n`);
});
