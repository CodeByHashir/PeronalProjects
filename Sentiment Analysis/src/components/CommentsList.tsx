import React, { useState, useMemo } from 'react';
import { Comment, SentimentLabel } from '../types';
import { MessageSquare, ThumbsUp, ThumbsDown, Minus, Heart, MessageCircle } from 'lucide-react';

interface CommentsListProps {
  comments: Comment[];
}

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  const [selectedSentiments, setSelectedSentiments] = useState<SentimentLabel[]>(['positive', 'negative', 'neutral']);

  const toggleSentiment = (sentiment: SentimentLabel) => {
    if (selectedSentiments.includes(sentiment)) {
      setSelectedSentiments(selectedSentiments.filter(s => s !== sentiment));
    } else {
      setSelectedSentiments([...selectedSentiments, sentiment]);
    }
  };

  const filteredComments = useMemo(() => {
    return comments.filter(comment => selectedSentiments.includes(comment.sentiment));
  }, [comments, selectedSentiments]);

  const sentimentCounts = useMemo(() => {
    return {
      positive: comments.filter(c => c.sentiment === 'positive').length,
      negative: comments.filter(c => c.sentiment === 'negative').length,
      neutral: comments.filter(c => c.sentiment === 'neutral').length
    };
  }, [comments]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  const getSentimentIcon = (sentiment: SentimentLabel) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp size={16} className="text-green-500" />;
      case 'negative':
        return <ThumbsDown size={16} className="text-red-500" />;
      case 'neutral':
        return <Minus size={16} className="text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <MessageSquare size={20} className="mr-2" />
          Comments Analysis
        </h3>
        <div className="text-sm text-gray-600">
          Showing {filteredComments.length} of {comments.length} comments
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="text-sm font-medium text-gray-700 mr-2">Filter by sentiment:</div>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedSentiments.includes('positive')}
            onChange={() => toggleSentiment('positive')}
            className="rounded text-green-500 focus:ring-green-500"
          />
          <span className="flex items-center text-sm">
            <ThumbsUp size={16} className="text-green-500 mr-1" />
            Positive ({sentimentCounts.positive})
          </span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedSentiments.includes('negative')}
            onChange={() => toggleSentiment('negative')}
            className="rounded text-red-500 focus:ring-red-500"
          />
          <span className="flex items-center text-sm">
            <ThumbsDown size={16} className="text-red-500 mr-1" />
            Negative ({sentimentCounts.negative})
          </span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedSentiments.includes('neutral')}
            onChange={() => toggleSentiment('neutral')}
            className="rounded text-yellow-500 focus:ring-yellow-500"
          />
          <span className="flex items-center text-sm">
            <Minus size={16} className="text-yellow-500 mr-1" />
            Neutral ({sentimentCounts.neutral})
          </span>
        </label>
      </div>

      {filteredComments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No comments match your filter selection.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map(comment => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-gray-800">{comment.author}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                  {getSentimentIcon(comment.sentiment)}
                </div>
              </div>
              <p className="text-gray-700">{comment.text}</p>
              
              {/* Comment engagement metrics */}
              {(comment.likes !== undefined || comment.replies !== undefined) && (
                <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                  {comment.likes !== undefined && (
                    <div className="flex items-center">
                      <Heart size={12} className="mr-1" />
                      <span>{comment.likes}</span>
                    </div>
                  )}
                  {comment.replies !== undefined && comment.replies > 0 && (
                    <div className="flex items-center">
                      <MessageCircle size={12} className="mr-1" />
                      <span>{comment.replies} replies</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsList;