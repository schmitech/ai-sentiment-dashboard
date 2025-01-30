export async function analyzeSentimentWithFallback(texts: string[]): Promise<number[]> {
  const results: number[] = [];

  for (const text of texts) {
    console.log(`🔍 Analyzing sentiment (fallback) for text: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`)
    const lowercaseText = text.toLowerCase();
    
    // Expanded word lists with weights
    const positiveWords = {
      strong: ['amazing', 'excellent', 'outstanding', 'perfect', 'incredible', 'love', 'fantastic', 'brilliant'],
      moderate: ['good', 'great', 'nice', 'happy', 'pleased', 'recommend', 'worth', 'impressive'],
      mild: ['okay', 'decent', 'fine', 'satisfactory', 'acceptable']
    };
    
    const negativeWords = {
      strong: ['terrible', 'horrible', 'awful', 'worst', 'disappointed', 'hate', 'useless', 'broken'],
      moderate: ['bad', 'poor', 'issues', 'problems', 'disappointing', 'frustrating', 'annoying'],
      mild: ['mediocre', 'meh', 'lacking', 'limited', 'basic']
    };
    
    const words = lowercaseText.split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      // Strong sentiment words
      if (positiveWords.strong.includes(word)) score += 0.4;
      if (negativeWords.strong.includes(word)) score -= 0.4;
      
      // Moderate sentiment words
      if (positiveWords.moderate.includes(word)) score += 0.25;
      if (negativeWords.moderate.includes(word)) score -= 0.25;
      
      // Mild sentiment words
      if (positiveWords.mild.includes(word)) score += 0.15;
      if (negativeWords.mild.includes(word)) score -= 0.15;
    });

    // Clamp score between -1 and 1
    score = Math.max(-1, Math.min(1, score));
    console.log(`✅ Fallback sentiment score: ${score}`);
    results.push(score);
  }

  return results;
} 