# CREA DDF Integration Guide

Complete guide for transitioning from mock data to production CREA DDF integration.

---

## Table of Contents
1. [What is CREA DDF?](#what-is-crea-ddf)
2. [Prerequisites](#prerequisites)
3. [Getting Credentials](#getting-credentials)
4. [Technical Integration](#technical-integration)
5. [Data Sync Strategy](#data-sync-strategy)
6. [Compliance & Rules](#compliance--rules)
7. [Testing](#testing)
8. [Going Live](#going-live)

---

## What is CREA DDF?

**CREA DDF (Data Distribution Facility)** is Canada's national system for distributing MLS (Multiple Listing Service) real estate data.

### Key Features:
- **Real-time data**: Updates every 15 minutes
- **Comprehensive**: Property details, photos, agent info, sold data
- **Standardized**: Uses RETS (Real Estate Transaction Standard) protocol
- **Secure**: Requires authentication and certification
- **Regulated**: Strict usage rules and compliance requirements

### What You Get:
- Active listings
- Sold listings (historical data)
- Property photos (high-resolution)
- Agent and brokerage information
- Property status updates
- Price changes
- Virtual tour links
- Document links

---

## Prerequisites

### 1. Membership Requirements
You need one of the following:

**Option A: Real Estate Professional**
- Licensed real estate agent or broker
- Member of local real estate board
- CREA member

**Option B: Technology Provider**
- Partner with a real estate brokerage
- Get VOW (Virtual Office Website) certification
- Sign CREA VOW agreement

**Option C: Property Portal**
- Become a CREA-certified data recipient
- Meet technical and legal requirements
- Ongoing compliance audits

### 2. Costs (Approximate)
- **CREA Membership**: $500-1,000/year
- **Local Board Fees**: $500-2,000/year (varies by region)
- **VOW Certification**: $1,000-3,000 (one-time)
- **Technical Integration**: 40-80 hours of development
- **Ongoing Maintenance**: Monthly updates and compliance

### 3. Legal Requirements
- Sign CREA data license agreement
- Agree to data usage policies
- Implement required disclaimers
- Respect copyright and ownership
- Follow data retention rules

---

## Getting Credentials

### Step 1: Join CREA
1. Visit [CREA.ca](https://www.crea.ca)
2. Apply for membership (if eligible)
3. Complete required training
4. Pay membership fees

### Step 2: Get Board Approval
1. Contact your local real estate board
2. Request CREA DDF access
3. Complete technical questionnaire
4. Submit integration plan
5. Wait for approval (2-4 weeks typically)

### Step 3: Receive Credentials
You'll receive:
- **RETS Login URL**: `https://[your-board].rets.com/login`
- **Username**: Your unique identifier
- **Password**: Secure credential
- **Data Dictionary**: Field mappings and documentation
- **Testing Environment**: Sandbox credentials

---

## Technical Integration

### Architecture Overview

```
Your Application
       ↓
  RETS Client Library
       ↓
  CREA DDF RETS Server
       ↓
  Local Board MLS System
```

### Step 1: Choose RETS Library

**Node.js:**
```bash
npm install rets-client
# or
npm install node-rets
```

**Python:**
```bash
pip install rets
```

**PHP:**
```bash
composer require troydavisson/phrets
```

### Step 2: Replace Mock Client

**Current (Mock):**
```javascript
// backend/server.js
class CREAClient {
  async getListings(filters = {}) {
    const mockData = require('./mock_listings.json');
    return mockData.listings;
  }
}
```

**Production (Real RETS):**
```javascript
// backend/lib/CREAClient.js
const RetsClient = require('rets-client');

class CREAClient {
  constructor() {
    this.client = new RetsClient({
      loginUrl: process.env.CREA_LOGIN_URL,
      username: process.env.CREA_USERNAME,
      password: process.env.CREA_PASSWORD,
      version: 'RETS/1.7.2',
      userAgent: 'YourApp/1.0',
      method: 'GET'
    });
  }

  async connect() {
    try {
      await this.client.login();
      console.log('✅ Connected to CREA DDF');
    } catch (error) {
      console.error('❌ CREA connection failed:', error);
      throw error;
    }
  }

  async getListings(filters = {}) {
    try {
      // Build DMQL query (Data Model Query Language)
      const query = this.buildQuery(filters);

      const results = await this.client.search({
        searchType: 'Property',
        class: 'ResidentialProperty',
        query: query,
        limit: filters.limit || 100,
        offset: filters.offset || 0
      });

      return this.transformResults(results);
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  }

  buildQuery(filters) {
    const conditions = [];

    // Status (active listings only by default)
    conditions.push('(Status=|Active)');

    // Price range
    if (filters.minPrice) {
      conditions.push(`(ListPrice=${filters.minPrice}+)`);
    }
    if (filters.maxPrice) {
      conditions.push(`(ListPrice=${filters.maxPrice}-)`);
    }

    // City
    if (filters.city) {
      conditions.push(`(City=${filters.city})`);
    }

    // Bedrooms
    if (filters.beds) {
      conditions.push(`(BedroomsTotal=${filters.beds}+)`);
    }

    // Bathrooms
    if (filters.baths) {
      conditions.push(`(BathroomsTotalInteger=${filters.baths}+)`);
    }

    // Property type
    if (filters.propertyType) {
      conditions.push(`(PropertySubType=${filters.propertyType})`);
    }

    return conditions.join(',');
  }

  transformResults(results) {
    // Transform RETS data to your application format
    return results.rows.map(row => ({
      ListingKey: row.ListingKey,
      ListPrice: parseFloat(row.ListPrice),
      StreetAddress: row.UnparsedAddress,
      City: row.City,
      Province: row.StateOrProvince,
      PostalCode: row.PostalCode,
      BedroomsTotal: parseInt(row.BedroomsTotal),
      BathroomTotal: parseFloat(row.BathroomsTotalDecimal),
      PropertyType: row.PropertyType,
      PropertySubType: row.PropertySubType,
      ListingDate: row.ListingContractDate,
      Status: row.StandardStatus,
      Description: row.PublicRemarks,
      Latitude: parseFloat(row.Latitude),
      Longitude: parseFloat(row.Longitude),
      AgentName: row.ListAgentFullName,
      BrokerageName: row.ListOfficeName,
      SquareFootage: parseInt(row.LivingArea),
      YearBuilt: parseInt(row.YearBuilt),
      ParkingSpaces: parseInt(row.ParkingTotal)
    }));
  }

  async getPhotos(listingKey) {
    try {
      const photos = await this.client.getObject({
        type: 'Photo',
        id: listingKey
      });

      return photos.map((photo, index) => ({
        url: photo.url,
        order: index,
        isPrimary: index === 0
      }));
    } catch (error) {
      console.error('Error fetching photos:', error);
      return [];
    }
  }

  async disconnect() {
    try {
      await this.client.logout();
      console.log('✅ Disconnected from CREA DDF');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

module.exports = CREAClient;
```

### Step 3: Update Environment Variables

**.env**
```bash
# CREA DDF Credentials
CREA_LOGIN_URL=https://your-board.rets.com/login
CREA_USERNAME=your_username
CREA_PASSWORD=your_secure_password

# RETS Configuration
CREA_USER_AGENT=YourApp/1.0
CREA_VERSION=RETS/1.7.2
```

### Step 4: Implement Error Handling

```javascript
class CREAClient {
  async getListings(filters) {
    try {
      // Check if session is still valid
      if (!this.client.isLoggedIn()) {
        await this.connect();
      }

      const results = await this.client.search({...});
      return this.transformResults(results);

    } catch (error) {
      if (error.code === 'UNAUTHORIZED') {
        // Re-authenticate
        await this.connect();
        return this.getListings(filters); // Retry
      }

      if (error.code === 'RATE_LIMIT') {
        // Wait and retry
        await this.sleep(5000);
        return this.getListings(filters);
      }

      throw error;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## Data Sync Strategy

### Option 1: Real-Time (Recommended for Public Sites)

Pull data every 15 minutes (CREA requirement):

```javascript
// backend/jobs/syncListings.js
const CronJob = require('cron').CronJob;
const CREAClient = require('../lib/CREAClient');
const db = require('../lib/database');

class ListingSyncJob {
  constructor() {
    this.client = new CREAClient();

    // Run every 15 minutes
    this.job = new CronJob('*/15 * * * *', async () => {
      await this.sync();
    });
  }

  async sync() {
    console.log('🔄 Starting CREA DDF sync...');

    try {
      await this.client.connect();

      // Get listings modified in last 30 minutes
      const modifiedSince = new Date(Date.now() - 30 * 60 * 1000);

      const listings = await this.client.getListings({
        modifiedAfter: modifiedSince
      });

      console.log(`📥 Received ${listings.length} listings`);

      // Update database
      for (const listing of listings) {
        await this.upsertListing(listing);
      }

      console.log('✅ Sync complete');
    } catch (error) {
      console.error('❌ Sync failed:', error);
      // Send alert to monitoring system
    } finally {
      await this.client.disconnect();
    }
  }

  async upsertListing(listing) {
    // Insert or update listing in database
    await db.query(`
      INSERT INTO listings (listing_key, list_price, city, ...)
      VALUES ($1, $2, $3, ...)
      ON CONFLICT (listing_key)
      DO UPDATE SET
        list_price = EXCLUDED.list_price,
        updated_at = NOW()
    `, [listing.ListingKey, listing.ListPrice, ...]);
  }

  start() {
    this.job.start();
    console.log('✅ Listing sync job started');
  }
}

module.exports = ListingSyncJob;
```

**Start the job:**
```javascript
// backend/server.js
const ListingSyncJob = require('./jobs/syncListings');

const syncJob = new ListingSyncJob();
syncJob.start();
```

### Option 2: On-Demand (For Internal Tools)

Fetch data when users search:

```javascript
// backend/routes/listings.js
app.get('/api/listings', async (req, res) => {
  const creaClient = new CREAClient();

  try {
    await creaClient.connect();
    const listings = await creaClient.getListings(req.query);

    res.json({
      success: true,
      data: listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    await creaClient.disconnect();
  }
});
```

---

## Compliance & Rules

### CREA Data Usage Rules

1. **Data Display Requirements**
   - Must show "MLS®" logo
   - Include listing brokerage name
   - Display listing agent name
   - Show "Last updated: [timestamp]"

2. **Photo Usage**
   - Download and cache photos (don't hotlink)
   - Respect photo ownership
   - Remove photos when listing is removed

3. **Data Retention**
   - Remove sold listings after 90 days
   - Remove expired listings immediately
   - Keep logs for audit purposes

4. **Prohibited Actions**
   - ❌ Don't share raw data with third parties
   - ❌ Don't scrape or aggregate without permission
   - ❌ Don't display data from multiple boards (unless licensed)
   - ❌ Don't use data for non-real-estate purposes

5. **Required Disclaimers**
```
"The listing data is deemed reliable but is not guaranteed accurate by the MLS®"
"MLS®, REALTOR®, and the associated logos are trademarks of The Canadian Real Estate Association"
```

### Implement Compliance

```javascript
// components/ListingCard.js
<div className="disclaimer text-xs text-gray-500 mt-2">
  <img src="/mls-logo.png" alt="MLS®" className="h-4 inline mr-1" />
  Listed by {listing.BrokerageName}
  <br />
  Last updated: {formatDate(listing.ModificationTimestamp)}
</div>
```

---

## Testing

### 1. Test Environment

Most boards provide a sandbox:

```bash
# .env.test
CREA_LOGIN_URL=https://test.rets.com/login
CREA_USERNAME=test_user
CREA_PASSWORD=test_pass
```

### 2. Integration Tests

```javascript
// tests/crea-client.test.js
const CREAClient = require('../lib/CREAClient');

describe('CREA Client', () => {
  let client;

  beforeAll(async () => {
    client = new CREAClient();
    await client.connect();
  });

  test('should fetch listings', async () => {
    const listings = await client.getListings({ city: 'Toronto' });
    expect(listings.length).toBeGreaterThan(0);
    expect(listings[0]).toHaveProperty('ListingKey');
  });

  test('should fetch photos', async () => {
    const listings = await client.getListings({ limit: 1 });
    const photos = await client.getPhotos(listings[0].ListingKey);
    expect(photos.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await client.disconnect();
  });
});
```

### 3. Data Validation

```javascript
function validateListing(listing) {
  const required = [
    'ListingKey',
    'ListPrice',
    'City',
    'Province'
  ];

  for (const field of required) {
    if (!listing[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (listing.ListPrice <= 0) {
    throw new Error('Invalid price');
  }

  return true;
}
```

---

## Going Live

### Pre-Launch Checklist

- [ ] CREA credentials configured
- [ ] Test with sandbox environment
- [ ] Database schema matches RETS fields
- [ ] Photo download and storage implemented
- [ ] Sync job running every 15 minutes
- [ ] Error handling and logging in place
- [ ] MLS® logo and disclaimers added
- [ ] Compliance rules implemented
- [ ] Performance tested (can handle peak load)
- [ ] Monitoring and alerts configured
- [ ] Backup strategy in place

### Launch Steps

1. **Switch to Production Credentials**
   ```bash
   # .env.production
   CREA_LOGIN_URL=https://live.rets.com/login
   CREA_USERNAME=production_user
   CREA_PASSWORD=production_pass
   ```

2. **Initial Data Load**
   ```bash
   npm run sync:initial
   ```

3. **Start Cron Job**
   ```bash
   npm run start:jobs
   ```

4. **Monitor First 24 Hours**
   - Check sync logs
   - Verify data accuracy
   - Monitor API performance
   - Watch for errors

5. **Notify CREA**
   - Inform CREA of go-live date
   - Provide production URL
   - Schedule compliance audit

---

## Troubleshooting

### Common Issues

**Issue: Authentication Failed**
```
Error: Login failed (401)
```
**Solution:**
- Verify credentials in .env
- Check if password expired
- Confirm IP is whitelisted

**Issue: Rate Limiting**
```
Error: Too many requests (429)
```
**Solution:**
- Implement exponential backoff
- Cache responses
- Reduce sync frequency

**Issue: Missing Fields**
```
Error: Property 'Latitude' is undefined
```
**Solution:**
- Check RETS data dictionary
- Not all fields are guaranteed
- Use optional chaining: `row.Latitude || null`

---

## Support Resources

- **CREA Support**: support@crea.ca
- **RETS Specification**: https://www.reso.org/rets-specifications/
- **CREA Developer Portal**: https://developer.crea.ca
- **Local Board Tech Support**: Contact your board

---

## Estimated Timeline

| Task | Duration |
|------|----------|
| Get CREA credentials | 2-4 weeks |
| Development (RETS integration) | 1-2 weeks |
| Testing with sandbox | 3-5 days |
| Code review & QA | 2-3 days |
| Production deployment | 1 day |
| Monitoring & refinement | Ongoing |

**Total: 5-7 weeks** from application to production

---

*This guide provides a comprehensive roadmap for CREA DDF integration. For questions, contact your CREA representative or your local real estate board.*
