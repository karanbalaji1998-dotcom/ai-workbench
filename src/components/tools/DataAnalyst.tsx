import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { 
  BarChart3, 
  Upload, 
  Sparkles, 
  Table, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  RefreshCw,
  Search,
  PieChart,
  Activity
} from 'lucide-react';
import { DatasetProfile, ColumnProfile, DataInsightsResult, NumericStats } from '../../types';
import { SAMPLE_SAAS_CSV, SAMPLE_ECOMMERCE_CSV } from '../../data/sampleData';
import { CopyButton } from '../common/CopyButton';
import { LoadingState, ErrorBanner } from '../common/Feedback';

interface DataAnalystProps {
  initialDemo?: boolean;
}

export function DataAnalyst({ initialDemo = false }: DataAnalystProps) {
  const [csvRaw, setCsvRaw] = useState<string>(SAMPLE_SAAS_CSV);
  const [fileName, setFileName] = useState<string>('saas_metrics_churn_arr.csv');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'preview' | 'stats' | 'charts' | 'ai-insights'>('preview');

  // Chart state
  const [chartCategoryCol, setChartCategoryCol] = useState<string>('');
  const [chartNumericCol, setChartNumericCol] = useState<string>('');

  // AI state
  const [insights, setInsights] = useState<DataInsightsResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Process CSV on mount or raw change
  useEffect(() => {
    processCsv(csvRaw, fileName);
  }, [csvRaw, fileName]);

  useEffect(() => {
    if (initialDemo) {
      handleLoadSample('saas');
    }
  }, [initialDemo]);

  const handleLoadSample = (type: 'saas' | 'ecommerce') => {
    if (type === 'saas') {
      setFileName('saas_churn_and_arr_metrics.csv');
      setCsvRaw(SAMPLE_SAAS_CSV);
    } else {
      setFileName('ecommerce_orders_transactions.csv');
      setCsvRaw(SAMPLE_ECOMMERCE_CSV);
    }
    setInsights(null);
    setError(null);
    setCurrentPage(1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setInsights(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setCsvRaw(content);
    };
    reader.readAsText(file);
  };

  const processCsv = (rawText: string, currentFileName: string) => {
    if (!rawText.trim()) return;

    Papa.parse(rawText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];
        if (!rows || rows.length === 0) {
          setError('CSV file is empty or could not be parsed.');
          return;
        }

        const cols = Object.keys(rows[0] || {});
        setColumns(cols);
        setParsedData(rows);

        // Compute deterministic profiles
        let totalMissing = 0;
        const columnProfiles: ColumnProfile[] = cols.map((col) => {
          let missingCount = 0;
          const values: any[] = [];

          rows.forEach((r) => {
            const v = r[col];
            if (v === null || v === undefined || v === '') {
              missingCount++;
            } else {
              values.push(v);
            }
          });

          totalMissing += missingCount;

          // Determine type
          const numericVals = values.filter((v) => typeof v === 'number' && !isNaN(v));
          const isNumeric = numericVals.length > values.length * 0.7;

          let numericStats: NumericStats | undefined;
          if (isNumeric && numericVals.length > 0) {
            const sorted = [...numericVals].sort((a, b) => a - b);
            const min = sorted[0];
            const max = sorted[sorted.length - 1];
            const sum = sorted.reduce((acc, curr) => acc + curr, 0);
            const mean = sum / sorted.length;
            const mid = Math.floor(sorted.length / 2);
            const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
            const variance = sorted.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / sorted.length;
            const stdDev = Math.sqrt(variance);

            numericStats = {
              min: Math.round(min * 100) / 100,
              max: Math.round(max * 100) / 100,
              mean: Math.round(mean * 100) / 100,
              median: Math.round(median * 100) / 100,
              stdDev: Math.round(stdDev * 100) / 100,
            };
          }

          const uniqueVals = Array.from(new Set(values));

          return {
            name: col,
            type: isNumeric ? 'number' : 'string',
            missingCount,
            uniqueCount: uniqueVals.length,
            numericStats,
            sampleValues: values.slice(0, 5),
          };
        });

        const newProfile: DatasetProfile = {
          rowCount: rows.length,
          columnCount: cols.length,
          totalMissing,
          columns: columnProfiles,
        };

        setProfile(newProfile);

        // Set default chart columns
        const firstCategory = columnProfiles.find((c) => c.type === 'string')?.name || cols[0];
        const firstNumeric = columnProfiles.find((c) => c.type === 'number')?.name || cols[1] || cols[0];
        setChartCategoryCol(firstCategory);
        setChartNumericCol(firstNumeric);
      },
      error: (err: any) => {
        setError(`CSV Parser error: ${err.message}`);
      },
    });
  };

  const handleGenerateAiInsights = async () => {
    if (!profile) return;

    setAiLoading(true);
    setError(null);
    setActiveTab('ai-insights');

    try {
      const response = await fetch('/api/data-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          sampleRows: parsedData.slice(0, 5),
          filename: fileName,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      const data: DataInsightsResult = await response.json();
      setInsights(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate AI data insights.');
    } finally {
      setAiLoading(false);
    }
  };

  // Filtered preview data
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return parsedData;
    const q = searchQuery.toLowerCase();
    return parsedData.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [parsedData, searchQuery]);

  const pageSize = 8;
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Chart data computation: Aggregate numeric value by category
  const chartData = useMemo(() => {
    if (!chartCategoryCol || !parsedData.length) return [];

    const map: Record<string, { count: number; sum: number }> = {};
    parsedData.forEach((row) => {
      const cat = String(row[chartCategoryCol] ?? 'N/A');
      const num = typeof row[chartNumericCol] === 'number' ? row[chartNumericCol] : 1;

      if (!map[cat]) {
        map[cat] = { count: 0, sum: 0 };
      }
      map[cat].count += 1;
      map[cat].sum += num;
    });

    const entries = Object.entries(map).map(([label, d]) => ({
      label,
      count: d.count,
      total: Math.round(d.sum * 100) / 100,
      average: Math.round((d.sum / d.count) * 100) / 100,
    }));

    return entries.slice(0, 10); // top 10 categories
  }, [parsedData, chartCategoryCol, chartNumericCol]);

  const maxChartValue = useMemo(() => {
    if (!chartData.length) return 1;
    return Math.max(...chartData.map((d) => d.total), 1);
  }, [chartData]);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
              AI Data Analyst
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Deterministic Math + Grounded AI
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Perform Exploratory Data Analysis (EDA), view summary statistics, interactive visual charts, and generate evidence-backed executive narratives.
          </p>
        </div>

        {/* Demo buttons & Upload */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleLoadSample('saas')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Load SaaS Churn CSV</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('ecommerce')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Load E-Commerce CSV</span>
          </button>
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
            <input
              type="file"
              accept=".csv,.tsv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      {profile && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-zinc-400">Total Records</span>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
              {profile.rowCount.toLocaleString()}
            </p>
            <span className="text-[10px] text-zinc-500">Rows in dataset</span>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-zinc-400">Columns</span>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
              {profile.columnCount}
            </p>
            <span className="text-[10px] text-zinc-500">Features detected</span>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-zinc-400">Missing Values</span>
            <p className={`text-2xl font-bold mt-1 ${profile.totalMissing > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {profile.totalMissing}
            </p>
            <span className="text-[10px] text-zinc-500">Null or blank cells</span>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-zinc-400">Loaded Dataset</span>
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate mt-1" title={fileName}>
                {fileName}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateAiInsights}
              disabled={aiLoading}
              className="mt-2 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{insights ? 'Refresh Insights' : 'Generate AI Insights'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'preview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Data Preview ({parsedData.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Summary Statistics</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('charts')}
          className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'charts'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Visual Distribution Charts</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ai-insights')}
          className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'ai-insights'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Grounded AI Insights {insights && '(Ready)'}</span>
        </button>
      </div>

      {error && <ErrorBanner error={error} onRetry={handleGenerateAiInsights} />}

      {/* Tab 1: Data Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search records across all fields..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <span className="text-xs text-zinc-500">
              Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length} rows
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  {columns.map((col) => (
                    <th key={col} className="py-2.5 px-3 font-semibold uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {paginatedRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-950/60">
                    {columns.map((col) => (
                      <td key={col} className="py-2.5 px-3 whitespace-nowrap text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">
                        {row[col] !== null && row[col] !== undefined ? String(row[col]) : (
                          <span className="text-zinc-400 italic">null</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Summary Statistics */}
      {activeTab === 'stats' && profile && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Column</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Type</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Missing</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Unique</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Min</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Max</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Mean</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Median</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Std Dev</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:border-zinc-800">
                {profile.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-950/60">
                    <td className="py-2.5 px-3 font-bold text-zinc-900 dark:text-white">
                      {col.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        col.type === 'number'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {col.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-600 dark:text-zinc-400">
                      {col.missingCount}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-600 dark:text-zinc-400">
                      {col.uniqueCount}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-700 dark:text-zinc-300">
                      {col.numericStats ? col.numericStats.min : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-700 dark:text-zinc-300">
                      {col.numericStats ? col.numericStats.max : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-700 dark:text-zinc-300">
                      {col.numericStats ? col.numericStats.mean : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-700 dark:text-zinc-300">
                      {col.numericStats ? col.numericStats.median : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-700 dark:text-zinc-300">
                      {col.numericStats ? col.numericStats.stdDev : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Visual Distribution Charts */}
      {activeTab === 'charts' && profile && (
        <div className="space-y-6">
          {/* Chart Controls */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-600 dark:text-zinc-400 uppercase text-[10px]">Grouping Column (X-Axis):</span>
              <select
                value={chartCategoryCol}
                onChange={(e) => setChartCategoryCol(e.target.value)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              >
                {columns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-600 dark:text-zinc-400 uppercase text-[10px]">Metric Aggregate (Y-Axis):</span>
              <select
                value={chartNumericCol}
                onChange={(e) => setChartNumericCol(e.target.value)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              >
                {columns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Aggregated Value Breakdown: {chartNumericCol} by {chartCategoryCol}
                </h4>
                <p className="text-xs text-zinc-500">
                  Computed dynamically from actual parsed rows
                </p>
              </div>
            </div>

            {chartData.length > 0 ? (
              <div className="space-y-3 pt-2">
                {chartData.map((item, idx) => {
                  const percentage = Math.max(Math.round((item.total / maxChartValue) * 100), 4);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {item.label} <span className="text-zinc-400 text-[11px]">({item.count} rows)</span>
                        </span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {item.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">No chart data could be aggregated with selected features.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Grounded AI Insights */}
      {activeTab === 'ai-insights' && (
        <div className="space-y-6">
          {!insights && !aiLoading && (
            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-500 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Generate Factual AI Narrative from Computed Stats
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Gemini 3.8 Flash will interpret the exact distributions, detect outliers, identify business trends, and formulate strategic actions grounded in your CSV.
              </p>
              <button
                type="button"
                onClick={handleGenerateAiInsights}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
              >
                <span>Synthesize Strategic Report</span>
              </button>
            </div>
          )}

          {aiLoading && (
            <LoadingState
              message="Synthesizing Grounded Insights with Gemini 3.8 Flash..."
              stepDescription="Cross-referencing computed distribution metrics, evaluating correlation hypotheses, and drafting strategic recommendations."
            />
          )}

          {insights && !aiLoading && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Executive Overview */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      Executive Narrative: {insights.datasetTitle}
                    </h3>
                  </div>
                  <CopyButton
                    text={`Data Intelligence Report: ${insights.datasetTitle}\n\nOverview:\n${insights.executiveOverview}\n\nKey Observations:\n${insights.keyObservations.map((o) => `• [${o.significance}] ${o.metric}: ${o.observation}`).join('\n')}`}
                    label="Copy Report"
                  />
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {insights.executiveOverview}
                </p>
              </div>

              {/* Key Observations */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                  Key Observations Grounded in Evidence
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {insights.keyObservations.map((obs, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-900 dark:text-white">{obs.metric}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          obs.significance === 'High'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                        }`}>
                          {obs.significance} Impact
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400">{obs.observation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anomalies & Strategic Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Anomalies & Data Quality */}
                <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                      Anomalies & Data Quality Issues
                    </h4>
                  </div>
                  <div className="space-y-2.5 pt-1">
                    {insights.anomaliesAndQuality.map((ano, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                        <span className="font-bold text-zinc-900 dark:text-white">{ano.column}: {ano.issue}</span>
                        <p className="text-zinc-500"><strong>Impact: </strong>{ano.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategic Actions */}
                <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Lightbulb className="w-5 h-5" />
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                      Strategic Business Recommendations
                    </h4>
                  </div>
                  <div className="space-y-2.5 pt-1">
                    {insights.strategicRecommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                        <span className="font-bold text-zinc-900 dark:text-white">{rec.title}</span>
                        <p className="text-zinc-600 dark:text-zinc-300">{rec.action}</p>
                        <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                          Expected Outcome: {rec.expectedImpact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
