import Link from 'next/link';

export default function ListingCard({ listing }) {
  const {
    ListingKey,
    ListPrice,
    StreetAddress,
    City,
    Province,
    PostalCode,
    BedroomsTotal,
    BathroomTotal,
    PropertySubType,
    Photos,
    SquareFootage,
    ParkingSpaces
  } = listing;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const primaryPhoto = Photos && Photos[0] ? Photos[0] : '/placeholder-home.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-64 bg-gray-200">
        <img
          src={primaryPhoto}
          alt={`${StreetAddress}, ${City}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-home.jpg';
          }}
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {formatPrice(ListPrice)}
        </div>
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
          {PropertySubType}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Address */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {StreetAddress}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {City}, {Province} {PostalCode}
        </p>

        {/* Property Details */}
        <div className="flex items-center space-x-4 text-sm text-gray-700 mb-4">
          {/* Bedrooms */}
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="font-medium">{BedroomsTotal}</span>
            <span className="ml-1">bed</span>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">{BathroomTotal}</span>
            <span className="ml-1">bath</span>
          </div>

          {/* Square Footage */}
          {SquareFootage && (
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-1 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              <span className="font-medium">{SquareFootage.toLocaleString()}</span>
              <span className="ml-1">sqft</span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {ParkingSpaces > 0 && (
          <div className="text-xs text-gray-600 mb-4">
            {ParkingSpaces} parking space{ParkingSpaces > 1 ? 's' : ''}
          </div>
        )}

        {/* View Details Button */}
        <Link
          href={`/listing/${ListingKey}`}
          className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
