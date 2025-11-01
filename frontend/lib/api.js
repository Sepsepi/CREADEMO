const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Fetch listings with optional filters
 * @param {Object} filters - Search filters
 * @returns {Promise<Object>} Listings data
 */
export async function getListings(filters = {}) {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/listings${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch listings');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
}

/**
 * Fetch single listing details
 * @param {string} listingKey - Listing ID
 * @returns {Promise<Object>} Listing details
 */
export async function getListingDetails(listingKey) {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/${listingKey}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch listing');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching listing details:', error);
    throw error;
  }
}

/**
 * Fetch available cities
 * @returns {Promise<Array>} Array of city names
 */
export async function getCities() {
  try {
    const response = await fetch(`${API_BASE_URL}/cities`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch cities');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}

/**
 * Fetch statistics
 * @returns {Promise<Object>} Statistics data
 */
export async function getStatistics() {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch statistics');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}
