# Solana Sage

Solana Sage is an AI-powered platform built for developers and learners. It allows users to input natural language queries and receive instantly generated Solana smart contract code using the Anchor framework.

Website: [Click Here](https://solana-sage-1mok.vercel.app/)

Video: [Click Here](https://youtu.be/cgy6Iwsa0Qo)

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) database (local or cloud, e.g., [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/naman-0105/Solana-Sage.git
cd Solana-Sage
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_google_gemini_api_key
```

- Replace `your_mongodb_connection_string` with your actual MongoDB URI.
- Replace `your_google_gemini_api_key` with your Gemini API key.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🧪 Available Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm start` — Start the production server
- `npm run lint` — Run ESLint

---
