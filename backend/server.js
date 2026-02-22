require("dotenv").config();

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer();

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const INFURA_PROJECT_SECRET = process.env.INFURA_PROJECT_SECRET;

const auth =
  "Basic " +
  Buffer.from(
    INFURA_PROJECT_ID + ":" + INFURA_PROJECT_SECRET
  ).toString("base64");

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const response = await axios.post(
      "https://ipfs.infura.io:5001/api/v0/add",
      file.buffer,
      {
        headers: {
          Authorization: auth,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    res.json({
      cid: response.data.Hash,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});