import multer from 'multer';
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import fs from 'fs';
import db from './db.ts'; // Import database
import express, { Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Create 'uploads' folder if it does not exist
const uploadDir = join(__dirname, 'uploads');
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
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    const { isPublic, expiresInHours } = req.body; // Client can set public/private and expiry

    if (!file) {
        res.status(400).json({ message: 'No file uploaded' });
        return; // Ensure to return after sending a response
    }

    const expiresAt = expiresInHours
        ? new Date(Date.now() + expiresInHours * 3600000)
        : null;

    try {
        const savedFile = await db.one(
            `INSERT INTO files (filename, original_name, is_public, expires_at)
            VALUES ($1, $2, $3, $4) RETURNING id`,
            [file.filename, file.originalname, isPublic === 'true', expiresAt]
        );

        res.status(200).json({
            message: 'File uploaded',
            url: `http://localhost:5000/api/files/${savedFile.id}`,
        });
    } catch (error) {
        res.status(500).json({ message: 'DB error', error });
    }
});


router.get('/files/:id', async (req: Request, res: Response): Promise<void> => {
    const fileId = req.params.id;

    try {
        const file = await db.oneOrNone(`SELECT * FROM files WHERE id = $1`, [fileId]);

        if (!file) {
            res.status(404).json({ message: "File not found" });
            return; // Ensure to return after sending a response
        }

        // Checking if file expired
        if (file.expires_at && new Date(file.expires_at) < new Date()) {
            res.status(404).json({ message: "Link expired" });
            return; // Ensure to return after sending a response
        }

        // For Private Files
        if (!file.is_public) {
            res.status(401).json({ message: "Unauthorized - Private File" });
            return; // Ensure to return after sending a response
        }

        const filePath = path.join(uploadDir, file.filename); // Use uploadDir directly
        res.sendFile(filePath);
    } catch (err) {
        res.status(500).json({ message: "DB error", err });
    }
});
// Serve files statically
router.use('/files', express.static(uploadDir));

export default router;