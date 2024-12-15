import React from 'react';
import api from '../../services/api';

const PDFTable = ({ pdfs, onDelete }) => {
  return (
    <div className="border rounded shadow-md overflow-x-auto">
      <table className="w-full bg-white">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            <th className="p-3 text-left whitespace-nowrap">File Name</th>
            <th className="p-3 text-left whitespace-nowrap">Size</th>
            <th className="p-3 text-left whitespace-nowrap">Upload Date</th>
            <th className="p-3 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pdfs.map((pdf) => (
            <tr 
              key={pdf.filename}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="p-3 truncate max-w-[200px]">{pdf.filename}</td>
              <td className="p-3 whitespace-nowrap">
                {(pdf.size / 1024).toFixed(2)} KB
              </td>
              <td className="p-3 whitespace-wrap">
                {new Date(pdf.uploadDate).toLocaleString()}
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  <a
                    href={api.getPdfUrl(pdf.filename)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 shadow-sm hover:shadow transition-all"
                  >
                    View
                  </a>
                  {/* <button
                    onClick={() => onDelete(pdf.filename)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 shadow-sm hover:shadow transition-all"
                  >
                    Delete
                  </button> */}
                </div>
              </td>
            </tr>
          ))}
          {pdfs.length === 0 && (
            <tr>
              <td 
                colSpan="4" 
                className="p-5 text-center text-gray-500"
              >
                No PDFs uploaded yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PDFTable;