const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const upload = require('../middlewares/upload');

router.get('/pdfs', pdfController.listPdfs);
router.post('/upload', upload.single('pdf'), pdfController.uploadPdf);
router.delete('/file/:filename', pdfController.deletePdf);
router.post('/sync', pdfController.syncFiles);
router.post('/cleanup', pdfController.cleanup);

module.exports = router;