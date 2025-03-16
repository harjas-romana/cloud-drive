import { useState } from "react";
import axios from 'axios';

const Upload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadUrl, setUploadUrl] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData);
            setUploadUrl(response.data.url);
        } catch (error) {
            console.error("Error uploading file:", error);
            // Optionally, you can set an error state here to inform the user
        }
    };

    return (
        <div className={"p-4"}>
            <input type={"file"} onChange={handleFileChange} />
            <button onClick={handleUpload} className={"bg-blue-500 text-white px-4 py-2 ml-2"}>
                Upload
            </button>
            {uploadUrl && (
                <div className={"mt-4"}>
                    <p>
                        File URL: <a href={uploadUrl} className={"text-blue-800"}>{uploadUrl}</a>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Upload;