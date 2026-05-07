# AI in Social Care

An interactive web application designed to help non-expert users explore how artificial intelligence works in social care contexts.

---

## Live Demo

Frontend: https://dissertation-app.netlify.app
Backend: Hosted on Render

Users can also access the application by scanning the QR code:

<img src="./public/qr-code.png" width="200" alt="QR code"/>

---

## Features

### AI Quiz

A short interactive quiz introducing key AI concepts and ethical issues such as bias and fairness.

### AI Guess Game

Users answer short questions, and the Gemini API generates a prediction (e.g. age, hobby, personality). This demonstrates that AI outputs are based on patterns rather than genuine understanding.

### AI Image Generation

Users enter an idea about AI in social care, and the Gemini API generates an image to show how generative AI interprets prompts.

---

## Tech Stack

### Frontend

- React
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- JSON

### AI integration

- Google Gemini API (@google/genai)

### Deployment

- Netlify
- Render

---

## Requirements

- Node.js
- npm
- Google Gemini API key

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Salmah1/dissertation-app.git
cd dissertation-app
```

### 2. Set up environment variables

Create a `.env` file inside the `server` folder:

```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Install frontend dependencies

From the project root:

```bash
npm install
```

### 4. Run the frontend

```bash
npm start
```

The frontend should run on:

```text
http://localhost:3000
```

### 5. Run the backend

Open a second terminal and run:

```bash
cd server
npm install
node index.js
```

The backend should run on:

```text
http://localhost:3001
```

---

## Notes

The application requires a valid Gemini API key for prediction and image generation features. If the API fails or does not return a valid response, fallback outputs are displayed to maintain application continuity.

---

### Author

Salmah Abdullahi
