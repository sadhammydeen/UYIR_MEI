import os
import time
import json
import re
import hashlib
from datetime import datetime
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import google.generativeai as genai
import requests
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Configure Google Generative AI with your API key and initialize the model
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash"
)
# ---- Global Variables for Caching ----
response_cache = {}
CACHE_TIMEOUT = 3600  # seconds

# ---- Helper Functions ----

def analyze_sentiment(query):
    """Simple sentiment analysis based on keyword counts."""
    query_lower = query.lower()
    positive_words = ["thank", "good", "great", "excellent", "appreciate", "help", "love", "like"]
    negative_words = ["bad", "poor", "terrible", "unhelpful", "hate", "dislike", "worst"]

    positive_score = sum(1 for word in positive_words if word in query_lower)
    negative_score = sum(1 for word in negative_words if word in query_lower)

    if positive_score > negative_score:
        return "positive"
    elif negative_score > positive_score:
        return "negative"
    else:
        return "neutral"

def check_knowledge_base(query):
    """Check the local knowledge base (if available) for an answer."""
    try:
        with open('knowledge_base.json', 'r') as file:
            knowledge_base = json.load(file)
        query_lower = query.lower()
        for topic, keywords in knowledge_base.get("topic_keywords", {}).items():
            if any(keyword in query_lower for keyword in keywords):
                if topic in knowledge_base.get("knowledge_base", {}):
                    kb_entry = knowledge_base["knowledge_base"][topic]
                    return {
                        "text": kb_entry.get("text", ""),
                        "links": kb_entry.get("links", []),
                        "source": "kb"
                    }
        return None
    except Exception as e:
        print(f"Error checking knowledge base: {e}")
        return None

def search_web_resources(query):
    """Simulated web resources search for fallback information."""
    time.sleep(0.5)  # simulate delay
    query_lower = query.lower()
    
    if "donate" in query_lower:
        return [
            {
                "title": "Ways to Give - Uyir Mei",
                "url": "/give",
                "description": "Explore different ways to donate to our cause."
            },
            {
                "title": "Impact of Your Donation",
                "url": "/impact",
                "description": "See how your donations make a difference in lives."
            },
            {
                "title": "Tax Benefits for Donors",
                "url": "/tax-benefits",
                "description": "Learn about tax benefits available for your donations."
            }
        ]
    elif "volunteer" in query_lower:
        return [
            {
                "title": "Volunteer Opportunities - Uyir Mei",
                "url": "/get-involved",
                "description": "Find volunteer opportunities that match your skills."
            },
            {
                "title": "Volunteer Training Programs",
                "url": "/volunteer-training",
                "description": "Access our specialized training programs for volunteers."
            },
            {
                "title": "Volunteer Success Stories",
                "url": "/volunteer-stories",
                "description": "Read inspiring stories from our volunteers."
            }
        ]
    elif "contact" in query_lower:
        return [
            {
                "title": "Contact Us - Uyir Mei",
                "url": "/contact",
                "description": "Get in touch with our team."
            },
            {
                "title": "Office Locations",
                "url": "/locations",
                "description": "Find our offices across different regions."
            }
        ]
    elif "services" in query_lower or "help" in query_lower:
        return [
            {
                "title": "Our Services - Uyir Mei",
                "url": "/services",
                "description": "Learn about our education, healthcare, and community development programs."
            },
            {
                "title": "Eligibility Criteria",
                "url": "/eligibility",
                "description": "Check if you're eligible for our support services."
            },
            {
                "title": "Success Stories",
                "url": "/success-stories",
                "description": "Read about people we've helped through our programs."
            }
        ]
    else:
        return []

def generate_cache_key(query, messages):
    """Generate a cache key using the query and the last two messages of conversation."""
    recent_messages = messages[-2:] if messages and len(messages) >= 2 else messages or []
    context = '|'.join([msg.get('text', '') for msg in recent_messages])
    combined = f"{query.lower().strip()}|{context}"
    return hashlib.md5(combined.encode()).hexdigest()

def get_ai_response(messages, query):
    """Get an AI response by checking the knowledge base, then querying the Gemini model, and finally applying enhancements."""
    try:
        cache_key = generate_cache_key(query, messages)
        if cache_key in response_cache and (time.time() - response_cache[cache_key]['timestamp']) < CACHE_TIMEOUT:
            print("Cache hit for query:", query)
            return response_cache[cache_key]['data']
        
        # Check if a direct answer exists in the knowledge base
        kb_response = check_knowledge_base(query)
        if kb_response:
            response_cache[cache_key] = {'data': kb_response, 'timestamp': time.time()}
            return kb_response

        # Analyze sentiment
        sentiment = analyze_sentiment(query)
        
        # Prepare chat history (ensure messages is a list of dicts with 'sender' and 'text')
        chat_history = messages if messages else []
        
        # Start a chat session with the Gemini model (uses chat history if provided)
        chat_session = model.start_chat(history=chat_history)
        response = chat_session.send_message(query)
        ai_text = response.text

        # If the AI response signals uncertainty, try offering web resources instead
        if any(phrase in ai_text.lower() for phrase in ["i don't know", "i'm not sure"]):
            web_resources = search_web_resources(query)
            if web_resources:
                web_response = {
                    "text": "I found some resources that might help answer your question:",
                    "links": web_resources,
                    "source": "web",
                    "sentiment": sentiment
                }
                response_cache[cache_key] = {'data': web_response, 'timestamp': time.time()}
                return web_response

        # Enhance response based on sentiment
        if sentiment == "positive":
            ai_text += " I'm glad I could help! Is there anything else you'd like to know about Uyir Mei?"
        elif sentiment == "negative":
            ai_text = "I understand your concern. " + ai_text + " Please let me know if there's another way I can assist you."
        
        api_response = {"text": ai_text, "source": "ai", "sentiment": sentiment}
        response_cache[cache_key] = {'data': api_response, 'timestamp': time.time()}

        # Optional: Limit cache size by removing the oldest entry if too many items are stored
        if len(response_cache) > 100:
            oldest_key = min(response_cache, key=lambda k: response_cache[k]['timestamp'])
            del response_cache[oldest_key]

        return api_response

    except Exception as e:
        print(f"Error getting AI response: {e}")
        return {
            "text": "I'm having trouble processing your request. Please try again later.",
            "source": "error"
        }

# ---- API Endpoints ----

@app.route('/api/status', methods=['GET'])
def status():
    """Simple status endpoint for connection check."""
    return jsonify({
        "status": "online", 
        "service": "Chol (சொல்) AI Backend",
        "version": "2.0.0",
        "features": ["Knowledge Base", "Web Resources", "Response Caching", "Sentiment Analysis"]
    }), 200

@app.route('/api/chat', methods=['POST'])
def chat():
    """Processes user chat requests and returns AI-generated responses."""
    try:
        data = request.json
        user_input = data.get('message')
        messages = data.get('messages', [])
        
        if not user_input:
            return jsonify({"error": "No message provided"}), 400
            
        response_data = get_ai_response(messages, user_input)
        response_data['timestamp'] = datetime.now().isoformat()
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            "text": "I'm sorry, there was an error processing your request.",
            "source": "error",
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/stats', methods=['GET'])
def stats():
    """Returns basic statistics about the service."""
    try:
        return jsonify({
            "cache_size": len(response_cache),
            "cache_hit_ratio": "N/A",  # For production, implement proper tracking
            "uptime": "N/A",
            "version": "2.0.0"
        }), 200
    except Exception as e:
        print(f"Error in stats endpoint: {e}")
        return jsonify({"error": "Could not retrieve stats"}), 500

@app.route('/stream', methods=['POST'])
def stream():
    """Streams AI responses for real-time chat interactions using the Gemini model."""
    def generate():
        data = request.json
        msg = data.get('chat', '')
        chat_history = data.get('history', [])
        chat_session = model.start_chat(history=chat_history)
        response = chat_session.send_message(msg, stream=True)
        for chunk in response:
            yield f"{chunk.text}"
    return Response(stream_with_context(generate()), mimetype="text/event-stream")

# ---- Run the Server ----
if __name__ == '__main__':
    # Port can be set via the PORT environment variable; default to 5001 if not provided.
    app.run(debug=True, port=int(os.getenv("PORT", 5001)))
