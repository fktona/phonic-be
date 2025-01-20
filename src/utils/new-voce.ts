export async function generateSpeech(text: string, voiceId: string): Promise<string> {
  if (!text) {
    throw new Error('Text is required to generate speech');
  }

  const apiKey = process.env.TTS_API_KEY;
  if (!apiKey) {
    throw new Error('Text-to-Speech API key is missing');
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify({
      text: text,
      speaker: '00156cf2-3826-11ee-a861-00163e2ac61b',
      emotion: 'proud confident'
    })
  };

  try {
    const response = await fetch('https://api.topmediai.com/v1/text2speech', options);
    const data = await response.json();
    console.log(data);
    if (data.status === 200 && data.data.oss_url) {
      // Fetch the audio file content
      const audioResponse = await fetch(data.data.oss_url);
      if (!audioResponse.ok) {
        throw new Error('Failed to fetch audio file');
      }

      // Convert audio content to Base64
      const audioBuffer = await audioResponse.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');

      return audioBase64;
    } else {
      throw new Error('Failed to generate speech');
    }
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    throw new Error('Internal server error');
  }
}
