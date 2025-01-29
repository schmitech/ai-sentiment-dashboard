export async function analyzeWithHuggingFace(texts: string[]): Promise<number[]> {
    const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    
    if (!apiKey) {
      throw new Error('No HuggingFace API key provided');
    }
  
    const response = await fetch(
      `https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: texts }),
      }
    );
  
    if (!response.ok) {
      throw new Error('HuggingFace API call failed');
    }
  
    const data = await response.json();
    
    return data.map((result: any) => {
      const positiveScore = result.find((r: any) => r.label === 'positive')?.score || 0;
      const neutralScore = result.find((r: any) => r.label === 'neutral')?.score || 0;
      const negativeScore = result.find((r: any) => r.label === 'negative')?.score || 0;
      
      let score;
      
      // Stronger conditions for neutral cases:
      // 1. High neutral score OR
      // 2. Mixed positive/negative with small difference
      if (neutralScore > 0.3 || Math.abs(positiveScore - negativeScore) < 0.5) {
        // Push more aggressively towards neutral
        score = (positiveScore - negativeScore) * 0.2;
      } else if (negativeScore > 0.15) {
        // When there's significant negativity
        score = (positiveScore - (negativeScore * 2)) * 0.8;
      } else {
        // Normal case
        score = (positiveScore - negativeScore) * 0.8;
      }
      
      // Clamp the score between -1 and 1
      score = Math.max(-1, Math.min(1, score));
      
      console.log(`✅ HuggingFace sentiment analysis:
        Positive: ${positiveScore.toFixed(3)}
        Neutral: ${neutralScore.toFixed(3)}
        Negative: ${negativeScore.toFixed(3)}
        Final Score: ${score.toFixed(3)}`);
      
      return score;
    });
}