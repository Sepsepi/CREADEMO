-- CREA DDF Listings Database Schema
-- This schema is designed to store MLS listing data from CREA DDF feed

-- Drop existing tables if they exist
DROP TABLE IF EXISTS listing_photos CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS brokerages CASCADE;

-- Brokerages table
CREATE TABLE brokerages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agents table
CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  brokerage_id INTEGER REFERENCES brokerages(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Main listings table
CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  listing_key VARCHAR(50) UNIQUE NOT NULL,

  -- Pricing
  list_price DECIMAL(12,2) NOT NULL,
  original_price DECIMAL(12,2),

  -- Location
  street_address VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  province VARCHAR(2) NOT NULL,
  postal_code VARCHAR(10),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),

  -- Property Details
  property_type VARCHAR(50) NOT NULL,
  property_subtype VARCHAR(50),
  bedrooms_total INT,
  bedrooms_above_grade INT,
  bathroom_total DECIMAL(3,1),
  square_footage INT,
  lot_size DECIMAL(10,2),
  year_built INT,

  -- Parking & Amenities
  parking_spaces INT DEFAULT 0,
  parking_type VARCHAR(100),

  -- Listing Information
  listing_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  days_on_market INT,
  description TEXT,

  -- Agent & Brokerage (foreign keys)
  agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
  agent_name VARCHAR(255), -- Denormalized for quick access
  brokerage_id INTEGER REFERENCES brokerages(id) ON DELETE SET NULL,
  brokerage_name VARCHAR(255), -- Denormalized for quick access

  -- Additional Features
  features JSONB, -- Stores array of features (fireplace, pool, etc.)
  amenities JSONB, -- Building amenities for condos

  -- Metadata
  last_modified TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Search optimization
  search_vector tsvector
);

-- Listing photos table (one-to-many relationship)
CREATE TABLE listing_photos (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_order INT DEFAULT 0,
  caption TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance

-- Listing key (unique identifier from CREA DDF)
CREATE UNIQUE INDEX idx_listing_key ON listings(listing_key);

-- Location-based searches
CREATE INDEX idx_city ON listings(city);
CREATE INDEX idx_province ON listings(province);
CREATE INDEX idx_postal_code ON listings(postal_code);
CREATE INDEX idx_location ON listings(latitude, longitude);

-- Price-based searches
CREATE INDEX idx_list_price ON listings(list_price);

-- Property characteristics
CREATE INDEX idx_bedrooms ON listings(bedrooms_total);
CREATE INDEX idx_bathrooms ON listings(bathroom_total);
CREATE INDEX idx_property_type ON listings(property_type);
CREATE INDEX idx_property_subtype ON listings(property_subtype);
CREATE INDEX idx_square_footage ON listings(square_footage);

-- Status and date filters
CREATE INDEX idx_status ON listings(status);
CREATE INDEX idx_listing_date ON listings(listing_date);

-- Agent and brokerage lookups
CREATE INDEX idx_agent_id ON listings(agent_id);
CREATE INDEX idx_brokerage_id ON listings(brokerage_id);

-- Full-text search index
CREATE INDEX idx_search_vector ON listings USING gin(search_vector);

-- Composite indexes for common query patterns
CREATE INDEX idx_city_price ON listings(city, list_price);
CREATE INDEX idx_status_city ON listings(status, city);
CREATE INDEX idx_status_price ON listings(status, list_price);
CREATE INDEX idx_type_beds_baths ON listings(property_type, bedrooms_total, bathroom_total);

-- Listing photos indexes
CREATE INDEX idx_listing_photos_listing_id ON listing_photos(listing_id);
CREATE INDEX idx_listing_photos_primary ON listing_photos(is_primary) WHERE is_primary = TRUE;

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brokerages_updated_at BEFORE UPDATE ON brokerages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update search vector for full-text search
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector =
        setweight(to_tsvector('english', COALESCE(NEW.street_address, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.property_type, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_search_vector_trigger BEFORE INSERT OR UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Sample query examples (commented out)

-- Search listings by city and price range:
-- SELECT * FROM listings
-- WHERE city = 'Toronto'
-- AND list_price BETWEEN 500000 AND 1000000
-- AND status = 'Active'
-- ORDER BY list_price DESC;

-- Search with property characteristics:
-- SELECT * FROM listings
-- WHERE bedrooms_total >= 3
-- AND bathroom_total >= 2
-- AND property_type = 'Residential'
-- AND status = 'Active'
-- LIMIT 20;

-- Full-text search:
-- SELECT * FROM listings
-- WHERE search_vector @@ to_tsquery('english', 'waterfront & condo')
-- AND status = 'Active'
-- ORDER BY listing_date DESC;

-- Get listings with photos:
-- SELECT l.*, array_agg(lp.photo_url ORDER BY lp.photo_order) as photos
-- FROM listings l
-- LEFT JOIN listing_photos lp ON l.id = lp.listing_id
-- WHERE l.status = 'Active'
-- GROUP BY l.id
-- LIMIT 20;
