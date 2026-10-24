export type ToolId =
  | 'dashboard'
  | 'resume-analyzer'
  | 'sql-assistant'
  | 'meeting-notes'
  | 'pdf-chatbot'
  | 'code-review'
  | 'data-analyst';

export interface ToolMetadata {
  id: ToolId;
  title: string;
  shortDesc: string;
  tagline: string;
  category: 'Career & HR' | 'Database & Engineering' | 'Productivity' | 'Document AI' | 'Code Quality' | 'Analytics';
  icon: string;
  badge?: string;
  features: string[];
}

// 1. Resume Analyzer
export interface ExperienceAlignment {
  summary: string;
  seniorityFit: 'High' | 'Medium' | 'Low';
  domainRelevance: 'High' | 'Medium' | 'Low';
  strengths: string[];
  concerns: string[];
}

export interface ActionableImprovement {
  section: string;
  critique: string;
  recommendation: string;
  sampleRewrite?: string;
}

export interface ResumeAnalysisResult {
  matchScore: number;
  scoreExplanation: string;
  disclaimer: string;
  matchedSkills: string[];
  missingSkills: string[];
  experienceAlignment: ExperienceAlignment;
  actionableImprovements: ActionableImprovement[];
}

// 2. SQL Assistant
export type SqlDialect = 'PostgreSQL' | 'MySQL' | 'SQLite' | 'Snowflake' | 'BigQuery';

export interface SqlExplanationStep {
  step: number;
  title: string;
  detail: string;
}

export interface SqlOptimization {
  type: 'Index' | 'Execution' | 'Syntax' | 'Architecture';
  suggestion: string;
}

export interface SqlAssistantResult {
  sql: string;
  explanation: SqlExplanationStep[];
  optimizations: SqlOptimization[];
  dialectSpecificNotes: string[];
  assumptions: string[];
  safetyWarning: string;
}

// 3. Meeting Notes
export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface RiskBlocker {
  description: string;
  impact: string;
  mitigation: string;
}

export interface FollowUpEmail {
  subject: string;
  body: string;
}

export interface MeetingNotesResult {
  meetingTitle: string;
  executiveSummary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  risksAndBlockers: RiskBlocker[];
  followUpEmail: FollowUpEmail;
}

// 4. PDF Chatbot
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isFoundInDocument?: boolean;
  pageReferences?: string[];
  quotedEvidence?: string[];
  documentConfidence?: 'High' | 'Medium' | 'Low' | 'Not Found';
  timestamp: string;
}

export interface PdfChatResult {
  answer: string;
  isFoundInDocument: boolean;
  pageReferences: string[];
  quotedEvidence: string[];
  documentConfidence: 'High' | 'Medium' | 'Low' | 'Not Found';
}

// 5. Code Review
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Nit';

export interface CodeFinding {
  id: string;
  severity: SeverityLevel;
  category: 'Bug' | 'Security' | 'Performance' | 'Maintainability' | 'Edge Case';
  title: string;
  description: string;
  lineReference?: string;
  recommendation: string;
}

export interface ComplexityAnalysis {
  originalTimeComplexity: string;
  suggestedTimeComplexity: string;
  originalSpaceComplexity: string;
  suggestedSpaceComplexity: string;
}

export interface CodeReviewResult {
  qualityScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  findings: CodeFinding[];
  correctedCode: string;
  complexityAnalysis: ComplexityAnalysis;
}

// 6. Data Analyst
export interface NumericStats {
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
}

export interface ColumnProfile {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'date';
  missingCount: number;
  uniqueCount: number;
  numericStats?: NumericStats;
  sampleValues: (string | number)[];
}

export interface DatasetProfile {
  rowCount: number;
  columnCount: number;
  totalMissing: number;
  columns: ColumnProfile[];
}

export interface KeyObservation {
  metric: string;
  observation: string;
  significance: 'High' | 'Medium' | 'Low';
}

export interface AnomalyQuality {
  column: string;
  issue: string;
  impact: string;
}

export interface StrategicRecommendation {
  title: string;
  action: string;
  expectedImpact: string;
}

export interface SuggestedVisualization {
  type: string;
  xAxis: string;
  yAxis: string;
  reason: string;
}

export interface DataInsightsResult {
  datasetTitle: string;
  executiveOverview: string;
  keyObservations: KeyObservation[];
  anomaliesAndQuality: AnomalyQuality[];
  strategicRecommendations: StrategicRecommendation[];
  suggestedVisualizations: SuggestedVisualization[];
}
