const pdfService = require('../services/pdfService');

const pdfController = {
  listPdfs: async (req, res, next) => {
    try {
      const pdfs = await pdfService.listAllPdfs();
      res.json(pdfs);
    } catch (error) {
      next(error);
    }
  },

  uploadPdf: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file uploaded" });
      }
      const result = await pdfService.uploadPdf(req.file);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  deletePdf: async (req, res, next) => {
    try {
      await pdfService.deletePdf(req.params.filename);
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  syncFiles: async (req, res, next) => {
    try {
      const result = await pdfService.syncFiles();
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  cleanup: async (req, res, next) => {
    try {
      const result = await pdfService.cleanup();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = pdfController;