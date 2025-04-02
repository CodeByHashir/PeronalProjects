# Sentiment Analyzer

A modern sentiment analysis application that analyzes text from various sources including direct input, YouTube, e-commerce, news, social media, and blogs.

![Sentiment Analyzer Screenshot](screenshot.png)

## Overview

This application uses a custom sentiment analysis model to detect positive, negative, and neutral sentiments in text content. It features a React frontend and a Supabase Edge Function backend that performs the sentiment analysis using a custom implementation.

## Features

- **Direct Text Analysis**: Analyze any text input for sentiment
- **URL-based Analysis**: Mock integration with various platforms:
  - YouTube videos
  - E-commerce product reviews
  - News articles
  - Social media posts
  - Blog content
- **Sentiment Visualization**: Clear visual representation of sentiment with confidence scores
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**:
  - React with TypeScript
  - TailwindCSS for styling
  - Vite for development and building

- **Backend**:
  - Supabase Edge Functions (Deno runtime)
  - Custom sentiment analysis model

## Sentiment Analysis Model

The application uses a custom sentiment analysis model that:

- Identifies positive, negative, and neutral sentiments
- Handles negations (e.g., "not good" as negative)
- Processes intensifiers like exclamation marks
- Provides confidence scores
- Returns normalized sentiment scores from -1 (negative) to +1 (positive)

## Installation

### Prerequisites

- Node.js 16+
- npm or yarn
- Deno (for local Edge Function development)
- Supabase CLI (for deploying Edge Functions)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sentiment-analyzer.git
   cd sentiment-analyzer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase URL and anon key

4. Run development server:
   ```
   npm run dev
   ```

5. In a separate terminal, run the Edge Function locally:
   ```
   cd supabase/functions/analyze-text
   deno run --allow-read --allow-net --allow-env index.ts
   ```

## Usage

### Direct Text Analysis

1. Enter text in the "Text to Analyze" field
2. Click "Analyze Text"
3. View the sentiment results, including:
   - Sentiment classification (positive, negative, or neutral)
   - Confidence score
   - Visualization of sentiment score on a scale

### URL Analysis (Mock)

1. Enter a URL in the input field
2. Select the appropriate category (YouTube, e-commerce, etc.)
3. View the aggregated sentiment analysis for the content
4. Browse through sample comments/reviews with individual sentiment ratings

## Deployment

### Frontend

Deploy to Vercel, Netlify or any static hosting service:

```
npm run build
```

Then deploy the contents of the `dist` folder.

### Edge Function

Deploy to Supabase:

```
cd supabase/functions/analyze-text
supabase functions deploy analyze-text
```

## Project Structure

```
/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions and mock APIs
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── supabase/
│   └── functions/
│       └── analyze-text/ # Edge Function for sentiment analysis
│           ├── index.ts  # Entry point for Edge Function
│           └── model.ts  # Sentiment analysis model implementation
├── public/               # Static assets
└── index.html            # HTML template
```

## Future Improvements

- Implement real API integrations for YouTube, news, and blog platforms
- Add user authentication for saving analysis results
- Enhance the sentiment model with more advanced NLP techniques
- Add support for multiple languages
- Implement aspect-based sentiment analysis

## License

MIT License

## Acknowledgements

- [Supabase](https://supabase.com/) for the serverless backend
- [React](https://reactjs.org/) for the frontend framework
- [TailwindCSS](https://tailwindcss.com/) for styling
