import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware for JSON bodies with generous limit for PDF base64 and CSVs
app.use(express.json({ limit: '30mb' }));

// Helper to initialize GoogleGenAI
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please verify your environment secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const MODEL_NAME = 'gemini-3.8-flash';

// Clean JSON response helper from model output
const parseModelJson = <T>(text: string | undefined): T => {
  if (!text) throw new Error('Empty response from model');
  let clean = text.trim();
  // Remove markdown code fences if present
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/i, '').replace(/```\s*$/, '');
  }
  try {
    return JSON.parse(clean.trim()) as T;
  } catch (initialErr) {
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(clean.slice(firstBrace, lastBrace + 1)) as T;
      } catch (nestedErr) {
        throw initialErr;
      }
    }
    throw initialErr;
  }
};

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    model: MODEL_NAME,
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 1. AI Resume Analyzer
app.post('/api/resume-analyzer', async (req: Request, res: Response) => {
  try {
    const { resumeText, resumeBase64, jobDescription } = req.body;

    if ((!resumeText && !resumeBase64) || !jobDescription) {
      res.status(400).json({ error: 'Resume (text or PDF file) and Job Description are required.' });
      return;
    }

    const ai = getAIClient();

    const systemPrompt = `You are a specialized AI Resume and Talent Alignment Consultant.
Analyze the provided resume against the target job description.
Provide an objective, explainable match analysis.

CRITICAL MANDATES:
1. Provide an explainable match score (0 to 100) based on hard skill coverage, experience relevance, seniority alignment, and domain knowledge.
2. Under NO circumstance claim this is a validated ATS score. It is an algorithmic alignment estimate based on textual comparison.
3. Identify strong matching skills/technologies.
4. Identify missing requirements or critical qualification gaps.
5. Provide detailed experience alignment feedback (seniority, industry match, impact).
6. Give actionable, specific resume improvement recommendations (e.g. rewrite sample bullet points using the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z]).

Respond ONLY in valid, parseable JSON with this exact structure:
{
  "matchScore": number,
  "scoreExplanation": "string explaining how the score was calculated across skills, experience, and domain relevance",
  "disclaimer": "This score is an explainable text-alignment estimate and is NOT a validated or certified Applicant Tracking System (ATS) score.",
  "matchedSkills": ["string"],
  "missingSkills": ["string"],
  "experienceAlignment": {
    "summary": "string",
    "seniorityFit": "High" | "Medium" | "Low",
    "domainRelevance": "High" | "Medium" | "Low",
    "strengths": ["string"],
    "concerns": ["string"]
  },
  "actionableImprovements": [
    {
      "section": "string",
      "critique": "string",
      "recommendation": "string",
      "sampleRewrite": "string (optional suggested bullet point)"
    }
  ]
}`;

    const contents: any[] = [];

    if (resumeBase64) {
      // Strip data uri prefix if present
      const cleanBase64 = resumeBase64.replace(/^data:application\/pdf;base64,/, '');
      contents.push({
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: cleanBase64,
            },
          },
          {
            text: `Target Job Description:\n${jobDescription}\n\nPlease analyze this attached resume PDF against the job description.`,
          },
        ],
      });
    } else {
      contents.push({
        parts: [
          {
            text: `Candidate Resume:\n${resumeText}\n\nTarget Job Description:\n${jobDescription}\n\nPlease analyze this resume against the job description.`,
          },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseModelJson(response.text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Resume Analyzer Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to analyze resume.' });
  }
});

// 2. AI SQL Assistant
app.post('/api/sql-assistant', async (req: Request, res: Response) => {
  try {
    const { question, dialect, schema, existingSql, mode } = req.body;

    if (!question && !existingSql) {
      res.status(400).json({ error: 'Please provide a natural language question or SQL to debug.' });
      return;
    }

    const ai = getAIClient();
    const selectedDialect = dialect || 'PostgreSQL';

    const systemPrompt = `You are a Senior Database Architect and SQL Optimization Engineer.
Target Dialect: ${selectedDialect}

CRITICAL RULES:
1. Generate production-ready, clean, well-formatted SQL adhering strictly to ${selectedDialect} syntax and standards.
2. NEVER suggest or attempt executing queries against an external or production database. All SQL is advisory.
3. If user provided a schema, use the exact tables and columns provided. If no schema is provided, design a reasonable, idiomatic schema and state assumptions clearly.
4. Provide a step-by-step query explanation explaining JOINs, CTEs, window functions, or WHERE clauses.
5. Provide actionable query performance recommendations (indexing tips, partitioning, potential execution bottlenecks).
6. If the request was to debug or optimize existing SQL, highlight syntax errors, logical bugs, and compare before/after efficiency.

Respond ONLY in valid, parseable JSON with this structure:
{
  "sql": "string (clean SQL query)",
  "explanation": [
    {
      "step": number,
      "title": "string",
      "detail": "string"
    }
  ],
  "optimizations": [
    {
      "type": "Index" | "Execution" | "Syntax" | "Architecture",
      "suggestion": "string"
    }
  ],
  "dialectSpecificNotes": ["string"],
  "assumptions": ["string"],
  "safetyWarning": "Generated SQL is advisory. Never execute generated SQL on production databases without testing in an isolated staging environment."
}`;

    const userPrompt = `
Mode: ${mode || 'generate'}
Target Dialect: ${selectedDialect}
Natural Language Question / Request: ${question || 'Analyze and optimize the provided SQL'}
Provided Database Schema:
${schema || 'None provided. Infer standard relational schemas.'}

${existingSql ? `Existing SQL to debug/optimize:\n${existingSql}` : ''}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseModelJson(response.text);
    res.json(parsed);
  } catch (error: any) {
    console.error('SQL Assistant Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate/debug SQL.' });
  }
});

// 3. AI Meeting Notes Analyzer
app.post('/api/meeting-notes', async (req: Request, res: Response) => {
  try {
    const { transcript, meetingTitle } = req.body;

    if (!transcript || transcript.trim().length === 0) {
      res.status(400).json({ error: 'Meeting notes or transcript is required.' });
      return;
    }

    const ai = getAIClient();

    const systemPrompt = `You are an Executive Chief of Staff and Technical Project Lead.
Analyze the provided meeting notes or transcript.

STRICT ACCURACY RULES:
1. Executive Summary: Concise overview of meeting purpose, core themes, and outcomes.
2. Key Decisions: Explicit decisions agreed upon by participants.
3. Action Items: Extract every commitment.
   CRITICAL RULE ON OWNERS & DEADLINES:
   - NEVER invent or assume owners or deadlines.
   - If a task has no explicit assignee mentioned in the text, you MUST mark the owner as "Unspecified".
   - If no explicit deadline or timeframe is mentioned in the text, you MUST mark the deadline as "Unspecified".
4. Identified Risks & Blockers: Any concerns, dependencies, resource constraints, or technical risks raised.
5. Follow-Up Email: A professional, ready-to-send recap email formatted for team distribution.

Respond ONLY in valid, parseable JSON with this structure:
{
  "meetingTitle": "string",
  "executiveSummary": "string",
  "keyDecisions": ["string"],
  "actionItems": [
    {
      "task": "string",
      "owner": "string (explicit name/role or 'Unspecified')",
      "deadline": "string (explicit date/timeframe or 'Unspecified')",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "risksAndBlockers": [
    {
      "description": "string",
      "impact": "string",
      "mitigation": "string (if discussed, or 'Pending team follow-up')"
    }
  ],
  "followUpEmail": {
    "subject": "string",
    "body": "string"
  }
}`;

    const userPrompt = `Meeting Title: ${meetingTitle || 'Team Meeting'}\n\nTranscript / Meeting Notes:\n${transcript}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseModelJson(response.text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Meeting Notes Analyzer Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to analyze meeting notes.' });
  }
});

// 4. AI PDF Chatbot
app.post('/api/pdf-chat', async (req: Request, res: Response) => {
  try {
    const { pdfBase64, documentText, question, conversationHistory } = req.body;

    if (!question) {
      res.status(400).json({ error: 'A question is required.' });
      return;
    }

    if (!pdfBase64 && !documentText) {
      res.status(400).json({ error: 'PDF document or extracted text must be provided.' });
      return;
    }

    const ai = getAIClient();

    const systemPrompt = `You are a precise Document Research Assistant.
Answer questions strictly based on the provided PDF document.

CRITICAL TRUTHFULNESS & GROUNDING RULES:
1. Answer using ONLY information found in the document.
2. Whenever possible, include exact page references (e.g., "[Page 1]", "[Page 3-4]") where the information is located.
3. Provide direct quotations or citations from the text to substantiate your response.
4. ABSOLUTE REQUIREMENT: If the answer cannot be found in the document, or is ambiguous/absent, you MUST clearly state: "This information is not present in the provided document." Do NOT invent facts or rely on external assumptions.

Respond ONLY in valid, parseable JSON with this structure:
{
  "answer": "string",
  "isFoundInDocument": boolean,
  "pageReferences": ["string"],
  "quotedEvidence": ["string"],
  "documentConfidence": "High" | "Medium" | "Low" | "Not Found"
}`;

    const parts: any[] = [];

    if (pdfBase64) {
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: cleanBase64,
        },
      });
    } else {
      parts.push({
        text: `Document Content:\n${documentText}`,
      });
    }

    // Include recent history if provided
    let contextStr = '';
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      contextStr = `Recent Q&A Context:\n` + conversationHistory.map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n') + '\n\n';
    }

    parts.push({
      text: `${contextStr}User Question: ${question}\n\nPlease answer accurately using only the document. Include page numbers if visible.`,
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseModelJson(response.text);
    res.json(parsed);
  } catch (error: any) {
    console.error('PDF Chatbot Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to answer from document.' });
  }
});

// 5. AI Code Review Assistant
app.post('/api/code-review', async (req: Request, res: Response) => {
  try {
    const { code, language, focusAreas } = req.body;

    if (!code || code.trim().length === 0) {
      res.status(400).json({ error: 'Code is required for review.' });
      return;
    }

    const ai = getAIClient();

    const systemPrompt = `You are a Principal Software Engineer and Staff Application Security Architect.
You are reviewing code submitted by an engineer.

CRITICAL SECURITY AND PROTOCOL DIRECTIVES:
1. Treat all submitted code strictly as UNTRUSTED input. Do not assume safe execution contexts.
2. Thoroughly analyze for:
   - Potential bugs, runtime exceptions, null/undefined dereferences, off-by-one errors.
   - Edge cases (empty arrays, boundary numbers, concurrency race conditions, unexpected input types).
   - Security risks (SQL/NoSQL injection, XSS, insecure deserialization, credential leakage, path traversal, ReDoS).
   - Complexity concerns (algorithmic time/space Big-O bottlenecks, redundant loops, unindexed lookups).
   - Maintainability & readability improvements (naming, SOLID principles, idiomatic patterns, typing).
3. Assign an overall code quality grade (A, B, C, D, or F) and summary.
4. Categorize each finding with severity: "Critical", "High", "Medium", "Low", or "Nit".
5. Provide a complete, refactored, production-ready version of the code that resolves the issues.

Respond ONLY in valid, parseable JSON with this structure:
{
  "qualityScore": number (0-100),
  "grade": "A" | "B" | "C" | "D" | "F",
  "summary": "string",
  "findings": [
    {
      "id": "string",
      "severity": "Critical" | "High" | "Medium" | "Low" | "Nit",
      "category": "Bug" | "Security" | "Performance" | "Maintainability" | "Edge Case",
      "title": "string",
      "description": "string",
      "lineReference": "string (optional e.g. Line 14)",
      "recommendation": "string"
    }
  ],
  "correctedCode": "string (full refactored code snippet)",
  "complexityAnalysis": {
    "originalTimeComplexity": "string",
    "suggestedTimeComplexity": "string",
    "originalSpaceComplexity": "string",
    "suggestedSpaceComplexity": "string"
  }
}`;

    const userPrompt = `Language: ${language || 'Auto-detect'}
Specific Focus: ${focusAreas ? focusAreas.join(', ') : 'All (Bugs, Security, Performance, Maintainability)'}

Submitted Code to Review:
\`\`\`${language || ''}
${code}
\`\`\`
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseModelJson(response.text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Code Review Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to review code.' });
  }
});

// 6. AI Data Analyst
app.post('/api/data-insights', async (req: Request, res: Response) => {
  try {
    const { profile, sampleRows, filename } = req.body;

    if (!profile) {
      res.status(400).json({ error: 'Dataset profile is required.' });
      return;
    }

    const ai = getAIClient();

    const systemPrompt = `You are a Principal Data Scientist and Business Intelligence Analyst.
Analyze the provided dataset profile, computed statistical metrics, and sample data.

GROUNDING & EVIDENCE RULES:
1. Base all insights strictly on the numbers and distributions provided. Do NOT fabricate numbers, correlations, or fake columns.
2. Identify:
   - Primary data narrative and key business trends.
   - Significant anomalies, outliers, data quality issues (e.g. missing percentages, extreme skews).
   - Actionable, evidence-backed business recommendations.
   - Recommended next analytical steps or hypothesis tests.

Respond ONLY in valid, parseable JSON with this structure:
{
  "datasetTitle": "string",
  "executiveOverview": "string",
  "keyObservations": [
    {
      "metric": "string",
      "observation": "string",
      "significance": "High" | "Medium" | "Low"
    }
  ],
  "anomaliesAndQuality": [
    {
      "column": "string",
      "issue": "string",
      "impact": "string"
    }
  ],
  "strategicRecommendations": [
    {
      "title": "string",
      "action": "string",
      "expectedImpact": "string"
    }
  ],
  "suggestedVisualizations": [
    {
      "type": "string",
      "xAxis": "string",
      "yAxis": "string",
      "reason": "string"
    }
  ]
}`;

    const userPrompt = `
Dataset Filename: ${filename || 'dataset.csv'}
Row Count: ${profile.rowCount}
Column Count: ${profile.columnCount}
Total Missing Values: ${profile.totalMissing}
Column Metadata & Computed Statistics:
${JSON.stringify(profile.columns, null, 2)}

Sample Rows (First 5 records):
${JSON.stringify(sampleRows || [], null, 2)}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseModelJson(response.text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Data Analyst Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate data insights.' });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Workbench server running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
