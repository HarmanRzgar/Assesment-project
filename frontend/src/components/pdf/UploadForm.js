import React, { useState } from 'react';

const UploadForm = ({ onUpload, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);
    await onUpload(formData);
    setSelectedFile(null);
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="flex-1 p-2 border rounded shadow-sm"
      />
      <button 
        type="submit"
        disabled={isLoading}
        className={`px-4 py-2 bg-blue-500 text-white rounded shadow-sm transition-all
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow'}`}
      >
        {isLoading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadForm;