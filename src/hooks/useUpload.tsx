import { useState } from 'react';

interface UploadData {
  content: string;
  file: File | null;
  youtubeUrl: string;
}

const upload = async (type: string, data: UploadData) => {
  const formData = new FormData();
  formData.append('contentType', type);
  formData.append('text', data.content);

  if (data.file) {
    formData.append('file', data.file);
  }
  if (type === 'link') {
    formData.append('link', data.youtubeUrl);
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};

export function useUpload() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'text' | 'file' | 'link'>('text');
  const [uploadData, setUploadData] = useState<UploadData>({
    content: '',
    file: null,
    youtubeUrl: ''
  });

  const resetUploadData = () => {
    setUploadData({
      content: '',
      file: null,
      youtubeUrl: ''
    });
  };

  const handleUpload = async () => {
    try {
      await upload(uploadType, uploadData);
      setUploadModalOpen(false);
      resetUploadData();
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData({ ...uploadData, file });
    }
  };

  return {
    uploadModalOpen,
    setUploadModalOpen,
    uploadType,
    setUploadType,
    uploadData,
    setUploadData,
    handleUpload,
    handleFileChange
  };
}