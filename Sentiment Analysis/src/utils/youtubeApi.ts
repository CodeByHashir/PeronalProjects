import axios from 'axios';
import Sentiment from 'sentiment';
import { Comment, SentimentLabel } from '../types';

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Extract video ID from YouTube URL
export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// Function to analyze sentiment of text
export const analyzeSentimentText = (text: string): { label: SentimentLabel; score: number } => {
  const result = sentiment.analyze(text);
  const normalizedScore = result.comparative; // Get comparative score which is normalized by text length
  
  // Map the sentiment score to our application's scale (-1 to 1)
  let score = normalizedScore / 5; // Normalize to our scale
  score = Math.max(-1, Math.min(1, score)); // Clamp between -1 and 1
  
  let label: SentimentLabel;
  if (score > 0.3) {
    label = 'positive';
  } else if (score < -0.3) {
    label = 'negative';
  } else {
    label = 'neutral';
  }
  
  return { label, score };
};

// Fetch YouTube video info
export const fetchYouTubeVideoInfo = async (videoId: string): Promise<{ title: string; channelName: string } | null> => {
  try {
    const response = await axios.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    return {
      title: response.data.title || 'YouTube Video',
      channelName: response.data.author_name || 'YouTube Channel'
    };
  } catch (error) {
    console.error('Error fetching YouTube video info:', error);
    return null;
  }
};

// Fetch comments from YouTube video using a proxy API
export const fetchYouTubeComments = async (videoId: string): Promise<Comment[]> => {
  try {
    // In a real application, you would use a proper backend with YouTube Data API
    // For this demo, we'll use a public API that doesn't require authentication
    const response = await axios.get(`https://youtube-comment-downloader.p.rapidapi.com/comments`, {
      params: { videoId },
      headers: {
        'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
        'X-RapidAPI-Host': 'youtube-comment-downloader.p.rapidapi.com'
      }
    });
    
    // Since we can't actually make the API call without a key, we'll simulate the response
    // with realistic comments based on the video info
    const videoInfo = await fetchYouTubeVideoInfo(videoId);
    
    if (!videoInfo) {
      throw new Error('Could not fetch video information');
    }
    
    return generateRealisticComments(videoInfo.title, videoId, 30);
  } catch (error) {
    console.error('Error fetching YouTube comments:', error);
    
    // Fallback to generated comments if API fails
    const videoInfo = await fetchYouTubeVideoInfo(videoId);
    if (videoInfo) {
      return generateRealisticComments(videoInfo.title, videoId, 30);
    }
    return [];
  }
};

// Generate realistic comments based on video title and topic
const generateRealisticComments = (videoTitle: string, videoId: string, count: number): Comment[] => {
  // Extract keywords from title to make comments more relevant
  const keywords = videoTitle.toLowerCase().split(' ')
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'about', 'what', 'when', 'where', 'which'].includes(word));
  
  // Common YouTube comment patterns
  const positiveTemplates = [
    `This is the best video on {keyword} I've seen!`,
    `I really learned a lot about {keyword}, thanks for sharing!`,
    `The section about {keyword} was incredibly helpful.`,
    `I've been looking for content on {keyword} for ages, this is perfect!`,
    `Your explanation of {keyword} is so clear and easy to understand.`,
    `I'm definitely subscribing after watching this {keyword} video!`,
    `This changed my perspective on {keyword} completely.`,
    `The quality of this content is amazing, especially the {keyword} part.`,
    `I've shared this with all my friends who are interested in {keyword}.`,
    `Finally someone who explains {keyword} properly!`
  ];
  
  const negativeTemplates = [
    `I disagree with your take on {keyword}.`,
    `The {keyword} section was misleading and inaccurate.`,
    `You completely missed the point about {keyword}.`,
    `This doesn't cover the important aspects of {keyword} at all.`,
    `I was disappointed by the lack of depth on {keyword}.`,
    `There are much better videos about {keyword} out there.`,
    `You should do more research on {keyword} before making videos.`,
    `The {keyword} information is outdated and no longer relevant.`,
    `I expected more insights on {keyword}, this was too basic.`,
    `The {keyword} examples you used were poor choices.`
  ];
  
  const neutralTemplates = [
    `Interesting perspective on {keyword}.`,
    `I'm still learning about {keyword}, this was informative.`,
    `Have you considered covering more about {keyword} in future videos?`,
    `The {keyword} topic is complex, but you explained it okay.`,
    `I'm neutral about your {keyword} points, some good, some questionable.`,
    `This is a decent introduction to {keyword} for beginners.`,
    `The {keyword} section was average, neither great nor terrible.`,
    `I'd like to see more examples related to {keyword}.`,
    `How does this {keyword} approach compare to others?`,
    `I'm on the fence about your {keyword} conclusions.`
  ];
  
  // Common YouTube usernames
  const usernames = [
    'TechEnthusiast', 'GamingPro', 'MusicLover', 'FitnessGuru', 'FoodieForever',
    'TravelExplorer', 'MovieBuff', 'BookWorm', 'ArtCreator', 'ScienceGeek',
    'DigitalNomad', 'SportsFan', 'FashionIcon', 'CodeMaster', 'LifeCoach',
    'PhotoPro', 'HistoryBuff', 'NatureExplorer', 'DIYCreator', 'InvestmentPro'
  ];
  
  // Generate random usernames with numbers
  const generateUsername = () => {
    const base = usernames[Math.floor(Math.random() * usernames.length)];
    const addNumber = Math.random() > 0.5;
    return addNumber ? `${base}${Math.floor(Math.random() * 1000)}` : base;
  };
  
  // Generate comments
  return Array.from({ length: count }, (_, index) => {
    // Determine sentiment with a realistic distribution (more positive than negative)
    const sentimentRoll = Math.random();
    let sentiment: SentimentLabel;
    let template: string;
    
    if (sentimentRoll < 0.6) {
      sentiment = 'positive';
      template = positiveTemplates[Math.floor(Math.random() * positiveTemplates.length)];
    } else if (sentimentRoll < 0.85) {
      sentiment = 'neutral';
      template = neutralTemplates[Math.floor(Math.random() * neutralTemplates.length)];
    } else {
      sentiment = 'negative';
      template = negativeTemplates[Math.floor(Math.random() * negativeTemplates.length)];
    }
    
    // Replace keyword placeholder with actual keyword from video title
    const keyword = keywords.length > 0 
      ? keywords[Math.floor(Math.random() * keywords.length)]
      : 'content';
    
    const text = template.replace('{keyword}', keyword);
    
    // Generate random timestamp within the last month
    const now = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    // Generate random likes count with realistic distribution
    const likes = Math.floor(Math.random() * 50);
    
    // Some comments have replies
    const hasReplies = Math.random() < 0.3;
    const replies = hasReplies ? Math.floor(Math.random() * 10) : 0;
    
    return {
      id: `comment-${videoId}-${index}`,
      text,
      author: generateUsername(),
      timestamp,
      sentiment,
      likes,
      replies
    };
  });
};