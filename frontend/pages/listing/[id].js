import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getListingDetails } from '../../lib/api';

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    if (id) {
      loadListing();
    }
  }, [id]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const data = await getListingDetails(id);
      setListing(data);
    } catch (err) {
      setError('Failed to load listing details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This listing does not exist'}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{listing.StreetAddress}, {listing.City} - ${listing.ListPrice.toLocaleString()}</title>
        <meta name="description" content={listing.Description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Search
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Photo Gallery */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Main Photo */}
            <div className="relative h-96 md:h-[500px] bg-gray-200">
              <img
                src={listing.Photos[currentPhoto]}
                alt={`${listing.StreetAddress} - Photo ${currentPhoto + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-home.jpg';
                }}
              />

              {/* Photo Navigation */}
              {listing.Photos.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPhoto(prev => prev === 0 ? listing.Photos.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPhoto(prev => prev === listing.Photos.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Photo Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentPhoto + 1} / {listing.Photos.length}
                  </div>
                </>
              )}
            </div>

            {/* Photo Thumbnails */}
            {listing.Photos.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {listing.Photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className={`h-20 w-20 object-cover rounded cursor-pointer ${
                      currentPhoto === index ? 'ring-2 ring-blue-600' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setCurrentPhoto(index)}
                    onError={(e) => {
                      e.target.src = '/placeholder-home.jpg';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price & Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {formatPrice(listing.ListPrice)}
                    </h1>
                    <p className="text-xl text-gray-700">
                      {listing.StreetAddress}
                    </p>
                    <p className="text-gray-600">
                      {listing.City}, {listing.Province} {listing.PostalCode}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {listing.PropertySubType}
                  </span>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{listing.BedroomsTotal}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{listing.BathroomTotal}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  {listing.SquareFootage && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{listing.SquareFootage.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  )}
                  {listing.ParkingSpaces > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{listing.ParkingSpaces}</div>
                      <div className="text-sm text-gray-600">Parking</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {listing.Description}
                </p>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium text-gray-900">{listing.PropertySubType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">{listing.Status}</span>
                  </div>
                  {listing.YearBuilt && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Year Built:</span>
                      <span className="font-medium text-gray-900">{listing.YearBuilt}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Listed:</span>
                    <span className="font-medium text-gray-900">{formatDate(listing.ListingDate)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">MLS #:</span>
                    <span className="font-medium text-gray-900">{listing.ListingKey}</span>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">Map Integration</p>
                    <p className="text-sm text-gray-500">Coordinates: {listing.Latitude}, {listing.Longitude}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Listing Agent</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{listing.AgentName}</p>
                    <p className="text-sm text-gray-600">{listing.BrokerageName}</p>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-medium">
                    Contact Agent
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition font-medium">
                    Schedule Showing
                  </button>
                </div>
              </div>

              {/* Share */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Property</h3>
                <div className="space-y-2">
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition text-sm">
                    Copy Link
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition text-sm">
                    Email to Friend
                  </button>
                </div>
              </div>

              {/* Mortgage Calculator */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Mortgage Calculator</h3>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Estimated monthly payment:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(Math.round(listing.ListPrice * 0.005))}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Based on 20% down, 5% interest, 25 years
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-600 text-sm">
              CREA DDF Integration Demo
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
