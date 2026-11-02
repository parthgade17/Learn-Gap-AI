# LearnGap AI: From Learning Data to Classroom Action

> **India @ 71/100 Challenge • Techfest 2026–27, IIT Bombay**  
> **Theme 2: Foundational Learning Outcomes**  
> **Team SuperNova (TM-70E50988E4F) • Sanjivani University, Kopargaon**  
> **GitHub Repository:** [parthgade17/Learn-Gap-AI](https://github.com/parthgade17/Learn-Gap-AI.git)

---

## 🎯 Executive Summary & Problem Context

Primary-school assessment results (e.g. NIPUN Bharat, PARAKH Rashtriya Sarvekshan, state periodic assessments) record which foundational skills children have not yet mastered. However, classroom teachers in rural government primary schools lack a low-bandwidth, low-overhead workflow to convert raw assessment scores into **competency-specific remedial groups**, **actionable weekly teaching activities**, and **follow-up re-checks**.

**LearnGap AI** bridges this loop:
* **Installable Progressive Web App (PWA):** Installs as a native mobile app on low-cost Android phones and iOS devices; runs completely offline via Service Worker precaching and IndexedDB, syncing dynamically with **Supabase** when connectivity is detected.
* **Hybrid Deterministic + AI Prediction Engine:** Transparent, rule-based diagnostic gap engine combined with AI cohort outcome projections and individual student mastery velocity trajectories.
* **7 Core Academic Subjects:** Multi-subject coverage across **English, Mathematics, Social Science, Physics, Chemistry, Marathi (मराठी), and Hindi (हिंदी)**.
* **Multi-Class Architecture:** Seamless class switching across **Class 5th - A, 6th - A, 7th - A, and 8th - A**, with aggregated whole-school oversight for Head Teachers.
* **Circular Progress Gauges:** Circular SVG mastery graphs for both overall school/class cohort performance and individual student marksheet breakdowns.
* **Teacher-in-the-Loop:** Every remedial plan requires classroom teacher verification and approval before implementation.
* **1-Page Shareable Outputs:** Generates compact, single-page printable PDFs and formatted messages ready for instant sharing over **WhatsApp** in Marathi and English.
* **DPDP Act 2023 Compliant:** Full data minimization (storing only roll numbers and competency scores; names optional), verifiable parental consent registries, and strict local storage protections.

---

## 🏗️ Technical Architecture & Stack

```
┌─────────────────────────────────────────────────────────────┐
│              Progressive Web App (PWA) Frontend             │
│  React 18 • Vite • TypeScript • Tailwind CSS • i18n         │
│  Service Worker & Manifest • Dexie.js (IndexedDB Offline)   │
│  Circular SVG Gauges • 1-Tap Mobile Install Banner          │
└──────────────────────────────┬──────────────────────────────┘
                               │ Auto-sync & REST API
┌──────────────────────────────▼──────────────────────────────┐
│                  Python FastAPI Backend Layer               │
│  FastAPI • Pydantic v2 • Rule + AI Prediction Engine        │
│  Data Quality Validator • Activity Matcher • Vercel Handler │
└──────────────────────────────┬──────────────────────────────┘
                               │ Database queries & Realtime
┌──────────────────────────────▼──────────────────────────────┐
│                 Supabase Platform (PostgreSQL)              │
│  Dynamic Upsert • Realtime WebSockets • RLS Permissions     │
│  Multi-tenant school data isolation & Class Roster Sync     │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Component | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript + Vite | Lightweight mobile bundle with circular visual progress gauges |
| **PWA Mobile** | `vite-plugin-pwa` + Service Worker | Offline precaching (15 assets, 850 KiB), standalone mobile window, install banner |
| **Offline DB** | Dexie.js (IndexedDB) | 40 pre-seeded students across 4 classes with offline outbox queue |
| **Cloud DB** | **Supabase (Managed PostgreSQL)** | Dynamic upsert, live real-time sync, and batch synchronization |
| **Backend** | **Python (FastAPI + Uvicorn)** | Rule-based engine + AI student mastery trajectory prediction |
| **Deployment** | **Vercel** | SPA rewrites, Edge CDN, and Python serverless API handler (`api/index.py`) |
| **Localization** | `i18next` | 22+ Indian languages with instant toggle between Marathi & English |
| **Privacy** | DPDP Act 2023 Guard | Synthetic student aliases, parental consent verified flags, zero PII leak |

---

## 👥 Role-Based Workflows

### 1. Class Teacher (वर्गशिक्षक)
- **Class Selector:** Toggle between Class 5th A, 6th A, 7th A, and 8th A.
- **Marks Entry & Marksheet:** Enter, edit, or upload marks via CSV; real-time inline validation.
- **Learning Gap Engine:** Automatic student grouping by learning gaps (High Urgency, Moderate, Mild).
- **Remedial Action Planner:** 3-step structured lesson builder with teacher-reviewed activity bank, materials list, and 1-click WhatsApp/PDF dispatch.

### 2. Head Teacher (मुख्याध्यापक / CRC)
- **School-Wide Record:** View aggregated performance of the entire school (`ALL Classes`) or drill down by individual class.
- **Individual Student Marksheet:** Inspect each learner's baseline vs follow-up scores across all 7 subjects.
- **AI Mastery Predictor:** Monitor projected exam pass rates and identify high-risk students early for targeted interventions.

---

## 🚀 Quickstart Guide

### 1. Run Development Server Locally
```bash
# Clone the repository
git clone https://github.com/parthgade17/Learn-Gap-AI.git
cd Learn-Gap-AI

# Install frontend dependencies
npm install

# Start local Vite development server
npm run dev
```
> Open `http://localhost:5173` in your browser.

### 2. Run Python Backend API
```bash
# Setup virtual environment
cd backend
python -m venv venv
venv\Scripts\activate   # On Windows (or source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt

# Run the FastAPI server
python run.py
```
> API will run at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

---

## ☁️ Connecting Supabase Database

LearnGap AI works **100% offline out-of-the-box** using browser IndexedDB. To enable cloud synchronization:

1. Create a free project at [supabase.com](https://supabase.com).
2. In Supabase **SQL Editor**, run the script [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy **Project URL** and **anon public API Key** from **Project Settings &rarr; API**.
4. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart the app (`npm run dev`). The top header will display **"Online (Supabase Connected)"** and all marks edits will sync dynamically to your database!

---

## 🌐 Deploy to Vercel

The project includes pre-configured [`vercel.json`](./vercel.json) and serverless API handlers.

### 1-Click Deployment via GitHub:
1. Go to [vercel.com/new](https://vercel.com/new).
2. Select repository **`parthgade17/Learn-Gap-AI`**.
3. Add Environment Variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Click **Deploy**.

---

## 🔒 DPDP Act 2023 & Child Privacy Guarantees

* **Data Minimization:** Only student roll numbers, grades, and competency scores are captured. Full student names use synthetic aliases (e.g., `विद्यार्थी १ (Aarav Patil)`).
* **Parental Consent:** Built-in digital consent verification modal complying with Section 9 of the DPDP Act 2023.
* **Offline Security:** Data is stored in sandboxed device IndexedDB memory, preventing third-party trackers or external analytics from harvesting child data.

---

## 👥 Team SuperNova • Sanjivani University, Kopargaon
* **Pranav Jadhav (Team Leader)** — Architecture, database design & CSV flow
* **Parth Gade** — Research, problem validation, teacher workflows & user experience
* **Krushna Thakur** — Hybrid AI & rule-based prediction engine, competency mapping
* **Samruddhi Sarode** — Impact analysis, pilot design & DPDP Act compliance
