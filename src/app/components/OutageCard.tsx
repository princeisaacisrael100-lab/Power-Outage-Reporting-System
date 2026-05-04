import { MapPin, Clock, Users, AlertTriangle } from 'lucide-react';
import type { Outage } from '../../types/outage';

interface OutageCardProps {
  outage: Outage;
  onClick?: () => void;
  index?: number;
}

const statusConfig = {
  investigating: {
    label: 'Investigating',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
    dotColor: 'bg-yellow-500 dark:bg-yellow-400'
  },
  repairing: {
    label: 'Repairing',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
    dotColor: 'bg-orange-500 dark:bg-orange-400'
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800',
    dotColor: 'bg-green-500 dark:bg-green-400'
  }
};

function getSeverityProps(affectedUsers: number) {
  if (affectedUsers >= 5000) return { label: 'Critical', color: 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800' };
  if (affectedUsers >= 1000) return { label: 'High', color: 'text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800' };
  if (affectedUsers >= 100) return { label: 'Medium', color: 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' };
  return { label: 'Low', color: 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' };
}

export function OutageCard({ outage, onClick, index = 0 }: OutageCardProps) {
  const config = statusConfig[outage.status];
  const timeAgo = getTimeAgo(outage.reportedAt);
  const severity = getSeverityProps(outage.affectedUsers);

  return (
    <button
      onClick={onClick}
      className="group w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/20 transition-all hover:-translate-y-1 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate mb-1">{outage.location}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {outage.address}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap ${config.color}`}>
          <span className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`} />
          {config.label}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400">
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <span>Reported {timeAgo}</span>
        </div>

        <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex items-center gap-2">
            <span><strong className="text-gray-900 dark:text-gray-100">{outage.affectedUsers.toLocaleString()}</strong> users affected</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${severity.color} flex items-center gap-1`}>
              {severity.label === 'Critical' || severity.label === 'High' ? <AlertTriangle className="w-3 h-3" /> : null}
              {severity.label}
            </span>
          </div>
        </div>

        {outage.estimatedRestoration && outage.status !== 'resolved' && (
          <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Est. {formatTime(outage.estimatedRestoration)}</span>
          </div>
        )}

        {outage.description && (
          <p className="text-gray-700 dark:text-gray-300 pt-3 border-t border-gray-200 dark:border-gray-800 line-clamp-2">{outage.description}</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
          View details
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </button>
  );
}

function getTimeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
