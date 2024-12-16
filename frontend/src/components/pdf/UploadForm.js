import React, { useState } from "react";

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mx-auto"
    >
      {/* Choose File Button + File Name */}
      <div className="w-full flex flex-col items-center">
        <label
          htmlFor="file-upload"
          className="w-full px-5 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 
            rounded-lg shadow-sm cursor-pointer hover:from-gray-300 hover:to-gray-400 
            transition-all text-center"
        >
          {selectedFile ? "Change File" : "Choose File"}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="hidden"
        />
        {selectedFile && (
          <div
            className="mt-2 w-full text-sm text-gray-600 truncate text-center"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {selectedFile.name}
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full px-5 py-3 bg-blue-500 text-white rounded-lg shadow-sm 
          transition-all text-center
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 hover:shadow-lg"}`}
      >
        {isLoading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadForm;
