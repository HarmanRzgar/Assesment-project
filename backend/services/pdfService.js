const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const elasticClient = require('../config/database');

const pdfService = {
  // List all PDFs from the uploads directory
  listAllPdfs: async () => {
    try {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      const files = fs.readdirSync(uploadsDir);
      
      const pdfFiles = files
        .filter(file => file.endsWith('.pdf'))
        .map(file => {
          const stats = fs.statSync(path.join(uploadsDir, file));
          return {
            filename: file,
            size: stats.size,
            uploadDate: stats.mtime
          };
        })
        .sort((a, b) => b.uploadDate - a.uploadDate);

      return pdfFiles;
    } catch (error) {
      throw new Error('Failed to read uploads directory: ' + error.message);
    }
  },

  // Upload and index a PDF
  uploadPdf: async (file) => {
    try {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);

      // Index in Elasticsearch
      await elasticClient.index({
        index: 'pdfs',
        document: {
          filename: file.originalname,
          content: data.text,
          filepath: file.filename,
          uploadDate: new Date(),
        },
      });

      return {
        message: "PDF uploaded and indexed successfully",
        filename: file.originalname,
        filepath: file.filename
      };
    } catch (error) {
      throw new Error('Failed to upload PDF: ' + error.message);
    }
  },

  // Delete a PDF file and its index
  deletePdf: async (filename) => {
    try {
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      
      // Delete from filesystem if exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Search for the document in Elasticsearch
      const searchResult = await elasticClient.search({
        index: 'pdfs',
        body: {
          query: {
            match: {
              filepath: filename
            }
          }
        }
      });

      // Delete matching documents by ID
      for (const hit of searchResult.hits.hits) {
        await elasticClient.delete({
          index: 'pdfs',
          id: hit._id
        });
      }
      
      // Force refresh the index
      await elasticClient.indices.refresh({ index: 'pdfs' });
    } catch (error) {
      throw new Error('Failed to delete PDF: ' + error.message);
    }
  },

  // Sync files between filesystem and Elasticsearch
  syncFiles: async () => {
    try {
      const files = fs.readdirSync(path.join(__dirname, '..', 'uploads'));
      
      const esResult = await elasticClient.search({
        index: 'pdfs',
        size: 1000,
        body: {
          query: {
            match_all: {}
          }
        }
      });
      
      // Remove documents that don't have corresponding files
      const existingFiles = files.map(f => f);
      for (const hit of esResult.hits.hits) {
        if (!existingFiles.includes(hit._source.filepath)) {
          await elasticClient.delete({
            index: 'pdfs',
            id: hit._id
          });
        }
      }
      
      return { 
        message: 'Sync completed',
        filesInDirectory: files.length,
        documentsProcessed: esResult.hits.hits.length
      };
    } catch (error) {
      throw new Error('Failed to sync files: ' + error.message);
    }
  },

  // Cleanup Elasticsearch indices for missing files
  cleanup: async () => {
    try {
      const esResult = await elasticClient.search({
        index: 'pdfs',
        size: 1000,
        body: {
          query: {
            match_all: {}
          }
        }
      });

      let deletedCount = 0;
      
      for (const hit of esResult.hits.hits) {
        const filePath = path.join(__dirname, '..', 'uploads', hit._source.filepath);
        if (!fs.existsSync(filePath)) {
          await elasticClient.delete({
            index: 'pdfs',
            id: hit._id
          });
          deletedCount++;
        }
      }

      await elasticClient.indices.refresh({ index: 'pdfs' });
      
      return { 
        message: 'Cleanup completed',
        deletedCount: deletedCount
      };
    } catch (error) {
      throw new Error('Failed to cleanup indices: ' + error.message);
    }
  }
};

module.exports = pdfService;