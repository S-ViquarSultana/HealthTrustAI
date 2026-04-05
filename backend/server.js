require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pinataSDK = require("@pinata/sdk");

const app = express();

// ✅ Allow your Vercel frontend URL
app.use(cors({
  origin: ["https://health-trust-ai.vercel.app/", "http://localhost:3000"]
}));

const upload = multer();

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_KEY
);

// ✅ Health endpoint so UptimeRobot can ping it
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const readableStreamForFile = require("stream").Readable.from(req.file.buffer);

    const result = await pinata.pinFileToIPFS(readableStreamForFile, {
      pinataMetadata: {
        name: req.file.originalname,
      },
    });

    res.json({
      cid: result.IpfsHash, // ✅ Only the hash, not the full URL
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ✅ Use process.env.PORT for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));