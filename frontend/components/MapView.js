import { useState } from 'react';

export default function MapView({ listings }) {
  const [selectedListing, setSelectedListing] = useState(null);

  // Calculate center point based on listings
  const centerLat = listings.length > 0
    ? listings.reduce((sum, l) => sum + l.Latitude, 0) / listings.length
    : 43.6532;
  const centerLng = listings.length > 0
    ? listings.reduce((sum, l) => sum + l.Longitude, 0) / listings.length
    : -79.3832;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-blue-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Map View:</span> Showing {listings.length} properties
          </p>
        </div>
      </div>

      {/* Placeholder for Map */}
      <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <svg
            className="w-16 h-16 mx-auto text-blue-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Interactive Map Integration
          </h3>
          <p className="text-gray-600 mb-4">
            This would display an interactive Mapbox map with property markers.
          </p>
          <div className="bg-white rounded-lg p-4 shadow-sm text-left text-sm">
            <p className="font-semibold text-gray-800 mb-2">Integration Details:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Map centered at: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}</li>
              <li>• {listings.length} property markers</li>
              <li>• Interactive popups with pricing</li>
              <li>• Cluster support for dense areas</li>
            </ul>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            To enable: Add Mapbox API key and install react-map-gl
          </p>
        </div>

        {/* Sample markers overlay (visual representation) */}
        <div className="absolute inset-0 pointer-events-none">
          {listings.slice(0, 5).map((listing, idx) => (
            <div
              key={listing.ListingKey}
              className="absolute"
              style={{
                left: `${20 + idx * 15}%`,
                top: `${30 + idx * 10}%`,
              }}
            >
              <div className="relative">
                <svg
                  className="w-8 h-8 text-red-500 animate-bounce"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                  {formatPrice(listing.ListPrice)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listings List Below Map */}
      <div className="p-4 border-t border-gray-200 max-h-64 overflow-y-auto">
        <h4 className="font-semibold text-gray-900 mb-3">Properties on Map</h4>
        <div className="space-y-2">
          {listings.map((listing) => (
            <div
              key={listing.ListingKey}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition"
              onClick={() => setSelectedListing(listing)}
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{listing.StreetAddress}</div>
                <div className="text-sm text-gray-600">
                  {listing.City} • {listing.BedroomsTotal} bed, {listing.BathroomTotal} bath
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-600">
                  {formatPrice(listing.ListPrice)}
                </div>
                <div className="text-xs text-gray-500">{listing.PropertySubType}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
