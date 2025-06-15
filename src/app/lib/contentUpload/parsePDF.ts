import { extractText, getDocumentProxy } from 'unpdf'

export default async function extractPdfText(buffer: Uint8Array | Buffer): Promise<string> {
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const { text } = await extractText(pdf, { mergePages: true })

    return text
}
