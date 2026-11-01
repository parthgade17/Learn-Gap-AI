# LearnGap AI: From Learning Data to Classroom Action

> **India @ 71/100 Challenge • Techfest 2026–27, IIT Bombay**  
> **Theme 2: Foundational Learning Outcomes**  
> **Team SuperNova (TM-70E50988E4F) • Sanjivani University, Kopargaon**

---

## 🎯 Executive Summary & Problem Context

Primary-school assessment results (e.g. NIPUN Bharat, PARAKH Rashtriya Sarvekshan, state periodic assessments) record which foundational skills children have not yet mastered. However, classroom teachers in rural government primary schools lack a low-bandwidth, low-overhead workflow to convert raw assessment scores into **competency-specific remedial groups**, **actionable weekly teaching activities**, and **follow-up re-checks**.

**LearnGap AI** bridges this loop:
* **Offline-First PWA:** Runs on low-cost Android phones owned by rural teachers; persists all records locally in IndexedDB and syncs automatically with **Supabase** when 2G/3G connectivity is available.
* **Deterministic Gap Engine:** Operates on transparent, testable threshold rules (zero diagnostic black-boxes). AI is strictly confined to suggesting activities from an approved, teacher-reviewed bank.
* **Teacher-in-the-Loop:** Every remedial plan requires classroom teacher verification and approval before implementation.
* **1-Page Shareable Outputs:** Generates compact, single-page printable PDFs and formatted messages ready for instant sharing over **WhatsApp** in **Marathi (मराठी)** and **English**.
* **DPDP Act 2023 Compliant:** Full data minimization (storing only roll numbers and competency scores; names optional), verifiable parental consent registries, and aggregated block views.

---

## 🏗️ Technical Architecture & Stack

```
┌─────────────────────────────────────────────────────────────┐
│              Progressive Web App (PWA) Frontend             │
│  React 18 • Vite • TypeScript • Tailwind CSS • i18n         │
│  Service Worker & Manifest • Dexie.js (IndexedDB Offline)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Auto-sync & REST API
┌──────────────────────────────▼──────────────────────────────┐
│                  Python FastAPI Backend Layer               │
│  FastAPI • Pydantic v2 • Python Rule Engine • Uvicorn       │
│  Data Quality Validator • Activity Matcher • CSV Processor  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Database queries & RLS
┌──────────────────────────────▼──────────────────────────────┐
│                 Supabase Platform (PostgreSQL)              │
│  Supabase Auth • Row-Level Security (RLS) • Storage Bucket   │
│  Multi-tenant school data isolation & Block-level aggregates │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Component | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript + Vite | Optimized lightweight bundle for entry-level smartphones |
| **Backend** | **Python (FastAPI + Uvicorn)** | Python transparent rule engine, score validators, activity matching, and CSV ingestion |
| **Styling** | Tailwind CSS | Responsive mobile-first design, high sunlight contrast, custom print stylesheets |
| **Offline-First** | `vite-plugin-pwa` + Dexie.js | Service worker precaching + IndexedDB with sync outbox queue |
| **Localization** | `i18next` | Instant toggle between Marathi (मराठी) and English |
| **Database** | **Supabase (Managed PostgreSQL)** | Replaces standard Postgres with managed Postgres, Auth, RLS, and REST APIs |
| **Security & Privacy** | Supabase RLS + DPDP Guard | Strict role isolation (Teacher, Head Teacher / CRC, Block Officer) |
| **Outputs** | Web Print API & WhatsApp Share | Pixel-perfect 1-page A4 format for physical printing and WhatsApp |

---

## 📁 Repository Structure

```
p:/Learn-Gap-AI/
├── public/                 # PWA icons, favicon, manifest
├── src/
│   ├── components/         # UI Components
│   │   ├── Header.tsx             # Role selector, network sync badge, i18n toggle
│   │   ├── Navigation.tsx         # Responsive mobile-friendly step navigation
│   │   ├── AssessmentManager.tsx  # Manual score entry + CSV batch upload + data validator
│   │   ├── GapAnalysisView.tsx    # Rule-based gap clusters & urgency breakdown
│   │   ├── RemedialPlannerView.tsx# Plan customization, teacher approval & WhatsApp export
│   │   ├── PrintablePlan.tsx      # High-contrast 1-page A4 printable/PDF layout
│   │   ├── ProgressDashboard.tsx  # Closed-loop Baseline vs. Follow-up outcome comparison
│   │   └── DPDPComplianceModal.tsx# DPDP Act 2023 parental consent & data minimization
│   ├── data/
│   │   └── curriculumData.ts      # NIPUN Bharat FLN competencies & approved activity bank
│   ├── db/
│   │   └── indexedDB.ts           # Dexie.js offline database & Kopargaon synthetic seed data
│   ├── engine/
│   │   └── gapEngine.ts           # Deterministic rule engine & closed-loop metrics
│   ├── i18n/
│   │   └── index.ts               # Bilingual translations (Marathi & English)
│   ├── lib/
│   │   └── supabaseClient.ts      # Supabase client with offline fallback
│   ├── types/
│   │   └── index.ts               # Domain types (Students, Assessments, Plans, Gaps)
│   ├── App.tsx                    # Root application state & synchronization
│   ├── main.tsx                   # Service worker registration & DOM mount
│   └── index.css                  # Tailwind styles & print CSS rules
├── supabase/
│   └── schema.sql                 # Complete Supabase schema, RLS policies & initial seeds
├── .env.example                   # Supabase environment variables template
├── package.json                   # Dependencies & build scripts
├── vite.config.ts                 # Vite + PWA service worker configuration
└── tailwind.config.js             # Educational palette & Devanagari typography
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
* Node.js v18+ (tested on Node v25 / v20)
* npm or pnpm

### 2. Run the Development Environment

#### A. Start the Python FastAPI Backend:
```bash
# Activate virtual environment
backend\venv\Scripts\activate   # On Windows
# source backend/venv/bin/activate  # On Linux/macOS

# Run the backend server
python backend/run.py
```
> The API will be live at `http://localhost:8000`  
> Swagger Documentation is accessible at `http://localhost:8000/docs`

#### B. Start the React Progressive Web App Frontend:
```bash
# In the project root:
npm install
npm run dev
```
> The PWA will be live at `http://localhost:5173` with automatic `/api` proxying to FastAPI.

### 3. Connect to Supabase (Optional for cloud sync)
The application works **100% offline out-of-the-box** using IndexedDB. To enable cloud synchronization with Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and run `supabase/schema.sql`.
3. Copy your Project URL and Anon Public Key from **Project Settings -> API**.
4. Create a `.env` file from `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Build for Production / PWA Deployment
```bash
npm run build
npm run preview
```

---

## 🔒 DPDP Act 2023 & Child Privacy Guarantees

* **Data Minimization:** Only student roll numbers, grades, and competency scores are captured. Full student names are strictly optional and masked in aggregated reports.
* **Parental Consent:** Incorporates verifiable school-level parental consent workflows (Section 9 of DPDP Act 2023).
* **Role-Based Access (RLS):**
  * **Class Teacher:** Can only read and record assessments for their assigned classroom.
  * **Head Teacher (CRC):** Views school-wide progress summaries.
  * **Block Officer:** Views high-level aggregated numbers across schools (all student PII is stripped).
* **Synthetic Records:** Default demo data uses synthetic records for rural primary schools in Kopargaon taluka (Ahilyanagar district).

---

## 👥 Team SuperNova
* **Pranav Jadhav (Team Leader)** — Prototype, architecture, database & CSV flow
* **Parth Gade** — Research, evidence, teacher interviews & problem validation
* **Krushna Thakur** — AI & analytics, competency rules, activity matching
* **Samruddhi Sarode** — Impact, proposal, pilot design & privacy safeguards
