import React, { useState } from 'react';
import { SentimentAnalysis, SentimentCategory, TextAnalysisRequest, TextAnalysisResponse } from './types';
import { analyzeSentiment } from './utils/mockApi';
import SearchForm from './components/SearchForm';
import TextAnalysisForm from './components/TextAnalysisForm';
import AnalysisResult from './components/AnalysisResult';
import { BarChart2, AlertCircle } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SentimentAnalysis | null>(null);

  const handleAnalyze = async (url: string, category: SentimentCategory) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzeSentiment(url, category);
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze the URL. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextAnalysis = async (request: TextAnalysisRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze text: ${response.statusText}`);
      }

      const result: TextAnalysisResponse = await response.json();
      
      // Convert the response to match the existing analysis result format
      setAnalysisResult({
        url: '',
        category: 'blog',
        title: 'Direct Text Analysis',
        sentiment: {
          score: result.sentiment === 'positive' ? 1 : result.sentiment === 'negative' ? -1 : 0,
          label: result.sentiment,
          confidence: result.confidence,
        },
        timestamp: new Date().toISOString(),
        comments: [{
          id: 'text-analysis',
          text: request.text,
          author: 'User Input',
          timestamp: new Date().toISOString(),
          sentiment: result.sentiment,
        }],
      });
    } catch (err) {
      setError('Failed to analyze the text. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <BarChart2 size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Sentiment Analyzer</h1>
          </div>
          <p className="mt-2 text-gray-600">Analyze sentiment from URLs or direct text input</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 mb-10">
          <SearchForm onSubmit={handleAnalyze} isLoading={isLoading} />
          <TextAnalysisForm onSubmit={handleTextAnalysis} isLoading={isLoading} />
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Analyzing content...</p>
            </div>
          </div>
        )}
        
        {!isLoading && analysisResult && (
          <div className="mt-6">
            <AnalysisResult analysis={analysisResult} />
          </div>
        )}
        
        {!isLoading && !analysisResult && !error && (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
              <BarChart2 size={64} className="text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ready to Analyze</h2>
              <p className="text-gray-600 mb-4">
                Enter a URL, select a category, or input text directly to analyze sentiment.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">URL Analysis</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• YouTube videos</li>
                    <li>• E-commerce product pages</li>
                    <li>• News articles</li>
                    <li>• Social media posts</li>
                    <li>• Blog content</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Text Analysis</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Direct text input</li>
                    <li>• Entity recognition</li>
                    <li>• Aspect-based analysis</li>
                    <li>• Sentiment prediction</li>
                    <li>• Confidence scoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Sentiment Analyzer © {new Date().getFullYear()} | This is a demonstration application
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;