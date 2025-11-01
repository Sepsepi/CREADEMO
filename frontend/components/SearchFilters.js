import { useState } from 'react';

export default function SearchFilters({ onSearch, loading }) {
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    propertyType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Remove empty filters
    const activeFilters = Object.keys(filters).reduce((acc, key) => {
      if (filters[key] !== '') {
        acc[key] = filters[key];
      }
      return acc;
    }, {});

    onSearch(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      city: '',
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: '',
      propertyType: ''
    });
    onSearch({});
  };

  const cities = [
    'Toronto',
    'Mississauga',
    'Brampton',
    'Hamilton',
    'Oakville',
    'Burlington',
    'Richmond Hill',
    'Pickering',
    'Whitby',
    'Oshawa',
    'Milton',
    'North York'
  ];

  const propertyTypes = [
    { value: 'Detached', label: 'Detached' },
    { value: 'Semi-Detached', label: 'Semi-Detached' },
    { value: 'Townhouse', label: 'Townhouse' },
    { value: 'Condo', label: 'Condo' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            id="city"
            name="city"
            value={filters.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="e.g. 400000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Max Price */}
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="e.g. 1000000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label htmlFor="beds" className="block text-sm font-medium text-gray-700 mb-1">
            Min Bedrooms
          </label>
          <select
            id="beds"
            name="beds"
            value={filters.beds}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div>
          <label htmlFor="baths" className="block text-sm font-medium text-gray-700 mb-1">
            Min Bathrooms
          </label>
          <select
            id="baths"
            name="baths"
            value={filters.baths}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Searching...' : 'Search Properties'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
