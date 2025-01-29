export async function analyzeSentimentWithGoogle(texts: string[]): Promise<number[]> {
  const results: number[] = [];
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  for (const text of texts) {
    const document = {
      document: {
        type: 'PLAIN_TEXT',
        content: text,
      },
    };

    try {
      console.log(`🔍 Analyzing sentiment for text: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`);
      const response = await fetch(
        `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(document),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Sentiment score: ${result.documentSentiment?.score ?? 0}`);
      const sentiment = result.documentSentiment;
      if (sentiment) {
        results.push(sentiment.score ?? 0);
      } else {
        results.push(0); // Neutral if no sentiment is detected
      }
    } catch (error) {
      console.error('Error analyzing sentiment with Google:', error);
      // Fallback to using a simple rule-based approach on error
      const lowercaseText = text.toLowerCase();
      const positiveWords = ['great', 'love', 'excellent', 'amazing', 'best'];
      const negativeWords = ['bad', 'terrible', 'worst', 'disappointed', 'poor'];
      
      const positiveScore = positiveWords.some(word => lowercaseText.includes(word)) ? 0.5 : 0;
      const negativeScore = negativeWords.some(word => lowercaseText.includes(word)) ? -0.5 : 0;
      
      results.push(positiveScore || negativeScore || 0);
    }
  }

  return results;
}