export function validateYtLink(link: string): boolean {
  console.log('Validating YouTube link:', link);
  const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return ytRegex.test(link);
}


export async function getContentFromYoutube(linkOrId: string): Promise<string> {
  const videoId = extractVideoId(linkOrId);
  try {
    const res = await fetch('https://tactiq-apps-prod.tactiq.io/transcript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        langCode: "en"
      })
    });
    if (!res.ok) {
      console.error(`Failed to fetch transcript: ${res.status}`);
      return 'No transcript available.';
    }
    const data = await res.json();
    const text = data.captions?.map((entry: { text: string }) => entry.text).join(' ') || 'No transcript available.';
    return text;
  } catch (err) {
    console.error('Error fetching transcript:', err);
    return 'No transcript available.';
  }
}

function extractVideoId(link: string): string {
  const match = link.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : link;
}

