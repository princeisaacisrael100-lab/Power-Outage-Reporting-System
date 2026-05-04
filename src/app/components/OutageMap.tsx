import { MapPin } from 'lucide-react';
import type { Outage } from '../../types/outage';

interface OutageMapProps {
  outages: Outage[];
  onOutageClick: (outage: Outage) => void;
}

const statusColors = {
  investigating: 'bg-yellow-500 dark:bg-yellow-400',
  repairing: 'bg-orange-500 dark:bg-orange-400',
  resolved: 'bg-green-500 dark:bg-green-400'
};

export function OutageMap({ outages, onOutageClick }: OutageMapProps) {
  const activeOutages = outages.filter(o => o.status !== 'resolved');

  return (
    <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/50 dark:via-purple-950/50 dark:to-pink-950/50 rounded-2xl p-8 relative overflow-hidden min-h-[400px] border border-violet-200 dark:border-violet-900/50 shadow-xl">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,30 50,50 T100,50" stroke="currentColor" fill="none" strokeWidth="0.5" />
          <path d="M0,60 Q25,40 50,60 T100,60" stroke="currentColor" fill="none" strokeWidth="0.5" />
          <path d="M20,0 L20,100" stroke="currentColor" fill="none" strokeWidth="0.3" />
          <path d="M40,0 L40,100" stroke="currentColor" fill="none" strokeWidth="0.3" />
          <path d="M60,0 L60,100" stroke="currentColor" fill="none" strokeWidth="0.3" />
          <path d="M80,0 L80,100" stroke="currentColor" fill="none" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <MapPin className="w-5 h-5 text-violet-700 dark:text-violet-300" />
          </div>
          <h3 className="font-semibold text-lg text-violet-900 dark:text-violet-100">Outage Map View</h3>
          <span className="ml-auto px-4 py-1.5 bg-white dark:bg-gray-900 rounded-full text-sm font-semibold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
            {activeOutages.length} active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeOutages.map((outage, index) => (
            <button
              key={outage.id}
              onClick={() => onOutageClick(outage)}
              className="group bg-white dark:bg-gray-900 rounded-xl p-4 hover:shadow-xl hover:shadow-violet-500/20 transition-all transform hover:-translate-y-1 text-left border-2 border-transparent hover:border-violet-500 dark:hover:border-violet-400"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full ${statusColors[outage.status]} mt-1.5 animate-pulse`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{outage.location}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">{outage.address}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-5 h-5 rounded bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <svg className="w-3 h-3 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {outage.affectedUsers} users
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {activeOutages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-violet-900 dark:text-violet-100 font-semibold text-lg mb-1">No active outages</p>
            <p className="text-sm text-violet-700 dark:text-violet-300">All systems operational</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Zap({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}
