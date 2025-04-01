import React, { useState } from 'react';
import { SentimentCategory } from '../types';
import { Search, Loader2, Youtube, ShoppingBag, Newspaper, MessageCircle, FileText } from 'lucide-react';

interface SearchFormProps {
  onSubmit: (url: string, category: SentimentCategory) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<SentimentCategory>('youtube');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url, category);
    }
  };

  const categories: { value: SentimentCategory; label: string; icon: React.ReactNode }[] = [
    { value: 'youtube', label: 'YouTube', icon: <Youtube size={16} className="text-red-500" /> },
    { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingBag size={16} className="text-blue-500" /> },
    { value: 'news', label: 'News', icon: <Newspaper size={16} className="text-gray-700" /> },
    { value: 'social', label: 'Social Media', icon: <MessageCircle size={16} className="text-purple-500" /> },
    { value: 'blog', label: 'Blog', icon: <FileText size={16} className="text-green-500" /> }
  ];

  // Provide a sample URL based on the selected category
  const getPlaceholder = () => {
    switch (category) {
      case 'youtube':
        return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      case 'ecommerce':
        return 'https://www.amazon.com/product-page';
      case 'news':
        return 'https://www.bbc.com/news/article';
      case 'social':
        return 'https://twitter.com/username/status/123456789';
      case 'blog':
        return 'https://medium.com/blog-post';
      default:
        return 'https://example.com';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Enter URL
          </label>
          <div className="relative">
            <input
              type="url"
              id="url"
              placeholder={getPlaceholder()}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="md:w-48">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as SentimentCategory)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="md:self-end">
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              category === cat.value 
                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </form>
  );
};

export default SearchForm;