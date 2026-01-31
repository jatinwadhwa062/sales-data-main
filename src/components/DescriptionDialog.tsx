import { useState } from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

interface DescriptionDialogProps {
  onSubmit: (description: string) => void;
  fileName: string;
  dataType?: string | null;
  onBack?: () => void;
}

export const DescriptionDialog = ({ onSubmit, fileName, dataType, onBack }: DescriptionDialogProps) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description.trim());
    }
  };

  const dataTypeLabels: Record<string, string> = {
    sales: 'Sales Data',
    collection: 'Collection Data',
    dispatch: 'Dispatch Data',
  };

  const placeholders: Record<string, string> = {
    sales: 'e.g., Sales of textiles in global markets, E-commerce electronics sales data...',
    collection: 'e.g., Bank loan collections, Insurance premium collections...',
    dispatch: 'e.g., Logistics shipments across regions, Last-mile delivery data...',
  };

  const defaultDescription = dataType ? dataTypeLabels[dataType] : 'Data Analysis';
  const placeholder = dataType ? placeholders[dataType] : 'e.g., Sales of textiles in global markets...';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#007BFF] hover:text-[#0056b3] font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to File Upload
          </button>
        )}

        <div className="flex items-center mb-6">
          <FileText className="w-8 h-8 text-[#007BFF] mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-[#001F3F]">
              Describe Your {dataType ? dataTypeLabels[dataType] : 'Data'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              File: {fileName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#333333] mb-2">
              What does this data represent?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#007BFF] focus:outline-none resize-none"
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              This will customize your dashboard title and labels
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#007BFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0056b3] transition-colors"
            >
              Generate Dashboard
            </button>
          </div>
        </form>

        <div className="mt-6 bg-[#F5F5F5] p-4 rounded-lg">
          <h4 className="font-semibold text-[#333333] mb-2 text-sm">Tips:</h4>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• Be specific about your industry or product</li>
            <li>• Mention the geographic scope if relevant</li>
            <li>• Include the time period if applicable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
