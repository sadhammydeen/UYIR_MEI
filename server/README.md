# Simple AI Chatbot with Gemini (Terminal)

This README provides instructions on how to set up and run a basic AI chatbot powered by Google's Gemini 2.0 Flash model directly in your terminal. It includes steps for creating a virtual environment, installing necessary dependencies, and running the Python application (`app.py`).

## Prerequisites

* **Python 3.9 or higher:** Ensure you have Python 3.9 or a later version installed on your system. You can check your Python version by running `python --version` or `python3 --version` in your terminal.
* **pip:** Python package installer (usually comes with Python).
* **Google Cloud Project and API Key:** You will need a Google Cloud Project and an API key for the Gemini API. You can obtain this from [Google AI Studio](https://makersuite.google.com/).

## Setup Instructions

1.  **Create a Virtual Environment:**
    It's recommended to create a virtual environment to isolate the project dependencies. Open your terminal and navigate to the project directory (where `app.py` will reside). Then, run:

    ```bash
    python -m venv venv
    # On some systems, you might need to use:
    # python3 -m venv venv
    ```

2.  **Activate the Virtual Environment:**
    Activate the virtual environment based on your operating system:

    * **Linux/macOS:**
        ```bash
        source venv/bin/activate
        ```
    * **Windows:**
        ```bash
        venv\Scripts\activate
        ```

    Your terminal prompt should now be prefixed with `(venv)`.

3.  **Install Dependencies:**
    Create a `requirements.txt` file in your project directory with the following content:

    ```
    google-genai
    ```

    Then, install the required library using pip:

    ```bash
    pip install -r requirements.txt
    ```

4.  **Create `app.py`:**
    Create a Python file named `app.py` in your project directory with the following basic chatbot code. **Remember to replace `'YOUR_API_KEY'` with your actual Google AI API key.**

    ```python
    from google import genai
    import os

    # Configure the Gemini API with your API key
    genai.configure(api_key=os.environ.get("GOOGLE_API_KEY") or "YOUR_API_KEY")

    # Select the Gemini 2.0 Flash model
    model = genai.GenerativeModel('gemini-2.0-flash')

    # Start a chat session
    chat = model.start_chat()

    print("Simple Gemini Chatbot (Terminal)")
    print("Type 'exit' to quit.")

    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            break

        try:
            response = chat.send_message(user_input)
            print(f"Bot: {response.text}")
        except Exception as e:
            print(f"Error generating response: {e}")

    print("Chatbot session ended.")
    ```

    **Important:** For better security, it's recommended to set your API key as an environment variable instead of hardcoding it directly in the script. You can do this before running the script:

    * **Linux/macOS:**
        ```bash
        export GOOGLE_API_KEY="YOUR_API_KEY"
        ```
    * **Windows (Command Prompt):**
        ```bash
        set GOOGLE_API_KEY="YOUR_API_KEY"
        ```
    * **Windows (PowerShell):**
        ```powershell
        $env:GOOGLE_API_KEY = "YOUR_API_KEY"
        ```

5.  **Run the Chatbot:**
    Navigate to your project directory in the terminal (if you aren't already there) and run the `app.py` script:

    ```bash
    python app.py
    ```

    You should see the "Simple Gemini Chatbot (Terminal)" message. You can now type your messages and interact with the Gemini 2.0 Flash model.

## Viewing API Logs (Basic)

This simple setup doesn't directly provide detailed API logs in the terminal. However, you can get basic feedback on errors that occur during API calls, as demonstrated by the `try...except` block in the `app.py` script. Any exceptions raised during the `chat.send_message()` call will be printed to the terminal.

For more comprehensive API logging, you would typically need to integrate with a logging service or implement more advanced logging within your application using Python's `logging` module or a dedicated library. Google Cloud also provides monitoring and logging tools that you can explore for more in-depth insights into your API usage if you are deploying a more substantial application.

## Deactivating the Virtual Environment (Optional)

When you are finished working with the project, you can deactivate the virtual environment:

```bash
deactivate