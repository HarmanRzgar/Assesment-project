import React, { useState, useEffect } from "react";
import api from "../services/api";
import Alert from "../components/common/Alert";
import UploadForm from "../components/pdf/UploadForm";
import PDFTable from "../components/pdf/PDFTable";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPdfs, setAllPdfs] = useState([]);

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

  const handleUpload = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.uploadPdf(formData);
      Alert({ message: "File uploaded successfully!" });
      fetchPdfs();
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.error || "Error uploading file");
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
      Alert({ message: "File deleted successfully!" });
      fetchPdfs(); // Refresh the list after deletion
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.error || "Error deleting file");
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
        <h2 className="text-xl md:text-2xl font-bold mb-4">Upload PDF</h2>
        <UploadForm onUpload={handleUpload} isLoading={isLoading} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">All PDFs</h2>
        <PDFTable pdfs={allPdfs} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default DashboardPage;