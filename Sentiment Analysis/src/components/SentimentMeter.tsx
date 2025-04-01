import React from 'react';

interface SentimentMeterProps {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

const SentimentMeter: React.FC<SentimentMeterProps> = ({ score, label, confidence }) => {
  // Convert score from -1...1 to 0...100 for the meter
  const percentage = ((score + 1) / 2) * 100;
  
  // Determine color based on sentiment label
  const getColor = () => {
    switch (label) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      case 'neutral':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-red-500">Negative</span>
        <span className="text-sm font-medium text-yellow-500">Neutral</span>
        <span className="text-sm font-medium text-green-500">Positive</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${getColor()}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="text-sm font-medium">
          Score: <span className="font-bold">{score.toFixed(2)}</span>
        </div>
        <div className="text-sm font-medium">
          Confidence: <span className="font-bold">{(confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentMeter;