# Health Insight Dashboard 🏥
### Next-Gen Vaccine Market Analytics Platform

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

</div>

<br />

**Health Insight** is a state-of-the-art analytics dashboard designed to visualize global vaccine market trends. Built with a focus on **User Experience (UX)** and **Performance**, it features a stunning glassmorphism UI, real-time interactive charts, and intelligent business insights powered by **Google's Gemini 1.5 Flash**.

---

## ✨ Key Features

### 🎨 Premium UI/UX
- **Glassmorphism Design:** A modern, translucent aesthetic with refined blur effects and depth.
- **Adaptive Theming:** Seamless **Light (Corporate Clean)** and **Dark (Cyberpunk/Neon)** modes that adjust chart gradients and global colors instantly.
- **Responsive Layout:** A fluid grid system that scales perfectly from 4K desktops to mobile devices.

### 🧠 AI-Powered Intelligence
- **Google Gemini Integration:** leverages the `gemini-1.5-flash` model to analyze filtered market data in real-time.
- **Executive Summaries:** Generates concise, context-aware business insights with a single click.

### 📊 Advanced Visualization
- **5+ Interactive Charts:** 
  - 📈 **Line Chart:** Multi-year growth trends with gradient fills.
  - 📊 **Bar Chart:** Regional performance metrics.
  - 🍩 **Doughnut Chart:** Market share distribution.
  - 🥧 **Pie Chart:** Brand dominance analysis.
  - 🕸️ **Radar Chart:** Price sensitivity and unit economics.
- **Dynamic Filtering:** Filter dataset by **Region**, **Brand**, and **Year** with auto-updating dropdowns.
- **Live KPIs:** Instant calculation of CAGR, Total Market Size, and Average Unit Price.

---

## 📸 Interface Preview

| **Light Mode (Day)** | **Dark Mode (Night)** |
|:---:|:---:|
| ![Light Mode](frontend/public/placeholder.txt) | ![Dark Mode](frontend/public/placeholder.txt) |
| *Clean, professional analytics.* | *High-contrast, immersive data.* |

---

## 🛠️ Technology Stack

- **Frontend:**
  - Framework: [Next.js 13+](https://nextjs.org/) (React)
  - Language: TypeScript
  - Styling: Custom CSS Variables + Glassmorphism
  - Visualization: [Chart.js](https://www.chartjs.org/) + `react-chartjs-2`
  
- **Backend:**
  - Runtime: [Node.js](https://nodejs.org/)
  - Framework: [Express](https://expressjs.com/)
  - AI Engine: `@google/generative-ai` (Gemini API)
  - Data: JSON/CSV (In-memory caching strategy)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- A [Google Cloud API Key](https://makersuite.google.com/app/apikey) for Gemini.

### 1. Backend Setup
The backend handles data processing and AI communication.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure Environment Variables
# Create a .env file and add your Google Gemini API Key
echo "PORT=5000" > .env
echo "GEMINI_API_KEY=your_actual_api_key_here" >> .env

# Start the Development Server
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Setup
The frontend delivers the user interface.

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the Development Server
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🔌 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/vaccines` | Fetch all vaccine records. Supports query params `region`, `brand`, `year`. |
| `GET` | `/api/vaccines/filters` | Returns unique available options for filter dropdowns. |
| `GET` | `/api/summary` | Returns aggregated KPIs (Market Size, CAGR, Avg Price) based on filters. |
| `GET` | `/api/insights` | Triggers **Gemini AI** analysis of the current filtered dataset. |

---

## 🏗️ Architecture

For a deep dive into the system architecture, please refer to our Codemaps:

- [Backend Architecture](docs/CODEMAPS/backend.md)
- [Frontend Architecture](docs/CODEMAPS/frontend.md)

## 📂 Project Structure

```bash
CMI-Project/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Logic for Insights (Gemini) & Data
│   │   ├── routes/        # Express Routes
│   │   ├── utils/         # Data Loaders
│   │   └── data/          # Source Datasets
│   └── .env               # API Keys (GitIgnored)
│
├── frontend/
│   ├── components/        # Reusable Charts & KPI Cards
│   ├── pages/             # Next.js Pages
│   ├── styles/            # Global CSS & Theme Variables
│   └── utils/             # API Fetchers & Theme Context
│
└── README.md              # Documentation
```

---

## 🔮 Future Roadmap

- [ ] **Database Integration:** Move from JSON to PostgreSQL/MongoDB for scalable data storage.
- [ ] **User Auth:** Add login/signup via NextAuth.js.
- [ ] **Export Reports:** PDF export functionality for generated AI insights.
- [ ] **Forecast Models:** Use simple linear regression for future market predictions.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <sub>Built with ❤️ by the AI & Full Stack Intern Team</sub>
</div>
