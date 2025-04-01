import { SentimentAnalysis, SentimentCategory, SentimentLabel, Comment } from '../types';
import { extractVideoId, fetchYouTubeComments, analyzeSentimentText } from './youtubeApi';

// This is a mock API service that simulates sentiment analysis
// In a real application, you would replace this with actual API calls

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random comments with different sentiments
const generateMockComments = (count: number): Comment[] => {
  const sentiments: SentimentLabel[] = ['positive', 'negative', 'neutral'];
  const commentTemplates = {
    positive: [
      "I really love this content! It's exactly what I was looking for.",
      "Great quality and very informative. Would recommend to others.",
      "This exceeded my expectations. Very well done!",
      "Fantastic content, I've learned so much from this.",
      "The best I've seen on this topic, very impressive."
    ],
    negative: [
      "I was disappointed with the quality of this content.",
      "Not what I expected at all, quite misleading.",
      "Too basic and doesn't cover important aspects of the topic.",
      "I found several inaccuracies in this content.",
      "Wouldn't recommend this to anyone, very poor quality."
    ],
    neutral: [
      "It's okay, nothing special but gets the job done.",
      "Average content, covers the basics but nothing more.",
      "Neither good nor bad, just standard information.",
      "It has some good points and some areas that could be improved.",
      "Fairly standard content on this topic."
    ]
  };
  
  const authors = [
    "Alex Johnson", "Sam Smith", "Taylor Wilson", 
    "Jordan Lee", "Casey Brown", "Morgan Davis",
    "Riley White", "Quinn Miller", "Jamie Garcia"
  ];
  
  return Array.from({ length: count }, (_, i) => {
    // Distribute sentiments somewhat evenly but with randomness
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const commentOptions = commentTemplates[sentiment];
    const text = commentOptions[Math.floor(Math.random() * commentOptions.length)];
    
    return {
      id: `comment-${i + 1}`,
      text,
      author: authors[Math.floor(Math.random() * authors.length)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      sentiment,
      likes: Math.floor(Math.random() * 50),
      replies: Math.floor(Math.random() * 5)
    };
  });
};

export const analyzeSentiment = async (url: string, category: SentimentCategory): Promise<SentimentAnalysis> => {
  // Simulate API call delay
  await delay(1500);
  
  let comments: Comment[] = [];
  let title = '';
  
  // For YouTube links, try to fetch real comments
  if (category === 'youtube') {
    const videoId = extractVideoId(url);
    if (videoId) {
      try {
        comments = await fetchYouTubeComments(videoId);
        title = `YouTube Video Analysis: ${url.split('v=')[1]}`;
      } catch (error) {
        console.error('Error fetching YouTube comments:', error);
        // Fallback to mock comments
        comments = generateMockComments(Math.floor(Math.random() * 10) + 15);
      }
    } else {
      // Invalid YouTube URL, use mock comments
      comments = generateMockComments(Math.floor(Math.random() * 10) + 15);
    }
  } else {
    // For non-YouTube categories, use mock comments
    comments = generateMockComments(Math.floor(Math.random() * 10) + 15);
  }
  
  // Calculate overall sentiment based on comments
  let totalScore = 0;
  comments.forEach(comment => {
    const sentimentScore = comment.sentiment === 'positive' ? 0.7 : 
                           comment.sentiment === 'negative' ? -0.7 : 0;
    totalScore += sentimentScore;
  });
  
  // Normalize the score
  const score = comments.length > 0 ? totalScore / comments.length : 0;
  
  let label: SentimentLabel;
  if (score > 0.3) {
    label = 'positive';
  } else if (score < -0.3) {
    label = 'negative';
  } else {
    label = 'neutral';
  }
  
  // Generate mock data based on URL and category
  const mockKeywords = [
    'technology', 'review', 'product', 'service', 'quality', 
    'price', 'value', 'experience', 'recommendation', 'comparison'
  ];
  
  // Select random keywords
  const keywords = Array.from(
    { length: Math.floor(Math.random() * 5) + 3 }, 
    () => mockKeywords[Math.floor(Math.random() * mockKeywords.length)]
  );
  
  // Generate mock title based on category if not already set
  if (!title) {
    switch (category) {
      case 'youtube':
        title = 'Video Review: Product Demonstration and Analysis';
        break;
      case 'ecommerce':
        title = 'Customer Reviews for Product on Online Store';
        break;
      case 'news':
        title = 'Breaking News: Latest Developments in Technology';
        break;
      case 'social':
        title = 'Social Media Discussions and Trending Topics';
        break;
      case 'blog':
        title = 'Blog Post: In-depth Analysis and Personal Opinions';
        break;
    }
  }
  
  // Calculate comment statistics
  const commentStats = {
    total: comments.length,
    positive: comments.filter(c => c.sentiment === 'positive').length,
    negative: comments.filter(c => c.sentiment === 'negative').length,
    neutral: comments.filter(c => c.sentiment === 'neutral').length
  };
  
  return {
    url,
    category,
    title,
    sentiment: {
      score,
      label,
      confidence: 0.7 + Math.random() * 0.3, // Random confidence between 0.7 and 1.0
    },
    keywords,
    summary: `Analysis of ${comments.length} comments shows an overall ${label} sentiment. ${commentStats.positive} positive, ${commentStats.negative} negative, and ${commentStats.neutral} neutral comments were found. The content discusses topics related to ${keywords.join(', ')}.`,
    timestamp: new Date().toISOString(),
    comments,
    commentStats
  };
};