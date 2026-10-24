# AI Workbench

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_3.8_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> A full-stack AI engineering workbench with six specialized applied AI tools for developers, data scientists, and technical teams. Architected by **Karan Balaji**. Built with server-side Gemini 3.8 Flash orchestration, deterministic mathematical analytics, explainable scoring, and zero-hallucination guardrails.

---

## 🌟 Executive Summary & Objective

**AI Workbench** provides a production-grade suite of six applied AI tools. Rather than shallow wrappers or mock placeholders, every tool implements real end-to-end functionality, strict truthfulness directives, safe sandboxing, and deterministic computing:

1. **AI Resume Analyzer**: Explainable match score (strictly non-ATS) with skills gap breakdown and quantified XYZ resume rewrites.
2. **AI SQL Assistant**: Multi-dialect SQL generation (PostgreSQL, MySQL, SQLite, Snowflake, BigQuery), step-by-step logic breakdown, indexing advice, and strict production execution guardrails.
3. **AI Meeting Notes Analyzer**: Zero-hallucination meeting extraction with executive summaries, confirmed decisions, strictly tagged "Unspecified" task owners/deadlines, risk register, and a one-click follow-up email.
4. **AI PDF Chatbot**: Document-grounded Q&A with explicit page citations (`[Page X]`), direct quoted evidence excerpts, and verifiable detection when requested information is absent.
5. **AI Code Review Assistant**: AST static analysis and security scanning treating submitted code strictly as untrusted input. Detects bugs, race conditions, injection vulnerabilities, and Big-O complexity shifts with full refactored code.
6. **AI Data Analyst**: In-browser CSV parsing, deterministic descriptive statistics (min, max, mean, median, standard deviation, missing values), interactive SVG charts, and evidence-backed strategic AI insights.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Client (Browser)                       │
│  React 19 + TypeScript + Vite 8 + Tailwind CSS v4        │
│  PapaParse (In-Browser Deterministic Math & EDA)        │
└────────────────────────────┬─────────────────────────────┘
                             │
                     HTTP REST / JSON
                             │
┌────────────────────────────▼─────────────────────────────┐
│                 Server (Node.js 22 + Express)            │
│  server.ts                                               │
│  ├── /api/resume-analyzer                                │
│  ├── /api/sql-assistant                                  │
│  ├── /api/meeting-notes                                  │
│  ├── /api/pdf-chat                                       │
│  ├── /api/code-review                                    │
│  ├── /api/data-insights                                  │
│  └── /api/health                                         │
└────────────────────────────┬─────────────────────────────┘
                             │
              @google/genai TypeScript SDK
                     (Header: aistudio-build)
                             │
┌────────────────────────────▼─────────────────────────────┐
│                 Google Gemini API                        │
│  Model: gemini-3.8-flash (Standard / Low-Cost Tier)      │
│  - Multimodal PDF inline parsing                         │
│  - Structured JSON response schemas                      │
│  - Factual non-hallucination system instructions         │
└──────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions:
- **Server-Side API Key Protection**: The client never loads `@google/genai` or API keys. All calls are routed through Express endpoints (`/api/*`), ensuring zero browser credential leaks.
- **Model Choice**: Powered by `gemini-3.8-flash`, offering sub-second response times, native multimodal PDF document understanding, and high-fidelity reasoning without expensive paid models.
- **Deterministic Statistics Hybrid**: For the Data Analyst, numbers (means, standard deviations, row counts, null rates) are computed deterministically in JavaScript before generating AI summaries, eliminating numerical hallucinations.
- **Strict Guardrail Directives**: Meeting Notes prompt strictly prohibits inventing owners or deadlines; SQL assistant prohibits live query execution; PDF chatbot explicitly falls back to "Information absent" if ungrounded.

---

## 🛠️ Tool Features & Detailed Specifications

| Tool | Core Capability | Guardrails & Protocols |
|---|---|---|
| **AI Resume Analyzer** | Matches resume text or PDF against job descriptions. Computes match score (0-100), lists matching and missing skills, and suggests XYZ formula bullet rewrites. | **Mandatory Non-ATS Disclaimer**: Explicitly states score is an algorithmic text-alignment estimate, NOT a certified ATS score. |
| **AI SQL Assistant** | Generates or debugs SQL across PostgreSQL, MySQL, SQLite, Snowflake, and BigQuery. Provides step-by-step logic and indexing tips. | **Execution Guardrail**: Advises testing in isolated staging and strictly prevents direct execution on live databases. |
| **AI Meeting Notes Analyzer** | Extracts summaries, decisions, action items, risks, and follow-up emails from transcripts. | **Zero Hallucination**: Tasks lacking explicit assignees or dates are strictly tagged as **"Unspecified"**. |
| **AI PDF Chatbot** | Answers questions based on uploaded or sample PDFs. Outputs page references and quoted evidence. | **Factual Truthfulness**: Explicitly returns `"This information is not present in the provided document"` when ungrounded. |
| **AI Code Review Assistant** | Static analysis across Python, TypeScript, Go, Rust, Java, C++, and SQL for bugs, security, and complexity. | **Untrusted Input**: All code is sandboxed as passive string data without dynamic runtime eval. |
| **AI Data Analyst** | Parses CSVs, renders paginated previews, calculates full univariate statistics, renders SVG charts, and drafts AI strategic insights. | **Evidence-Based Insights**: Insights refer exclusively to computed dataset statistics and sample records. |

---

## 🚀 Setup & Local Deployment

### Prerequisites
- Node.js >= 22
- npm >= 10
- Google Gemini API Key (injected automatically in AI Studio or via `.env`)

### Installation & Run

1. Clone or access the app directory:
   ```bash
   cd /app/applet
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # GEMINI_API_KEY is automatically supplied in AI Studio
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   # Runs tsx server.ts mounting Vite on port 3000
   ```

5. Build for production:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Sample Verification Test Cases

Every tool includes built-in demo data accessible via the **"Try Demo"** button on the Dashboard or in the tool toolbar:

1. **Resume Analyzer Test Case**:
   - *Candidate*: Alex Chen (Staff Engineer with 6+ years distributed systems, Node.js, TypeScript, PostgreSQL).
   - *Target Role*: Apex FinTech Senior Platform Engineer (Requires Go, Kafka, Kubernetes).
   - *Expected Result*: High score (~75-80), flags Go/Kafka as missing, recognizes Postgres/Node/Cloud alignment, generates XYZ rewrite for bullet points.

2. **SQL Assistant Test Case**:
   - *Prompt*: Top 5 customers by lifetime spend with >= 3 orders, calculating average order value and days since last purchase.
   - *Dialect*: PostgreSQL.
   - *Expected Result*: Window functions (`DENSE_RANK`, `CURRENT_DATE - MAX(order_date)`), `HAVING COUNT(id) >= 3`, indexing recommendations on `customer_id` and `order_date`.

3. **Meeting Notes Test Case**:
   - *Input*: Q4 Launch Sync transcript with Sarah assigned load testing, Dave discussing PgBouncer, Kenji handling legal email, and unidentified items ("Someone should fix Safari mobile glitch").
   - *Expected Result*: Safari task marked with Owner: **Unspecified**, Deadline: **Unspecified**. Ready-to-send email generated.

4. **PDF Chatbot Test Case**:
   - *Document*: Nova Vector Database Architecture Whitepaper (4 pages).
   - *Query 1*: "What is the 99.9th percentile latency SLA for batch inference?" -> Answers with `[Page 2]` citation (24.0 ms).
   - *Query 2*: "Does Nova support blockchain smart contract auditing?" -> Truthfully returns: "This information is not present in the provided document."

5. **Code Review Test Case**:
   - *Input*: Python order processing queue worker with string-concatenated SQL injection, connection leak, unhandled JSON parsing, and loop off-by-one.
   - *Expected Result*: Grade D/F, Critical security finding for SQL injection, High for resource leak, provides parameterized SQL refactored snippet.

6. **Data Analyst Test Case**:
   - *Input*: Pre-loaded SaaS Churn & ARR dataset (20 accounts).
   - *Computed EDA*: 20 rows, 8 columns, 0 nulls. Average ARR ~$2,800.
   - *AI Insights*: Correlates low usage hours (<60 hrs) and high support tickets with churn risk on the Basic tier.

---

## 🔒 Limitations & Security Boundaries

- **Advisory SQL Sandbox**: Generated SQL is purely advisory. To protect client infrastructure, queries are never executed against production databases.
- **Statistical Determinism**: Data analysis calculations (means, medians, standard deviations) are computed directly in browser memory using standard IEEE arithmetic, bypassing potential LLM arithmetic errors.
- **Privacy & Retention**: No resumes, transcripts, code snippets, or CSV records are saved to persistent disks or external databases.

---

## 👨‍💻 Author & Contact

**Karan Balaji**  
- Email: [karanbalaji1998@gmail.com](mailto:karanbalaji1998@gmail.com)  
- GitHub: [@karanbalaji1998-dotcom](https://github.com/karanbalaji1998-dotcom)  
- Repository: [ai-workbench](https://github.com/karanbalaji1998-dotcom/ai-workbench)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
