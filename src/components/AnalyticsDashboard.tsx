import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, LineChart as LineChartIcon } from 'lucide-react';
import type { Review } from '../types';

interface AnalyticsDashboardProps {
  reviews: Review[];
}

export function AnalyticsDashboard({ reviews }: AnalyticsDashboardProps) {
  const insights = useMemo(() => {
    // Initialize counts with all possible sentiments to ensure they're always present
    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0
    };
    
    // Count reviews by sentiment
    reviews.forEach(review => {
      sentimentCounts[review.sentiment]++;
    });

    const sourceCounts = reviews.reduce((acc, review) => {
      acc[review.source] = (acc[review.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const productSentiments = reviews.reduce((acc, review) => {
      if (!acc[review.productName]) {
        acc[review.productName] = { positive: 0, neutral: 0, negative: 0, total: 0 };
      }
      acc[review.productName][review.sentiment]++;
      acc[review.productName].total++;
      return acc;
    }, {} as Record<string, { positive: number; neutral: number; negative: number; total: number }>);

    // Calculate trends and insights
    const totalReviews = reviews.length;
    const negativePercentage = totalReviews > 0 ? (sentimentCounts.negative / totalReviews * 100) : 0;
    const positivePercentage = totalReviews > 0 ? (sentimentCounts.positive / totalReviews * 100) : 0;

    // Find products with most negative reviews
    const productsWithIssues = Object.entries(productSentiments)
      .map(([name, stats]) => ({
        name,
        negativePercentage: (stats.negative / stats.total) * 100,
        total: stats.total
      }))
      .filter(product => product.negativePercentage > 30 && product.total >= 3) // Only consider products with at least 3 reviews
      .sort((a, b) => b.negativePercentage - a.negativePercentage);

    // Find most successful products
    const successfulProducts = Object.entries(productSentiments)
      .map(([name, stats]) => ({
        name,
        positivePercentage: (stats.positive / stats.total) * 100,
        total: stats.total
      }))
      .filter(product => product.positivePercentage > 70 && product.total >= 3) // Only consider products with at least 3 reviews
      .sort((a, b) => b.positivePercentage - a.positivePercentage);

    return {
      sentimentCounts,
      sourceCounts,
      negativePercentage,
      positivePercentage,
      productsWithIssues,
      successfulProducts
    };
  }, [reviews]);

  // Transform sentiment counts into pie chart data with proper ordering and consistent naming
  const pieData = [
    { name: 'Positive', value: insights.sentimentCounts.positive, color: '#4CAF50' },
    { name: 'Neutral', value: insights.sentimentCounts.neutral, color: '#FFC107' },
    { name: 'Negative', value: insights.sentimentCounts.negative, color: '#EF5350' }
  ].filter(item => item.value > 0); // Only show segments with values

  const barData = Object.entries(insights.sourceCounts).map(([name, Count]) => ({ name, Count }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
          {reviews.length > 0 ? (
            <PieChart width={600} height={400}>
              <Pie
                data={pieData}
                cx={300}
                cy={180}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                }
                labelLine={{ strokeWidth: 1.5, stroke: '#666666' }}
                paddingAngle={5}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              No reviews available
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Reviews by Source</h3>
          {reviews.length > 0 ? (
            <BarChart width={500} height={400} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Count" fill="#3B82F6" />
            </BarChart>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              No reviews available
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <LineChartIcon className="w-6 h-6 mr-2 text-blue-600" />
          AI-Driven Insights & Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2 text-blue-800">Key Metrics</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Positive Sentiment Rate:</span>
                <span className="font-semibold text-green-600">
                  {insights.positivePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Negative Sentiment Rate:</span>
                <span className="font-semibold text-red-600">
                  {insights.negativePercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2 text-green-800">Top Performing Products</h4>
            <div className="space-y-2">
              {insights.successfulProducts.slice(0, 3).map(product => (
                <div key={product.name} className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-gray-700">{product.name}</span>
                  <span className="ml-auto text-green-600 font-semibold">
                    {product.positivePercentage.toFixed(1)}% positive
                  </span>
                </div>
              ))}
              {insights.successfulProducts.length === 0 && (
                <div className="text-gray-500">Not enough data yet</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
              Attention Required
            </h4>
            <div className="space-y-2">
              {insights.productsWithIssues.map(product => (
                <div key={product.name} className="flex items-center text-gray-700">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
                  {product.name}
                  <span className="ml-2 text-red-500">
                    ({product.negativePercentage.toFixed(1)}% negative feedback)
                  </span>
                </div>
              ))}
              {insights.productsWithIssues.length === 0 && (
                <div className="text-gray-500">No critical issues detected</div>
              )}
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
              Recommendations
            </h4>
            <ul className="space-y-2 text-gray-700">
              {insights.negativePercentage > 20 && (
                <li className="flex items-start">
                  <span className="font-medium">High Priority:</span>
                  <span className="ml-2">
                    Negative feedback rate is above threshold. Consider immediate review of product quality and customer service procedures.
                  </span>
                </li>
              )}
              {insights.productsWithIssues.length > 0 && (
                <li className="flex items-start">
                  <span className="font-medium">Product Focus:</span>
                  <span className="ml-2">
                    Conduct quality assessment for {insights.productsWithIssues[0].name} due to high negative feedback rate.
                  </span>
                </li>
              )}
              {Object.entries(insights.sourceCounts).length > 0 && (
                <li className="flex items-start">
                  <span className="font-medium">Channel Strategy:</span>
                  <span className="ml-2">
                    Focus customer engagement on {Object.entries(insights.sourceCounts)
                      .sort(([,a], [,b]) => b - a)[0][0]} where most feedback is received.
                  </span>
                </li>
              )}
              {reviews.length === 0 && (
                <li className="text-gray-500">Start collecting reviews to get recommendations</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}