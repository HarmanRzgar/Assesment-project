import React, { useState } from "react";
import api from "../services/api";
import Alert from "../components/common/Alert";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await api.searchPdfs(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
      setError(error.response?.data?.error || "Error performing search");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsLoading(true);

      await api.cleanupFiles();
      const syncResponse = await api.syncFiles();
      Alert({ message: `Sync completed! ${syncResponse.message}` });

      if (searchTerm) {
        handleSearch();
      }
    } catch (error) {
      console.error("Error syncing:", error);
      setError(error.response?.data?.error || "Error syncing files");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="p-3 bg-red-50 text-red-700 mb-5 rounded shadow-sm">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Search Documents</h2>
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          onSync={handleSync}
          isLoading={isLoading}
        />
      </div>

      <div>
        <h3 className="text-lg md:text-xl font-bold mb-4">Search Results</h3>
        <SearchResults results={searchResults} />
      </div>
    </div>
  );
};

export default SearchPage;
