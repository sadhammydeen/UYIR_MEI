# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0a49b9d3-e7e7-4266-8471-7f015a49e571

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0a49b9d3-e7e7-4266-8471-7f015a49e571) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0a49b9d3-e7e7-4266-8471-7f015a49e571) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

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
