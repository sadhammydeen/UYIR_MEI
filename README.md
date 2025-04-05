

## Chatbot Backend Setup

This project includes a Python backend for enhancing the chatbot with AI capabilities. To set up and run the backend:

1. Make sure you have Python 3.8+ installed on your system

2. Navigate to the server directory:
```sh
cd server
```

3. Install the required Python dependencies:
```sh
pip install -r requirements.txt
```

4. Start the Flask server:
```sh
python app.py
```

The backend will run on http://localhost:5000 by default and will serve as the API endpoint for the chatbot. The frontend is configured to automatically connect to this backend when it's available, with a fallback to local responses if the backend is unavailable.

Note: The chatbot now uses Hugging Face's free inference API, so no API key is required. It will work out of the box without any additional configuration.
