// src/components/search/SearchBar.js
import React from 'react';

const SearchBar = ({ searchTerm, onSearchTermChange, onSearch, isLoading }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-3">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        placeholder="Enter search term..."
        className="flex-1 p-2 border rounded shadow-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={onSearch}
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-500 text-white rounded shadow-sm transition-all
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow'}`}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;