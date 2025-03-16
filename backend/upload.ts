import * as multer from 'multer';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { Request, Response } from 'express';

const router = express.Router();

// Create 'uploads' folder if it does not exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Define the route with explicit return type as void
router.post('/upload', upload.single('file'), (req: Request, res: Response): void => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ message: "No File Uploaded" });
        return; // Ensure to return after sending the response
    }

    const fileUrl = `/files/${file.filename}`;
    res.status(200).json({ message: "File Uploaded", url: fileUrl });
});

// Serve files statically
router.use('/files', express.static(uploadDir));

export default router;