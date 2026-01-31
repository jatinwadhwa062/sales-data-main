import { AlertTriangle } from 'lucide-react';

interface WarningBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const WarningBanner = ({ message, onDismiss }: WarningBannerProps) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-yellow-800">{message}</p>
          <div className="mt-2 text-xs text-yellow-700 space-y-1">
            <p className="font-semibold">Consider using a backend for better performance:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5">
              <li>Use Node.js with Express for processing</li>
              <li>Deploy for free on Render.com, Vercel, or Heroku</li>
              <li>Store data temporarily in SQLite or in-memory</li>
              <li>Create API endpoints for data aggregation</li>
            </ul>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-yellow-600 hover:text-yellow-800"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
