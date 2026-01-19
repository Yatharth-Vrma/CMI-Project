# Health Insight Dashboard – Vaccine Market Analytics Platform

A full-stack web dashboard to visualize synthetic global vaccine market data with interactive filters, KPIs, and charts.

## 🚀 Features

### Frontend (Next.js + TypeScript)
- **Interactive Dashboard:** 5+ dynamic charts (Line, Bar, Pie, Doughnut, Radar).
- **Advanced Filtering:** Filter data by **Region**, **Brand**, and **Year** (dynamically populated).
- **Key Performance Indicators (KPIs):** Real-time calculation of CAGR, Total Market Size, and Average Price.
- **AI Integration:** "Generate AI Insights" button powered by OpenAI's `gpt-3.5-turbo` to analyze current market stats.
- **Dark/Light Mode:** Seamless theme switching with persistent user preference.
- **Responsive Design:** Fully responsive grid layout optimized for desktop and mobile.

### Backend (Node.js + Express)
- **RESTful API:** Modular endpoints for vaccines, summaries, and metadata.
- **Data Processing:** Server-side filtering and aggregation logic.
- **GenAI Controller:** Integration with OpenAI API for automated business insights.

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your OpenAI API Key (optional for AI features)
echo "OPENAI_API_KEY=sk-your-key-here" > .env
npm run dev
```
*The backend will start on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start on `http://localhost:3000`*

---

## 📸 Screenshots
*(Placeholders for actual screenshots)*

| Dashboard Light | Dashboard Dark |
| :---: | :---: |
| ![Light Mode](public/placeholder.txt) | ![Dark Mode](public/placeholder.txt) |

---

## 🔗 Deployment

- **Frontend:** [https://health-insight-dashboard.vercel.app](https://example.com) (Example Link)
- **Backend:** [https://health-insight-api.onrender.com](https://example.com) (Example Link)

---

## 📂 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── utils/         # Data loaders
│   │   └── data/          # JSON/CSV datasets
│
├── frontend/
│   ├── components/        # Reusable UI charts & cards
│   ├── pages/             # Next.js pages
│   ├── styles/            # CSS & Theme variables
│   └── utils/             # API helpers & Contexts
```

## 📝 Assignment Checklist

- [x] **Backend:** Node.js/Express APIs with filters.
- [x] **Frontend:** React/Next.js with Sidebar & Dropdowns.
- [x] **Charts:** 5 Interactive Charts (Bar, Line, Pie, Doughnut, Radar).
- [x] **KPIs:** CAGR, Market Size, Avg Price.
- [x] **Bonus:** GenAI Insight Integration.
- [x] **Bonus:** Dark Mode Support.
- [x] **Bonus:** Dynamic Filters (Year, etc.).

---
*Built for the AI & Full Stack Intern Assignment.*