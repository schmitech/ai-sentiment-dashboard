import { useState, useEffect, useRef } from 'react';
import { generateReview } from './utils/reviewGenerator';
import { ReviewList } from './components/ReviewList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AlertsTable } from './components/AlertsTable';
import { Play, Pause, Trash2, Timer, BarChart3 } from 'lucide-react';
import type { Review } from './types';
import { analyzeSentimentWithGoogle } from './utils/googleSentiment';
import { analyzeSentimentWithFallback } from './utils/fallbackSentiment';
import { analyzeWithHuggingFace } from './utils/huggingFaceSentiment';
import { analyzeWithOllama } from './utils/ollamaSentiment';

// Map Google sentiment score to our sentiment categories
const getSentimentCategory = (score: number): Review['sentiment'] => {
  if (score >= 0.2) return 'positive';
  if (score <= -0.2) return 'negative';
  return 'neutral';
};

function App() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'analytics' | 'alerts'>('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [delay, setDelay] = useState(20); // Delay in seconds
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<number>();
  const countdownIntervalRef = useRef<number>();

  const analyzeSentiment = async (texts: string[]): Promise<number[]> => {
    const selectedEngine = import.meta.env.VITE_SENTIMENT_ENGINE?.toLowerCase() || 'fallback';
    
    try {
      switch (selectedEngine) {
        case 'google':
          const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
          if (!googleApiKey || googleApiKey === 'undefined') {
            throw new Error('No Google API key provided');
          }
          return await analyzeSentimentWithGoogle(texts);

        case 'huggingface':
          const huggingFaceApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
          if (!huggingFaceApiKey || huggingFaceApiKey === 'undefined') {
            throw new Error('No HuggingFace API key provided');
          }
          return await analyzeWithHuggingFace(texts);

        case 'ollama':
          return await analyzeWithOllama(texts);

        case 'fallback':
          return await analyzeSentimentWithFallback(texts);

        default:
          console.warn(`Unknown sentiment engine "${selectedEngine}", using fallback`);
          return analyzeSentimentWithFallback(texts);
      }
    } catch (error) {
      console.warn(`Failed to use ${selectedEngine} sentiment analysis, falling back to basic analysis:`, error);
      return analyzeSentimentWithFallback(texts);
    }
  };

  const addReview = async () => {
    const review = generateReview();
    // Use the new sentiment analyzer function
    const [sentimentScore] = await analyzeSentiment([review.text]);
    review.sentiment = getSentimentCategory(sentimentScore);
    review.sentimentScore = sentimentScore;
    setReviews(prev => [review, ...prev]);
    setCountdown(delay);
  };

  const startCountdown = () => {
    setCountdown(delay);
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
  };

  const startReviewGeneration = async () => {
    if (!isRunning) {
      setIsRunning(true);
      await addReview(); // Add first review immediately
      startCountdown(); // Start countdown
      intervalRef.current = window.setInterval(addReview, delay * 1000);
    }
  };

  const stopReviewGeneration = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      clearInterval(countdownIntervalRef.current);
      setIsRunning(false);
      setCountdown(0);
    }
  };

  const clearAllReviews = () => {
    setReviews([]);
    stopReviewGeneration();
  };

  const handleDelayChange = (newDelay: number) => {
    setDelay(newDelay);
    if (isRunning) {
      // Restart the interval with the new delay
      clearInterval(intervalRef.current);
      clearInterval(countdownIntervalRef.current);
      setCountdown(newDelay);
      startCountdown();
      intervalRef.current = window.setInterval(addReview, newDelay * 1000);
    }
  };

  // Calculate number of alerts (negative reviews)
  const alertCount = reviews.filter(review => review.sentiment === 'negative').length;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Title Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Review Analytics</h1>
              <p className="text-sm text-gray-500">AI-Powered Review Analysis and Insights Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <button
                onClick={isRunning ? stopReviewGeneration : startReviewGeneration}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isRunning
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </>
                )}
              </button>
              <button
                onClick={clearAllReviews}
                className="flex items-center px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </button>
              {isRunning && (
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-md">
                  <Timer className="w-4 h-4" />
                  <span>Next review in: {countdown}s</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-600">
                Delay: {delay} seconds
              </label>
              <input
                type="range"
                min="5"
                max="60"
                value={delay}
                onChange={(e) => handleDelayChange(Number(e.target.value))}
                className="w-48"
              />
            </div>
          </div>

          <nav className="flex space-x-4">
            {[
              { id: 'reviews', label: 'Reviews' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'alerts', label: 'Alerts', count: alertCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-md relative ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'reviews' && <ReviewList reviews={reviews} />}
          {activeTab === 'analytics' && <AnalyticsDashboard reviews={reviews} />}
          {activeTab === 'alerts' && <AlertsTable reviews={reviews} />}
        </div>
      </div>
    </div>
  );
}

export default App;