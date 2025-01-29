export type ReviewSource = 'X' | 'Instagram' | 'web' | 'email' | 'TikTok' | 'Facebook' | 'YouTube' | 'LinkedIn';
export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface Review {
  id: string;
  text: string;
  source: ReviewSource;
  sentiment: SentimentType;
  sentimentScore?: number; // Add optional sentiment score
  language: string;
  stars: number;
  productName: string;
  timestamp: Date;
  customerName: string;
  likes: number;
  shares: number;
  verifiedPurchase: boolean;
}