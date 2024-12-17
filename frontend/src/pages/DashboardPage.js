import React, { useState, useEffect } from "react";
import api from "../services/api";
import UploadForm from "../components/pdf/UploadForm";
import PDFTable from "../components/pdf/PDFTable";

const CustomPopup = ({ message, onClose, show }) => (
  <div
    className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${
      show ? "opacity-100 visible" : "opacity-0 invisible"
    }`}
  >
    <div
      className={`bg-white rounded-lg p-6 max-w-sm w-full mx-4 transition-transform duration-300 ${
        show ? "scale-100" : "scale-95"
      }`}
    >
      <div className="text-center mb-4">{message}</div>
      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        OK
      </button>
    </div>
  </div>
);

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPdfs, setAllPdfs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

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
    if (!formData) {
      setPopupMessage("Please select a file first!");
      setShowPopup(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await api.uploadPdf(formData);
      setPopupMessage("File uploaded successfully!");
      setShowPopup(true);
      fetchPdfs();
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.error || "Error uploading file");
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
        <h2 className="text-xl md:text-2xl font-bold mb-4">Upload PDF</h2>
        <UploadForm onUpload={handleUpload} isLoading={isLoading} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">All PDFs</h2>
        <PDFTable pdfs={allPdfs} />
      </div>

      {showPopup && (
        <CustomPopup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
          show={showPopup}
        />
      )}
    </div>
  );
};

export default DashboardPage;
