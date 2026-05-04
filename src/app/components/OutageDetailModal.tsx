import { X, MapPin, Clock, Users, AlertCircle, Wrench } from 'lucide-react';
import type { Outage } from '../../types/outage';

interface OutageDetailModalProps {
  outage: Outage;
  onClose: () => void;
}

const statusConfig = {
  investigating: {
    label: 'Investigating',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    icon: AlertCircle,
    description: 'Our team is assessing the situation'
  },
  repairing: {
    label: 'Repair in Progress',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    icon: Wrench,
    description: 'Crews are working to restore power'
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
    icon: Clock,
    description: 'Power has been restored'
  }
};

export function OutageDetailModal({ outage, onClose }: OutageDetailModalProps) {
  const config = statusConfig[outage.status];
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300 shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-5 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
          <div>
            <h2 className="font-bold text-white text-lg">Outage Details</h2>
            <p className="text-violet-100 text-sm mt-0.5">Complete information</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all hover:scale-105"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 ${config.color}`}>
            <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-800/50 flex items-center justify-center flex-shrink-0">
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-lg mb-1">{config.label}</p>
              <p className="text-sm opacity-90">{config.description}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">Location</span>
              </div>
              <div className="pl-10">
                <p className="font-bold text-gray-900 dark:text-gray-100">{outage.location}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{outage.address}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">Timeline</span>
              </div>
              <div className="pl-10 space-y-2">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Reported:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {outage.reportedAt.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
                {outage.estimatedRestoration && outage.status !== 'resolved' && (
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Est. restoration:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {outage.estimatedRestoration.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-violet-200 dark:border-violet-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">Impact</span>
              </div>
              <div className="pl-10">
                <p className="text-sm">
                  <span className="font-bold text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{outage.affectedUsers.toLocaleString()}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">customers affected</span>
                </p>
              </div>
            </div>

            {outage.description && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Additional Information</span>
                </div>
                <div className="pl-10">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{outage.description}</p>
                </div>
              </div>
            )}
          </div>

          {outage.status === 'repairing' && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-5">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong className="font-bold">Live Update:</strong> Our field crews are on-site working to restore power as quickly and safely as possible.
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 rounded-b-3xl sm:rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
