import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import sharp from 'sharp';
import { uploadFile, deleteFile, getObjectSignedUrl } from './s3.js'

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

router.post('/posts', upload.single('image'), async (req, res) => {
    const file = req.file
    const imageName = generateFileName()
    console.log(file);
    const urlLink = 'https://htlhcmus.s3.ap-southeast-2.amazonaws.com/' + imageName;
    console.log(imageName);
    const fileBuffer = await sharp(file.buffer)
        .resize({ height: 1920, width: 1080, fit: "contain" })
        .toBuffer()

    await uploadFile(fileBuffer, imageName, file.mimetype)
    
    res.status(200).json({message: urlLink})
})

export default router;