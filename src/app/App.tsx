import { useEffect, useMemo, useState } from 'react';
import { Zap, Plus, Filter, Search, ArrowUpDown, Map, List, TrendingDown } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { ReportOutageForm } from './components/ReportOutageForm';
import { OutageCard } from './components/OutageCard';
import type { Outage } from '../types/outage';
import { OutageMap } from './components/OutageMap';
import { OutageDetailModal } from './components/OutageDetailModal';
import { MOCK_OUTAGES } from '../data/mockData';

const STORAGE_KEY = 'powergrid-outages';

function parseSavedOutages(value: string | null): Outage[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as Array<
      Omit<Outage, 'reportedAt' | 'estimatedRestoration'> & {
        reportedAt: string;
        estimatedRestoration?: string;
      }
    >;

    return parsed.map((item) => ({
      ...item,
      reportedAt: new Date(item.reportedAt),
      estimatedRestoration: item.estimatedRestoration ? new Date(item.estimatedRestoration) : undefined
    }));
  } catch {
    return [];
  }
}

function loadSavedOutages(): Outage[] {
  if (typeof window === 'undefined') {
    return MOCK_OUTAGES;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  const parsed = parseSavedOutages(saved);

  return parsed.length ? parsed : MOCK_OUTAGES;
}

type StatusFilter = 'all' | 'investigating' | 'repairing' | 'resolved';
type SortOption = 'recent' | 'affected' | 'location';
type ViewMode = 'list' | 'map';

export default function App() {
  const [outages, setOutages] = useState<Outage[]>(() => loadSavedOutages());
  const [showReportForm, setShowReportForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedOutage, setSelectedOutage] = useState<Outage | null>(null);

  const filteredOutages = useMemo(() => {
    let outagesToFilter = statusFilter === 'all'
      ? outages
      : outages.filter(o => o.status === statusFilter);

    if (searchQuery) {
      outagesToFilter = outagesToFilter.filter(
        o => o.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
             o.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (!!o.description && o.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return [...outagesToFilter].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.reportedAt.getTime() - a.reportedAt.getTime();
        case 'affected':
          return b.affectedUsers - a.affectedUsers;
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });
  }, [outages, searchQuery, sortBy, statusFilter]);

  const stats = useMemo(() => ({
    total: outages.filter(o => o.status !== 'resolved').length,
    investigating: outages.filter(o => o.status === 'investigating').length,
    repairing: outages.filter(o => o.status === 'repairing').length,
    affected: outages.filter(o => o.status !== 'resolved').reduce((sum, o) => sum + o.affectedUsers, 0)
  }), [outages]);

  const handleReportOutage = (report: {
    location: string;
    address: string;
    name: string;
    phone: string;
    description: string;
  }) => {
    const newOutage: Outage = {
      id: Date.now().toString(),
      location: report.location,
      address: report.address,
      status: 'investigating',
      reportedAt: new Date(),
      affectedUsers: 1,
      description: report.description || undefined
    };

    setOutages([newOutage, ...outages]);
    setShowReportForm(false);
    toast.success('Outage reported successfully', {
      description: `We've received your report for ${report.location}. Our team will investigate.`
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(outages));
    }
  }, [outages]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/30 to-purple-50/30 dark:from-gray-950 dark:via-violet-950/30 dark:to-purple-950/30 transition-colors">
        <Toaster position="top-center" richColors />

        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Zap className="w-7 h-7 text-white fill-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">PowerGrid</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Outage Management</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setShowReportForm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Report Outage</span>
                </button>
              </div>
            </div>
          </div>
        </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:shadow-red-500/10 dark:hover:shadow-red-500/20 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <TrendingDown className="w-4 h-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Outages</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 dark:from-red-400 dark:to-red-300 bg-clip-text text-transparent">{stats.total}</p>
          </div>

          <div className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:shadow-yellow-500/10 dark:hover:shadow-yellow-500/20 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 flex items-center justify-center">
                <Search className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Investigating</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-400 dark:to-yellow-300 bg-clip-text text-transparent">{stats.investigating}</p>
          </div>

          <div className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/20 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Repairing</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-400 dark:to-orange-300 bg-clip-text text-transparent">{stats.repairing}</p>
          </div>

          <div className="group bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-5 hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-violet-100 mb-1">Users Affected</p>
            <p className="text-3xl font-bold text-white">{stats.affected.toLocaleString()}</p>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by location or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-12 pr-8 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="affected">Most Affected</option>
                  <option value="location">Location A-Z</option>
                </select>
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  title="List view"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-3 border-l border-gray-200 dark:border-gray-700 transition-all ${
                    viewMode === 'map'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  title="Map view"
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-xl">
            <Filter className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          </div>
          {(['all', 'investigating', 'repairing', 'resolved'] as StatusFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                statusFilter === filter
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {viewMode === 'map' ? (
          <OutageMap outages={filteredOutages} onOutageClick={setSelectedOutage} />
        ) : (
          <div className="space-y-3">
            {filteredOutages.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">No outages found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'Try adjusting your search' : 'No outages match your filters'}
                </p>
              </div>
            ) : (
              filteredOutages.map((outage, index) => (
                <OutageCard
                  key={outage.id}
                  outage={outage}
                  index={index}
                  onClick={() => setSelectedOutage(outage)}
                />
              ))
            )}
          </div>
        )}
      </main>

      {showReportForm && (
        <ReportOutageForm
          onSubmit={handleReportOutage}
          onCancel={() => setShowReportForm(false)}
        />
      )}

      {selectedOutage && (
        <OutageDetailModal
          outage={selectedOutage}
          onClose={() => setSelectedOutage(null)}
        />
      )}
      </div>
    </ThemeProvider>
  );
}