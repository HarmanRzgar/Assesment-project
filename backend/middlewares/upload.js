const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create uploads directory if it doesn't exist
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    fs.readdir('./uploads', (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        const fallbackName = Date.now().toString().slice(0, 3) + '.pdf';
        return cb(null, fallbackName);
      }
      
      const pdfFiles = files.filter(file => file.endsWith('.pdf'));
      const nextNumber = (pdfFiles.length + 1).toString().padStart(3, '0');
      const newFilename = `${nextNumber}.pdf`;
      cb(null, newFilename);
    });
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;