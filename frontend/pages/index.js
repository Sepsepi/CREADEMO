import { useState, useEffect } from 'react';
import Head from 'next/head';
import SearchFilters from '../components/SearchFilters';
import ListingCard from '../components/ListingCard';
import MapView from '../components/MapView';
import { getListings, getStatistics } from '../lib/api';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [listingsData, statsData] = await Promise.all([
        getListings(),
        getStatistics()
      ]);

      setListings(listingsData.listings);
      setPagination({
        page: listingsData.page,
        totalPages: listingsData.totalPages,
        total: listingsData.total
      });
      setStats(statsData);
    } catch (err) {
      setError('Failed to load listings. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getListings(filters);

      setListings(data.listings);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        total: data.total
      });
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // You would pass current filters along with the new page
    await handleSearch({ page: newPage });
  };

  return (
    <>
      <Head>
        <title>CREA DDF Property Search - Find Your Dream Home</title>
        <meta name="description" content="Search MLS listings across Ontario. Find homes, condos, and properties for sale." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  CREA DDF Property Search
                </h1>
                <p className="text-gray-600 mt-1">
                  Find your perfect home from MLS listings
                </p>
              </div>

              {stats && (
                <div className="hidden md:flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.totalListings}
                    </div>
                    <div className="text-gray-600">Active Listings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${(stats.averagePrice / 1000).toFixed(0)}K
                    </div>
                    <div className="text-gray-600">Avg Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.citiesCount}
                    </div>
                    <div className="text-gray-600">Cities</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <SearchFilters onSearch={handleSearch} loading={loading} />
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-700">
              {pagination.total > 0 && (
                <span className="text-sm">
                  Showing <span className="font-semibold">{listings.length}</span> of{' '}
                  <span className="font-semibold">{pagination.total}</span> properties
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  viewMode === 'map'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Map View
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          )}

          {/* Results */}
          {!loading && listings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search filters
              </p>
            </div>
          )}

          {!loading && listings.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <ListingCard key={listing.ListingKey} listing={listing} />
                  ))}
                </div>
              ) : (
                <MapView listings={listings} />
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex items-center px-4 py-2 text-sm text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-600 text-sm">
              CREA DDF Integration Demo - Built with Next.js, Express, and PostgreSQL
            </p>
            <p className="text-center text-gray-500 text-xs mt-2">
              Currently using mock data. Ready for production CREA DDF integration.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
