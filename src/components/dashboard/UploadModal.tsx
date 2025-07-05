import { Type, Loader2, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface UploadModalProps {
    uploadType: 'text' | 'file' | 'link';
    uploadData: {
        content: string;
        file: File | null;
        youtubeUrl: string;
    };
    setUploadType: (value: 'text' | 'file' | 'link') => void;
    setUploadData: (data: any) => void;
    onClose: () => void;
    onUpload: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isLoading: boolean;
    error: string | null;
    setError: (error: string | null) => void;
}

const uploadOptions = ["text", "file", "link"] as const;

export function UploadModal({
    uploadType,
    uploadData,
    setUploadType,
    setUploadData,
    onClose,
    onUpload,
    handleFileChange,
    isLoading,
    error,
    setError
}: UploadModalProps) {
    return (
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Upload New Content</DialogTitle>
                <DialogDescription>
                    Choose your content type and upload to create smart study materials.
                </DialogDescription>
            </DialogHeader>

            {/* Error Alert */}
            {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-800 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    <span className="flex-1">{error}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setError(null)}
                        className="h-auto p-1 text-red-800 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            )}

            <Tabs value={uploadType} onValueChange={(value) => setUploadType(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                    {uploadOptions.map((option) => (
                        <TabsTrigger 
                            key={option} 
                            value={option} 
                            className="flex items-center space-x-2"
                            disabled={isLoading}
                        >
                            <Type className="h-4 w-4" />
                            <span className="capitalize">{option}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                <div className="mt-6 space-y-4">
                    <TabsContent value="text" className="space-y-4">
                        <div>
                            <Label htmlFor="content" className="mb-2">Content *</Label>
                            <Textarea
                                id="content"
                                placeholder="Paste your text content here..."
                                className="min-h-[200px] max-h-[200px] overflow-y-auto"
                                value={uploadData.content}
                                onChange={(e) => setUploadData({ ...uploadData, content: e.target.value })}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter the text you want to convert into study materials
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="file" className="space-y-4">
                        <div>
                            <Label htmlFor="file" className="mb-2">PDF File *</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {uploadData.file ? `Selected: ${uploadData.file.name}` : 'Select a PDF file to upload'}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="link" className="space-y-4">
                        <div>
                            <Label htmlFor="youtube-url" className="mb-2">YouTube URL *</Label>
                            <Input
                                id="youtube-url"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={uploadData.youtubeUrl}
                                onChange={(e) => setUploadData({ ...uploadData, youtubeUrl: e.target.value })}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter a valid YouTube video URL
                            </p>
                        </div>
                    </TabsContent>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={onUpload} 
                        disabled={isLoading}
                        className="cursor-pointer min-w-[140px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Study Pack'
                        )}
                    </Button>
                </div>
            </Tabs>
        </DialogContent>
    );
}