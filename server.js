const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });
const EXIF_PATH = "/app/Image-ExifTool-13.52/exiftool";
const app = express();
/**
app.post("/exif", upload.single("file"), (req, res) => {
  const filePath = req.file.path;

  execFile(EXIF_PATH, ["-json", filePath], (err, stdout) => {

    fs.unlinkSync(filePath);

    if (err) {
      return res.status(500).send(err.message);
    }

    const result = JSON.parse(stdout);
    res.json(result[0]);
  });
});
*/

app.post("/exif", upload.single("file"), (req, res) => {
  const filePath = req.file.path;

  const args = ["-overwrite_original"]; // wipe all existing metadata

  // Convert body fields to ExifTool arguments
  for (const [key, value] of Object.entries(req.body)) {
    args.push(`-${key}=${value}`);
  }

  args.push(filePath);

  // Write metadata
  execFile(EXIF_PATH, args, (err) => {
    if (err) {
      fs.unlinkSync(filePath);
      return res.status(500).send(err.message);
    }

    // Send the modified file as the response
    res.setHeader("Content-Disposition", `attachment; filename="${req.body.filename || "image.jpg"}"`);
    res.sendFile(path.resolve(filePath), (sendErr) => {
      // Clean up after sending
      fs.unlinkSync(filePath);

      if (sendErr) {
        console.error("Error sending file:", sendErr);
      }
    });
  });
});

app.listen(3000, () => {
  console.log("ExifTool API running on port 3000");
});
