const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use absolute path for uploads directory
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Use absolute path for reading directory
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        const fallbackName = Date.now().toString().slice(0, 3) + '.pdf';
        return cb(null, fallbackName);
      }
      
      // Filter PDF files and extract numbers
      const numbers = files
        .filter(file => file.endsWith('.pdf'))
        .map(file => {
          // Extract number from filename (e.g., "001.pdf" -> 1)
          const numberStr = file.replace('.pdf', '');
          return parseInt(numberStr, 10);
        })
        .filter(num => !isNaN(num));  // Filter out any NaN values

      // Find the highest number, default to 0 if no files exist
      const highestNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
      
      // Generate next number
      const nextNumber = (highestNumber + 1).toString().padStart(3, '0');
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