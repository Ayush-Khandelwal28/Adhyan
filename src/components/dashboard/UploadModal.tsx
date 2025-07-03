import { Type } from 'lucide-react';
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
}

const uploadOptions = ["text", "file", "link"] as const;

export function UploadModal({
    uploadType,
    uploadData,
    setUploadType,
    setUploadData,
    onClose,
    onUpload,
    handleFileChange
}: UploadModalProps) {
    return (
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Upload New Content</DialogTitle>
                <DialogDescription>
                    Choose your content type and upload to create smart study materials.
                </DialogDescription>
            </DialogHeader>

            <Tabs value={uploadType} onValueChange={(value) => setUploadType(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                    {uploadOptions.map((option) => (
                        <TabsTrigger key={option} value={option} className="flex items-center space-x-2">
                            <Type className="h-4 w-4" />
                            <span>{option}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                <div className="mt-6 space-y-4">
                    <TabsContent value="text" className="space-y-4">
                        <div>
                            <Label htmlFor="content" className="mb-2">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Paste your text content here..."
                                className="min-h-[200px] max-h-[200px] overflow-y-auto"
                                value={uploadData.content}
                                onChange={(e) => setUploadData({ ...uploadData, content: e.target.value })}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="file" className="space-y-4">
                        <div>
                            <Label htmlFor="file" className="mb-2">PDF File</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="link" className="space-y-4">
                        <div>
                            <Label htmlFor="youtube-url" className="mb-2">YouTube URL</Label>
                            <Input
                                id="youtube-url"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={uploadData.youtubeUrl}
                                onChange={(e) => setUploadData({ ...uploadData, youtubeUrl: e.target.value })}
                            />
                        </div>
                    </TabsContent>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onUpload}>
                        Create Study Pack
                    </Button>
                </div>
            </Tabs>
        </DialogContent>
    );
}