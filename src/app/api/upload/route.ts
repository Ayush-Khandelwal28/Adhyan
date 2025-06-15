import { NextRequest, NextResponse } from 'next/server';
import extractPdfText from '@/app/lib/contentUpload/parsePDF';
import { validateYtLink, getContentFromYoutube } from '@/app/lib/contentUpload/ytUtils';
import { prepareTextForChunking } from '@/app/lib/contentUpload/processContent';
import {getTextStatistics} from '@/app/lib/contentUpload/processContent';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        console.log('Received form data:', formData);

        const contentType = formData.get('contentType');
        const file = formData.get('file');
        const text = formData.get('text');
        const link = formData.get('link');

        let content

        if (contentType === 'text') {
            content = text
        } else if (contentType === 'pdf') {
            if (!file || !(file instanceof Blob)) {
                console.log("No file received");
                return NextResponse.json({ error: "No file received." }, { status: 400 });
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            content = await extractPdfText(buffer);
        } else if (contentType === 'link') {
            if (!link || typeof link !== 'string') {
                return NextResponse.json({ error: 'Missing or invalid link format' }, { status: 400 });
            }
            if (validateYtLink(link) === false) {
                return NextResponse.json({ error: 'Invalid YouTube link' }, { status: 400 });
            }
            content = await getContentFromYoutube(link);
        }

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ error: 'Error processing content' }, { status: 400 });
        }

        const stats = getTextStatistics(content);
        console.log('Text Statistics:', stats);

        const chunks = prepareTextForChunking(content, {
            preserveSentences: true,
            minChunkSize: 100,
            maxChunkSize: 1000,
        });

        if (chunks.length === 0) {
            return NextResponse.json({ error: 'No valid chunks created' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Upload successful' }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to upload Content' },
            { status: 500 }
        );
    }
}

