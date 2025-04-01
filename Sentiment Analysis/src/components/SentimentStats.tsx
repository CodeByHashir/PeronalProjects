import React from 'react';
import { Comment, SentimentLabel } from '../types';
import { PieChart, BarChart2, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface SentimentStatsProps {
  comments: Comment[];
}

const SentimentStats: React.FC<SentimentStatsProps> = ({ comments }) => {
  // Calculate sentiment counts
  const sentimentCounts = {
    positive: comments.filter(c => c.sentiment === 'positive').length,
    negative: comments.filter(c => c.sentiment === 'negative').length,
    neutral: comments.filter(c => c.sentiment === 'neutral').length,
    total: comments.length
  };

  // Calculate percentages
  const percentages = {
    positive: Math.round((sentimentCounts.positive / sentimentCounts.total) * 100),
    negative: Math.round((sentimentCounts.negative / sentimentCounts.total) * 100),
    neutral: Math.round((sentimentCounts.neutral / sentimentCounts.total) * 100)
  };

  // Get sentiment with highest count
  const dominantSentiment = Object.entries(percentages)
    .sort(([, a], [, b]) => b - a)[0][0] as SentimentLabel;

  // Get color for sentiment
  const getSentimentColor = (sentiment: SentimentLabel): string => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      case 'neutral': return 'text-yellow-500';
    }
  };

  // Get icon for sentiment
  const getSentimentIcon = (sentiment: SentimentLabel) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp size={20} className="text-green-500" />;
      case 'negative': return <ThumbsDown size={20} className="text-red-500" />;
      case 'neutral': return <Minus size={20} className="text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto mt-6">
      <div className="flex items-center mb-4">
        <BarChart2 size={20} className="text-blue-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">Comment Sentiment Statistics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium text-green-800 flex items-center">
              <ThumbsUp size={16} className="mr-1" /> Positive
            </div>
            <div className="text-2xl font-bold text-green-600">{sentimentCounts.positive}</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${percentages.positive}%` }}
            ></div>
          </div>
          <div className="text-right text-sm mt-1 text-green-700">{percentages.positive}%</div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium text-yellow-800 flex items-center">
              <Minus size={16} className="mr-1" /> Neutral
            </div>
            <div className="text-2xl font-bold text-yellow-600">{sentimentCounts.neutral}</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-yellow-500 h-2.5 rounded-full" 
              style={{ width: `${percentages.neutral}%` }}
            ></div>
          </div>
          <div className="text-right text-sm mt-1 text-yellow-700">{percentages.neutral}%</div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium text-red-800 flex items-center">
              <ThumbsDown size={16} className="mr-1" /> Negative
            </div>
            <div className="text-2xl font-bold text-red-600">{sentimentCounts.negative}</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-red-500 h-2.5 rounded-full" 
              style={{ width: `${percentages.negative}%` }}
            ></div>
          </div>
          <div className="text-right text-sm mt-1 text-red-700">{percentages.negative}%</div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <PieChart size={24} className="text-blue-500 mr-2" />
          <div>
            <div className="text-sm text-gray-500">Dominant Sentiment</div>
            <div className="font-medium flex items-center">
              {getSentimentIcon(dominantSentiment)}
              <span className={`ml-1 capitalize ${getSentimentColor(dominantSentiment)}`}>
                {dominantSentiment}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Comments</div>
          <div className="text-xl font-bold text-gray-800">{sentimentCounts.total}</div>
        </div>
      </div>
    </div>
  );
};

export default SentimentStats;