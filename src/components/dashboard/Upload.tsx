'use client';

import { Upload, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UploadModal } from '@/components/dashboard/UploadModal';
import { useUpload } from '@/hooks/useUpload';

export function UploadSection() {
    const {
        uploadModalOpen,
        setUploadModalOpen,
        uploadType,
        setUploadType,
        uploadData,
        setUploadData,
        handleUpload,
        handleFileChange
    } = useUpload();

    return (
        <Card className="mb-8 border-dashed border-2 border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <CardContent className="p-8">
                <div className="text-center">
                    <Upload className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Upload New Content
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Transform your PDFs, text, or YouTube videos into smart study materials
                    </p>

                    <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                                <Plus className="h-5 w-5 mr-2" />
                                Upload Content
                            </Button>
                        </DialogTrigger>
                        <UploadModal
                            uploadType={uploadType}
                            uploadData={uploadData}
                            setUploadType={setUploadType}
                            setUploadData={setUploadData}
                            onClose={() => setUploadModalOpen(false)}
                            onUpload={handleUpload}
                            handleFileChange={handleFileChange}
                        />
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}