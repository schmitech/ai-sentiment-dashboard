export async function analyzeWithOllama(texts: string[]): Promise<number[]> {
  const results: number[] = [];
  const OLLAMA_HOST = import.meta.env.VITE_OLLAMA_HOST || 'http://localhost:11434';

  for (const text of texts) {
    console.log(`🔍 Analyzing sentiment (Ollama) for text: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`)
    
    try {
      const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mvkvl/sentiments:aya',
          prompt: `Analyze the sentiment of this text and respond with a single number between -1 (most negative) and 1 (most positive): "${text}"`,
          stream: false,
          temperature: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the number from the response
      const scoreMatch = data.response.match(/-?\d*\.?\d+/);
      if (scoreMatch) {
        const score = parseFloat(scoreMatch[0]);
        // Ensure the score is within bounds
        const clampedScore = Math.max(-1, Math.min(1, score));
        console.log(`✅ Ollama sentiment score: ${clampedScore}`);
        results.push(clampedScore);
      } else {
        console.warn('Could not parse sentiment score from Ollama response:', data.response);
        results.push(0);
      }
    } catch (error) {
      console.error('Error analyzing sentiment with Ollama:', error);
      results.push(0);
    }
  }

  return results;
} 