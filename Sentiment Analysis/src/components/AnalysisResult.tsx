import React from 'react';
import { SentimentAnalysis } from '../types';
import SentimentMeter from './SentimentMeter';
import CommentsList from './CommentsList';
import SentimentStats from './SentimentStats';
import { ExternalLink, Clock, Tag } from 'lucide-react';

interface AnalysisResultProps {
  analysis: SentimentAnalysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  const { url, category, title, sentiment, keywords, summary, timestamp, comments } = analysis;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <ExternalLink size={16} className="mr-1" />
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
              {url}
            </a>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Tag size={16} className="mr-1" />
            <span className="capitalize">{category}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-1" />
            <span>{formatDate(timestamp)}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Sentiment Analysis</h3>
          <SentimentMeter 
            score={sentiment.score} 
            label={sentiment.label} 
            confidence={sentiment.confidence} 
          />
        </div>
        
        {summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}
        
        {keywords && keywords.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {comments && comments.length > 0 && (
        <>
          <SentimentStats comments={comments} />
          <CommentsList comments={comments} />
        </>
      )}
    </div>
  );
};

export default AnalysisResult;