import React, { useState, useEffect } from "react";
import api from './services/api';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPdfs, setAllPdfs] = useState([]);

  // Fetch PDFs on component mount
  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    try {
      const data = await api.fetchPdfs();
      setAllPdfs(data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      setError(error.response?.data?.error || "Error fetching PDFs");
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file first!");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      await api.uploadPdf(formData);
      alert("File uploaded successfully!");
      setSelectedFile(null);
      e.target.reset();
      fetchPdfs();
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.error || "Error uploading file");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDelete = async (filename) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      await api.deletePdf(filename);
      setSearchResults(prevResults => 
        prevResults.filter(result => result.filepath !== filename)
      );
      alert("File deleted successfully!");
      fetchPdfs();
    } catch (error) {
      console.error("Error deleting file:", error);
      setError(error.response?.data?.error || "Error deleting file");
    }
  };

  const handleSync = async () => {
    try {
      setIsLoading(true);
      
      await api.cleanupFiles();
      const syncResponse = await api.syncFiles();
      alert(`Sync completed! ${syncResponse.message}`);
      
      if (searchTerm) {
        handleSearch();
      }
      fetchPdfs();
    } catch (error) {
      console.error("Error syncing:", error);
      setError(error.response?.data?.error || "Error syncing files");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#ffebee", 
          color: "#c62828", 
          marginBottom: "20px",
          borderRadius: "4px"
        }}>
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Upload PDF</h2>
        <form onSubmit={handleFileUpload} style={{ display: "flex", gap: "10px" }}>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ flex: 1 }}
          />
          <button 
            type="submit"
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {/* PDFs Table */}
      <div style={{ marginBottom: "30px" }}>
        <h2>All PDFs</h2>
        <div style={{ 
          border: "1px solid #ccc",
          borderRadius: "4px",
          overflow: "auto"
        }}>
          <table style={{ 
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white"
          }}>
            <thead>
              <tr style={{
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #ddd"
              }}>
                <th style={{ padding: "12px", textAlign: "left" }}>File Name</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Size</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Upload Date</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allPdfs.map((pdf) => (
                <tr 
                  key={pdf.filename}
                  style={{
                    borderBottom: "1px solid #ddd"
                  }}
                >
                  <td style={{ padding: "12px" }}>{pdf.filename}</td>
                  <td style={{ padding: "12px" }}>
                    {(pdf.size / 1024).toFixed(2)} KB
                  </td>
                  <td style={{ padding: "12px" }}>
                    {new Date(pdf.uploadDate).toLocaleString()}
                  </td>
                  <td style={{ 
                    padding: "12px",
                    textAlign: "center"
                  }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <a
                        href={api.getPdfUrl(pdf.filename)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#1976d2",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "4px",
                          fontSize: "14px"
                        }}
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(pdf.filename)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {allPdfs.length === 0 && (
                <tr>
                  <td 
                    colSpan="4" 
                    style={{ 
                      padding: "20px",
                      textAlign: "center",
                      color: "#666"
                    }}
                  >
                    No PDFs uploaded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search Section */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Search Documents</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term..."
            style={{ 
              flex: 1,
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
          <button
            onClick={handleSync}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#388e3c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            Sync Files
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div>
        <h3>Search Results</h3>
        {searchResults.length === 0 ? (
          <p>No results found</p>
        ) : (
          searchResults.map((result, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff"
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <strong>File:</strong> {result.filename}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Path:</strong> {result.filepath}
              </div>
              <div style={{ marginBottom: "15px" }}>
                <strong>Matches:</strong>
                {result.highlights.map((highlight, i) => (
                  <div
                    key={i}
                    style={{ 
                      marginTop: "5px",
                      padding: "8px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px"
                    }}
                    dangerouslySetInnerHTML={{ __html: highlight }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href={api.getPdfUrl(result.filepath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                    display: "inline-block"
                  }}
                >
                  View PDF
                </a>
                <button
                  onClick={() => handleDelete(result.filepath)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;