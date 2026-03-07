const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });
const EXIF_PATH = "/app/Image-ExifTool-13.52/exiftool";
const app = express();

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

app.listen(3000, () => {
  console.log("ExifTool API running on port 3000");
});
