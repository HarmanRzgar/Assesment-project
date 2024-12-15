import React from 'react';
import api from '../../services/api';

const SearchResults = ({ results, onDelete }) => {
  if (results.length === 0) {
    return <p className="text-gray-500">No results found</p>;
  }

  return (
    <div className="space-y-5">
      {results.map((result, index) => (
        <div
          key={index}
          className="p-4 border rounded bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="mb-2">
            <strong>File:</strong> {result.filename}
          </div>
          <div className="mb-2">
            <strong>Path:</strong> {result.filepath}
          </div>
          <div className="mb-4">
            <strong>Matches:</strong>
            {result.highlights.map((highlight, i) => (
              <div
                key={i}
                className="mt-2 p-2 bg-gray-50 rounded"
                dangerouslySetInnerHTML={{ __html: highlight }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={api.getPdfUrl(result.filepath)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm hover:shadow transition-all"
            >
              View PDF
            </a>
        
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;