# To view the API logs of Chatbot

To view basic GET/POST logs and edit the chatbot

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
    
    Install the required library using pip:

    ```bash
    pip install -r requirements.txt
    ```



4.  **Run the Chatbot:**
    

    ```bash
    python app.py
    ```
    

## Deactivating the Virtual Environment (Optional)

When you are finished working with the project, you can deactivate the virtual environment:

```bash
deactivate
