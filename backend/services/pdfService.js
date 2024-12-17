const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const elasticClient = require('../config/database');


const ELASTIC_INDEX = process.env.ELASTIC_INDEX  // You can change this to whatever you want

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
        index: ELASTIC_INDEX,
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

  // Delete a PDF file and its index entry
  deletePdf: async (filename) => {
    try {
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      
      // Delete from filesystem if exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Delete from Elasticsearch
      await elasticClient.deleteByQuery({
        index: ELASTIC_INDEX,
        body: {
          query: {
            match: {
              filepath: filename
            }
          }
        },
        refresh: true  // Force index refresh
      });

    } catch (error) {
      throw new Error('Failed to delete PDF: ' + error.message);
    }
  },

  // Delete entire index
  deleteIndex: async () => {
    try {
      const response = await elasticClient.indices.delete({
        index: ELASTIC_INDEX
      });
      return {
        message: 'Index deleted successfully',
        response: response
      };
    } catch (error) {
      throw new Error('Failed to delete index: ' + error.message);
    }
  },

  // Sync files between filesystem and Elasticsearch
  syncFiles: async () => {
    try {
      const files = fs.readdirSync(path.join(__dirname, '..', 'uploads'));
      
      const esResult = await elasticClient.search({
        index: ELASTIC_INDEX,
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
            index: ELASTIC_INDEX,
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
        index: ELASTIC_INDEX,
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
            index: ELASTIC_INDEX,
            id: hit._id
          });
          deletedCount++;
        }
      }

      await elasticClient.indices.refresh({ index: ELASTIC_INDEX });
      
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