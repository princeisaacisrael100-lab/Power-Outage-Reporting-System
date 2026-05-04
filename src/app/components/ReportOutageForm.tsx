import { useState } from 'react';
import { MapPin, User, Phone, AlertCircle } from 'lucide-react';

interface ReportOutageFormProps {
  onSubmit: (outage: {
    location: string;
    address: string;
    name: string;
    phone: string;
    description: string;
  }) => void;
  onCancel: () => void;
}

export function ReportOutageForm({ onSubmit, onCancel }: ReportOutageFormProps) {
  const [formData, setFormData] = useState({
    location: '',
    address: '',
    name: '',
    phone: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ location: '', address: '', name: '', phone: '', description: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300"
      >
        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-5 rounded-t-3xl sm:rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Report Power Outage</h2>
          <p className="text-violet-100 text-sm mt-1">Help us restore power faster</p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Location/Area
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Downtown, West Side"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Street Address
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <User className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Your Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Phone className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Additional Details (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Any additional information about the outage..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex gap-3 rounded-b-3xl sm:rounded-b-2xl">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/30 transition-all hover:scale-105"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}
