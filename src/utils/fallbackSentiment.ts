export async function analyzeSentimentWithFallback(texts: string[]): Promise<number[]> {
  const results: number[] = [];

  for (const text of texts) {
    console.log(`🔍 Analyzing sentiment (fallback) for text: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`)
    const lowercaseText = text.toLowerCase();
    
    // Simple word-based sentiment analysis
    const positiveWords = ['great', 'love', 'excellent', 'amazing', 'best', 'good', 'awesome', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'worst', 'disappointed', 'poor', 'awful', 'horrible'];
    
    const words = lowercaseText.split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 0.25;
      if (negativeWords.includes(word)) score -= 0.25;
    });

    // Clamp score between -1 and 1
    score = Math.max(-1, Math.min(1, score));
    console.log(`✅ Fallback sentiment score: ${score}`);
    results.push(score);
  }

  return results;
} 