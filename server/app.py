import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import json
import time
import re
from datetime import datetime
import hashlib

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Response cache
response_cache = {}
CACHE_TIMEOUT = 3600  # 1 hour

# Simple status endpoint for connection check
@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({
        "status": "online", 
        "service": "Chol (சொல்) AI Backend",
        "version": "2.0.0",
        "features": ["Knowledge Base", "Web Resources", "Response Caching", "Sentiment Analysis"]
    }), 200

# Analyze sentiment of the query
def analyze_sentiment(query):
    # Simple sentiment analysis based on keywords
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

# Check the knowledge base for an answer to the query
def check_knowledge_base(query):
    try:
        # Load knowledge base from file
        with open('knowledge_base.json', 'r') as file:
            knowledge_base = json.load(file)
        
        query = query.lower()
        
        # Check for matches in our knowledge base
        for topic, keywords in knowledge_base["topic_keywords"].items():
            # Check if any of the keywords match the query
            if any(keyword in query for keyword in keywords):
                if topic in knowledge_base["knowledge_base"]:
                    return {
                        "text": knowledge_base["knowledge_base"][topic]["text"],
                        "links": knowledge_base["knowledge_base"][topic].get("links", []),
                        "source": "kb"
                    }
        
        return None
    except Exception as e:
        print(f"Error checking knowledge base: {e}")
        return None

# Enhanced web resources search
def search_web_resources(query):
    # This would be replaced with a real search function in production
    time.sleep(0.5)  # Reduced simulation delay for better UX
    
    query_lower = query.lower()
    
    # Enhanced results with multiple resources per topic
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

# Generate cache key from the query and recent conversation history
def generate_cache_key(query, messages):
    # Use the query and last 2 messages to maintain context
    recent_messages = []
    if messages and len(messages) > 0:
        recent_messages = messages[-2:] if len(messages) >= 2 else messages
    
    context = '|'.join([msg.get('text', '') for msg in recent_messages])
    combined = f"{query.lower().strip()}|{context}"
    
    return hashlib.md5(combined.encode()).hexdigest()

# Get response from a free Hugging Face API with enhancements
def get_ai_response(messages, query):
    try:
        # Check cache first
        cache_key = generate_cache_key(query, messages)
        if cache_key in response_cache and (time.time() - response_cache[cache_key]['timestamp']) < CACHE_TIMEOUT:
            print("Cache hit for query:", query)
            return response_cache[cache_key]['data']
        
        # First check if we have a direct answer in our knowledge base
        kb_response = check_knowledge_base(query)
        if kb_response:
            # Store in cache
            response_cache[cache_key] = {
                'data': kb_response,
                'timestamp': time.time()
            }
            return kb_response
            
        # Get sentiment to enhance response appropriately
        sentiment = analyze_sentiment(query)
        
        # Format the prompt with chat history (last 3 messages for context)
        prompt = "You are Chol (சொல்), an AI assistant for Uyir Mei, a non-profit organization focused on community service in India. Provide helpful, accurate, and compassionate information about our services, donation options, volunteer opportunities, and other related inquiries. Keep responses concise and focused.\n\n"
        
        # Add recent chat history
        history_messages = messages[-3:] if len(messages) > 3 else messages
        for msg in history_messages:
            role = "Assistant" if msg["sender"] == "bot" else "User"
            prompt += f"{role}: {msg['text']}\n"
        
        # Add the current query
        prompt += f"User: {query}\nAssistant: "
        
        # Call the free HuggingFace Inference API
        API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"
        headers = {"Content-Type": "application/json"}
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 250,
                "temperature": 0.7,
                "return_full_text": False
            },
            "options": {
                "wait_for_model": True
            }
        }
        
        response = requests.post(API_URL, headers=headers, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            ai_response = result[0]["generated_text"] if isinstance(result, list) and len(result) > 0 else "I'm not sure how to respond to that."
            
            # Clean up the response if needed
            if ai_response.startswith("Assistant: "):
                ai_response = ai_response[len("Assistant: "):]
                
            # If the AI response indicates uncertainty or if query explicitly asks for resources
            if "I don't know" in ai_response.lower() or "I'm not sure" in ai_response.lower() or "resources" in query.lower():
                web_resources = search_web_resources(query)
                if web_resources:
                    web_response = {
                        "text": "I found some resources that might help answer your question:",
                        "links": web_resources,
                        "source": "web",
                        "sentiment": sentiment
                    }
                    # Save to cache
                    response_cache[cache_key] = {
                        'data': web_response,
                        'timestamp': time.time()
                    }
                    return web_response
            
            # Enhance the response based on sentiment
            if sentiment == "positive":
                ai_response += " I'm glad I could help! Is there anything else you'd like to know about Uyir Mei?"
            elif sentiment == "negative":
                ai_response = "I understand your concern. " + ai_response + " Please let me know if there's a different way I can assist you."
            
            api_response = {
                "text": ai_response,
                "source": "ai",
                "sentiment": sentiment
            }
            
            # Store in cache
            response_cache[cache_key] = {
                'data': api_response,
                'timestamp': time.time()
            }
            
            # Limit cache size
            if len(response_cache) > 100:  # Prevent excessive memory usage
                # Remove oldest entries
                oldest_key = min(response_cache.keys(), key=lambda k: response_cache[k]['timestamp'])
                del response_cache[oldest_key]
                
            return api_response
        else:
            # Fallback to simple response if API fails
            print(f"API call failed with status code: {response.status_code}")
            
            # Create a more helpful fallback response based on the query content
            query_terms = query.lower().split()
            fallback_topics = []
            
            if any(term in ["donate", "donation", "give", "money"] for term in query_terms):
                fallback_topics.append("donation options")
            if any(term in ["volunteer", "help", "time"] for term in query_terms):
                fallback_topics.append("volunteering opportunities")
            if any(term in ["service", "program", "assistance"] for term in query_terms):
                fallback_topics.append("our services")
            if any(term in ["contact", "reach", "email", "call"] for term in query_terms):
                fallback_topics.append("contact information")
            
            if fallback_topics:
                topic_text = ", ".join(fallback_topics[:-1])
                if len(fallback_topics) > 1:
                    topic_text += f" and {fallback_topics[-1]}"
                else:
                    topic_text = fallback_topics[0]
                
                fallback_text = f"I understand you want to know about {topic_text}. You can find detailed information on our website or by calling our helpline at +91-XXXXXXXX."
            else:
                fallback_text = "I understand you want to know about " + query + ". Let me provide some general information. Uyir Mei offers services in education, healthcare, and community development. Please check our website for specific details or ask a more specific question."
            
            fallback_response = {
                "text": fallback_text,
                "source": "fallback",
                "sentiment": sentiment
            }
            
            # Don't cache fallback responses from API failures
            return fallback_response
            
    except Exception as e:
        print(f"Error getting AI response: {e}")
        return {
            "text": "I'm having trouble processing your request. Please try again later.",
            "source": "error"
        }

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_input = data.get('message')
        messages = data.get('messages', [])
        
        if not user_input:
            return jsonify({"error": "No message provided"}), 400
            
        response = get_ai_response(messages, user_input)
        
        # Add timestamp for the client
        response['timestamp'] = datetime.now().isoformat()
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            "text": "I'm sorry, there was an error processing your request.",
            "source": "error",
            "timestamp": datetime.now().isoformat()
        }), 500

# Statistics endpoint
@app.route('/api/stats', methods=['GET'])
def stats():
    try:
        return jsonify({
            "cache_size": len(response_cache),
            "cache_hit_ratio": "N/A",  # Would track this properly in production
            "uptime": "N/A",  # Would track this properly in production
            "version": "2.0.0"
        }), 200
    except Exception as e:
        print(f"Error in stats endpoint: {e}")
        return jsonify({"error": "Could not retrieve stats"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) 