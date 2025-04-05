# Uyir Mei AI Chatbot Integration

This document provides detailed information about the AI-powered chatbot integration for the Uyir Mei website.

## Overview

The chatbot integration consists of two main components:

1. **Frontend Component**: A React-based chatbot UI that provides a user-friendly interface for interacting with the AI.
2. **Python Backend**: A Flask-based API server that handles AI processing using Hugging Face's free API service.

The system is designed with a fallback mechanism - if the Python backend is unavailable, the chatbot will still function with a limited set of predefined responses.

## Features

- **AI-Powered Responses**: Leverages Hugging Face's free API for intelligent, context-aware responses.
- **Knowledge Base Integration**: Contains a structured knowledge base of information about Uyir Mei.
- **Web Resource Suggestions**: Can suggest relevant links and resources based on user queries.
- **Feedback Collection**: Users can provide feedback on responses to help improve the system.
- **Fallback Mechanism**: Functions even when the backend is unavailable.
- **Theme Switching**: Supports both light and dark themes for accessibility.

## Setup Instructions

### Frontend Setup

The frontend component is already integrated into the Uyir Mei website. It consists of:

- `Chatbot.tsx`: The main chatbot component with UI and logic
- `ChatbotButton.tsx`: The button component for opening/closing the chatbot

Dependencies:
- React
- Axios (for API communication)
- Lucide React (for icons)

### Backend Setup

To set up the Python backend:

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```
   python app.py
   ```

The server will run on http://localhost:5000 and expose the following endpoints:
- `GET /api/status`: Returns the status of the API
- `POST /api/chat`: Processes chat messages and returns AI responses

## How It Works

### Communication Flow

1. User sends a message through the chatbot UI
2. The frontend attempts to connect to the Python backend
3. If connected, the message is sent to the backend for processing
4. The backend checks the knowledge base for a match first
5. If no match is found, it sends the query to Hugging Face's API
6. The response is returned to the frontend and displayed to the user
7. If the backend is unavailable, the frontend falls back to local processing

### Knowledge Base

The knowledge base is stored in `server/knowledge_base.json` and contains structured information about:
- Donation information
- Volunteer opportunities
- Services provided
- Contact information
- Organization details
- Event information

Each topic has:
- A descriptive text
- Related links/resources
- Associated keywords for matching

## Customization

### Adding to the Knowledge Base

To add new information to the knowledge base, edit the `knowledge_base.json` file and add new topics with:
- Description text
- Related links
- Keywords for matching

### Modifying the UI

The chatbot UI can be customized by editing the `Chatbot.tsx` file:
- Change colors by modifying the CSS classes
- Adjust the chatbot size and position
- Modify the suggested questions
- Change the welcome message

### Extending Functionality

To extend the chatbot's functionality:
1. Add new API endpoints in `app.py`
2. Implement additional frontend features in `Chatbot.tsx`
3. Expand the knowledge base with more topics

## Deployment

For production deployment:
1. Configure the backend with production settings
2. Set `FLASK_ENV=production` in the `.env` file
3. Consider deploying the Flask application with Gunicorn or similar WSGI server
4. Update the `API_URL` constant in the frontend to point to your production API endpoint

## Troubleshooting

Common issues:
- **Backend Connection Fails**: Ensure the Flask server is running and accessible
- **API Rate Limits**: The free Hugging Face API has rate limits; implement caching if necessary
- **Knowledge Base Not Loading**: Check the file path and JSON structure

## Benefits of Free API Integration

- **No API Key Required**: The system now uses Hugging Face's free inference API, which doesn't require authentication for basic usage
- **No Costs**: Free to use without any billing concerns
- **Easy Setup**: Simplified setup without needing to manage API keys
- **Production Ready**: Can be deployed to production immediately

## Future Enhancements

Potential improvements:
- Integration with a vector database for more advanced knowledge retrieval
- User session tracking for personalized responses
- Integration with Uyir Mei's internal systems for real-time data
- Multi-language support for regional languages
- Voice interaction capabilities
- API caching layer to reduce external API calls 