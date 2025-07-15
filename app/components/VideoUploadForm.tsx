'use client';

import { useState } from 'react';
import { useNotification } from './Notification';
import { Upload } from 'lucide-react';

export default function VideoUploadForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const { showNotification } = useNotification();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title || !description) {
        showNotification(
            'Please provide a title, description, and a video file.',
            'warning'
        );
        return;
        }

        setUploading(true);

        try {
        // 1. Get signature from the backend
        const signatureResponse = await fetch('/api/auth/imagekit-auth');
        const signatureData = await signatureResponse.json();
        const { token } = signatureData;

        // 2. Upload to ImageKit
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        

        const uploadResponse = await fetch(
            'https://upload.imagekit.io/api/v1/files/upload',
            {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            }
        );

        const uploadData = await uploadResponse.json();

        if (uploadResponse.ok) {
            // 3. Save video metadata to the database
            const videoData = {
            title,
            description,
            videoUrl: uploadData.url,
            thumbnailUrl: uploadData.thumbnailUrl,
            };

            const dbResponse = await fetch('/api/video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(videoData),
            });

            if (dbResponse.ok) {
            showNotification('Video uploaded successfully!', 'success');
            setTitle('');
            setDescription('');
            setFile(null);
            // Reset file input
            const fileInput = document.getElementById('video') as HTMLInputElement;
            if(fileInput) fileInput.value = '';
            } else {
            const errorData = await dbResponse.json();
            showNotification(`Failed to save video: ${errorData.error}`, 'error');
            }
        } else {
            showNotification('Upload failed. Please try again.', 'error');
        }
        } catch (error) {
        console.error(error);
        showNotification('An error occurred during upload.', 'error');
        } finally {
        setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto mt-10">
        <form
            onSubmit={handleSubmit}
            className="bg-base-200 shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Upload Video</h2>
            <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="title">
                Title
            </label>
            <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter video title"
                required
            />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="description">
                Description
            </label>
            <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
                placeholder="Enter video description"
                required
            />
            </div>
            <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="video">
                Video File
            </label>
            <input
                id="video"
                type="file"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
                accept="video/*"
                required
            />
            </div>
            <div className="flex items-center justify-between">
            <button
                type="submit"
                className={`btn btn-primary w-full ${uploading ? 'loading' : ''}`}
                disabled={uploading}
            >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            </div>
        </form>
        </div>
    );
}