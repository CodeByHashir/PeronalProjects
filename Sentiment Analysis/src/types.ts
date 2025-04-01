export type SentimentCategory = 'youtube' | 'ecommerce' | 'news' | 'social' | 'blog';
export type SentimentLabel = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  score: number;
  label: SentimentLabel;
  confidence: number;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  sentiment: SentimentLabel;
  likes?: number;
  replies?: number;
}

export interface SentimentAnalysis {
  url: string;
  category: SentimentCategory;
  title?: string;
  sentiment: SentimentResult;
  keywords?: string[];
  summary?: string;
  timestamp: string;
  comments: Comment[];
  commentStats?: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
  };
}

// New types for text-based sentiment analysis
export interface EntityAttribute {
  entity: string;
  attribute: string;
}

export interface TextAnalysisRequest {
  text: string;
  entity: string;
  attribute: string;
  ote?: string;
}

export interface TextAnalysisResponse {
  sentiment: SentimentLabel;
  confidence: number;
  model_version: string;
  processing_time_ms: number;
}

export const ENTITY_TYPES = ['RESTAURANT', 'FOOD', 'DRINKS', 'SERVICE', 'AMBIENCE', 'LOCATION'] as const;
export const ATTRIBUTE_TYPES = ['GENERAL', 'QUALITY', 'PRICES', 'STYLE_OPTIONS', 'MISCELLANEOUS'] as const;

export type EntityType = typeof ENTITY_TYPES[number];
export type AttributeType = typeof ATTRIBUTE_TYPES[number];