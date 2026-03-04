require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pinataSDK = require("@pinata/sdk");

const app = express();
app.use(cors());

const upload = multer();

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_KEY
);

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const readableStreamForFile = require("stream").Readable.from(req.file.buffer);

    const result = await pinata.pinFileToIPFS(readableStreamForFile, {
      pinataMetadata: {
        name: req.file.originalname,
      },
    });

    res.json({
      cid: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));