import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'text' | 'file' | 'link'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
  };

  const validateUploadData = () => {
    switch (uploadType) {
      case 'text':
        if (!uploadData.content.trim()) {
          return 'Please enter some text content';
        }
        break;
      case 'file':
        if (!uploadData.file) {
          return 'Please select a PDF file';
        }
        break;
      case 'link':
        if (!uploadData.youtubeUrl.trim()) {
          return 'Please enter a YouTube URL';
        }
        if (!uploadData.youtubeUrl.includes('youtube.com') && !uploadData.youtubeUrl.includes('youtu.be')) {
          return 'Please enter a valid YouTube URL';
        }
        break;
      default:
        return 'Please select a content type';
    }
    return null;
  };

  const handleUpload = async () => {
    // Clear previous errors
    setError(null);
    
    // Validate input
    const validationError = validateUploadData();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const result = await upload(uploadType, uploadData);
      setUploadModalOpen(false);
      resetUploadData();
      
      // Refresh the dashboard or redirect to the new study pack
      if (result.data?.studyPackId) {
        router.push(`/studypack/${result.data.studyPackId}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error during upload:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
    handleFileChange,
    isLoading,
    error,
    setError
  };
}