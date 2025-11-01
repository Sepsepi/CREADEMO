# CREA DDF API Documentation

Complete API reference for the CREA DDF Integration backend.

**Base URL:** `http://localhost:3001/api`

---

## Table of Contents
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Listings](#listings)
  - [Cities](#cities)
  - [Statistics](#statistics)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

**Current Version:** No authentication required (demo mode)

**Production:** Will require API key authentication
```http
Authorization: Bearer YOUR_API_KEY
```

---

## Endpoints

### Health Check

Check if the API is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "message": "CREA DDF API is running",
  "mode": "mock"
}
```

---

### Listings

#### Get All Listings

Retrieve listings with optional filters.

**Endpoint:** `GET /api/listings`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `city` | string | Filter by city name | `Toronto` |
| `minPrice` | number | Minimum listing price | `500000` |
| `maxPrice` | number | Maximum listing price | `1000000` |
| `beds` | number | Minimum bedrooms | `3` |
| `baths` | number | Minimum bathrooms | `2` |
| `propertyType` | string | Property type | `Detached`, `Condo`, `Townhouse`, `Semi-Detached` |
| `status` | string | Listing status (default: Active) | `Active`, `Sold`, `Pending` |
| `page` | number | Page number (default: 1) | `1` |
| `limit` | number | Results per page (default: 20) | `20` |
| `sortOrder` | string | Sort order (default: desc) | `asc`, `desc` |

**Example Request:**
```http
GET /api/listings?city=Toronto&minPrice=500000&maxPrice=1000000&beds=3&page=1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "ListingKey": "C8472659",
        "ListPrice": 1250000,
        "StreetAddress": "456 Queen Street West",
        "City": "Toronto",
        "Province": "ON",
        "PostalCode": "M5V 2A8",
        "BedroomsTotal": 3,
        "BathroomTotal": 2.5,
        "PropertyType": "Residential",
        "PropertySubType": "Condo",
        "ListingDate": "2025-01-15",
        "Status": "Active",
        "Photos": [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
        ],
        "Description": "Stunning 3-bedroom urban oasis...",
        "Latitude": 43.6532,
        "Longitude": -79.3832,
        "AgentName": "Sarah Mitchell",
        "BrokerageName": "Urban Realty Group",
        "SquareFootage": 1450,
        "YearBuilt": 2018,
        "ParkingSpaces": 1
      }
      // ... more listings
    ],
    "total": 45,
    "page": 1,
    "totalPages": 3
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to fetch listings",
  "message": "Error details here"
}
```

---

#### Get Single Listing

Retrieve detailed information for a specific listing.

**Endpoint:** `GET /api/listings/:listingKey`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `listingKey` | string | Yes | Unique listing identifier |

**Example Request:**
```http
GET /api/listings/C8472659
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "ListingKey": "C8472659",
    "ListPrice": 1250000,
    "StreetAddress": "456 Queen Street West",
    "City": "Toronto",
    "Province": "ON",
    "PostalCode": "M5V 2A8",
    "BedroomsTotal": 3,
    "BathroomTotal": 2.5,
    "PropertyType": "Residential",
    "PropertySubType": "Condo",
    "ListingDate": "2025-01-15",
    "Status": "Active",
    "Photos": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    "Description": "Stunning 3-bedroom urban oasis in the heart of downtown Toronto...",
    "Latitude": 43.6532,
    "Longitude": -79.3832,
    "AgentName": "Sarah Mitchell",
    "BrokerageName": "Urban Realty Group",
    "SquareFootage": 1450,
    "YearBuilt": 2018,
    "ParkingSpaces": 1
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Listing not found",
  "message": "No listing found with key: C8472659"
}
```

---

### Cities

#### Get All Cities

Retrieve list of all available cities with listings.

**Endpoint:** `GET /api/cities`

**Example Request:**
```http
GET /api/cities
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    "Brampton",
    "Burlington",
    "Hamilton",
    "Mississauga",
    "North York",
    "Oakville",
    "Oshawa",
    "Pickering",
    "Richmond Hill",
    "Toronto",
    "Whitby"
  ]
}
```

---

### Statistics

#### Get Listing Statistics

Retrieve statistics about available listings.

**Endpoint:** `GET /api/statistics`

**Example Request:**
```http
GET /api/statistics
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalListings": 30,
    "averagePrice": 965833,
    "minPrice": 385000,
    "maxPrice": 2250000,
    "citiesCount": 13,
    "propertyTypes": [
      "Condo",
      "Detached",
      "Semi-Detached",
      "Townhouse"
    ]
  }
}
```

---

## Error Handling

All endpoints return standardized error responses:

**Error Response Structure:**
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

**HTTP Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limiting

**Demo Mode:** No rate limiting

**Production:**
- 100 requests per 15 minutes per IP
- 429 status code when limit exceeded

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Data Model

### Listing Object

```typescript
interface Listing {
  ListingKey: string;           // Unique identifier
  ListPrice: number;            // Price in CAD
  StreetAddress: string;        // Street address
  City: string;                 // City name
  Province: string;             // Province code (ON, BC, etc.)
  PostalCode: string;           // Postal code
  BedroomsTotal: number;        // Number of bedrooms
  BathroomTotal: number;        // Number of bathrooms (can be decimal)
  PropertyType: string;         // "Residential", "Commercial", etc.
  PropertySubType: string;      // "Detached", "Condo", "Townhouse", etc.
  ListingDate: string;          // ISO date string
  Status: string;               // "Active", "Sold", "Pending", etc.
  Photos: string[];             // Array of photo URLs
  Description: string;          // Property description
  Latitude: number;             // Latitude coordinate
  Longitude: number;            // Longitude coordinate
  AgentName: string;            // Listing agent name
  BrokerageName: string;        // Brokerage name
  SquareFootage?: number;       // Optional - square footage
  YearBuilt?: number;           // Optional - year built
  ParkingSpaces?: number;       // Optional - number of parking spaces
}
```

---

## Examples

### Search for Condos in Toronto Under $1M
```bash
curl "http://localhost:3001/api/listings?city=Toronto&propertyType=Condo&maxPrice=1000000"
```

### Get All 3+ Bedroom Homes
```bash
curl "http://localhost:3001/api/listings?beds=3"
```

### Search by Price Range and Sort
```bash
curl "http://localhost:3001/api/listings?minPrice=500000&maxPrice=800000&sortOrder=asc"
```

### Get Specific Listing Details
```bash
curl "http://localhost:3001/api/listings/C8472659"
```

---

## Pagination Example

**Request Page 2 with 10 items:**
```http
GET /api/listings?page=2&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "listings": [...],
    "total": 45,
    "page": 2,
    "totalPages": 5
  }
}
```

**Navigation:**
- First page: `page=1`
- Next page: `page=3`
- Last page: `page=5`

---

## CORS Configuration

**Allowed Origins (Development):**
- `http://localhost:3000`
- `http://localhost:3001`

**Allowed Methods:**
- GET
- POST
- PUT
- DELETE
- OPTIONS

**Production:** Configure specific domains in `.env`

---

## Webhooks (Future Feature)

For production CREA DDF integration, webhooks can notify your application of:
- New listings
- Price changes
- Status updates (sold, pending)
- Listing removals

**Webhook Structure:**
```json
{
  "event": "listing.updated",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "listingKey": "C8472659",
    "changes": ["ListPrice"],
    "newPrice": 1200000,
    "oldPrice": 1250000
  }
}
```

---

## Support

For API support or questions:
- **Email:** your.email@example.com
- **Documentation:** Full docs in `/docs` folder
- **GitHub Issues:** [Report bugs](https://github.com/yourusername/crea-ddf-demo/issues)

---

*Last Updated: January 2025*
