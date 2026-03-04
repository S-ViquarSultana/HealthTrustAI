import { NFTStorage, File } from 'nft.storage';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });

export async function uploadPDF(filePath) {
  const fileName = path.basename(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  const metadata = await client.store({
    name: fileName,
    description: 'PDF for blockchain project',
    file: new File([fileBuffer], fileName, { type: 'application/pdf' }),
  });

  console.log('✅ PDF uploaded:', metadata.ipnft);
  return metadata.ipnft; // Return CID
}