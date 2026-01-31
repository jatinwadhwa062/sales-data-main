import { Upload, ArrowLeft, Cloud, CheckCircle2, Zap, Lock, FileText } from 'lucide-react';
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  dataType?: string | null;
  onBack?: () => void;
}

export const FileUpload = ({ onFileSelect, dataType, onBack }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const dataTypeConfig: Record<string, { 
    label: string;
    subtitle: string;
    gradient: string;
    headerGradient: string;
    accentColor: string;
    accentBg: string;
    badgeColor: string;
    features: string[];
  }> = {
    sales: {
      label: 'Sales Analytics',
      subtitle: 'Upload your textile sales and revenue data',
      gradient: 'from-teal-50 via-teal-100 to-cyan-50',
      headerGradient: 'from-teal-600 to-cyan-700',
      accentColor: 'text-teal-600',
      accentBg: 'bg-teal-100',
      badgeColor: 'bg-teal-500',
      features: ['CSV & Excel support', 'Automatic validation', 'Secure processing'],
    },
    collection: {
      label: 'Payment Collections',
      subtitle: 'Upload your payment collection and receivables data',
      gradient: 'from-purple-50 via-purple-100 to-pink-50',
      headerGradient: 'from-purple-600 to-pink-700',
      accentColor: 'text-purple-600',
      accentBg: 'bg-purple-100',
      badgeColor: 'bg-purple-500',
      features: ['CSV & Excel support', 'Automatic validation', 'Secure processing'],
    },
    dispatch: {
      label: 'Logistics & Dispatch',
      subtitle: 'Upload your shipment and logistics data',
      gradient: 'from-amber-50 via-orange-100 to-red-50',
      headerGradient: 'from-amber-600 to-orange-700',
      accentColor: 'text-amber-600',
      accentBg: 'bg-amber-100',
      badgeColor: 'bg-amber-500',
      features: ['CSV & Excel support', 'Automatic validation', 'Secure processing'],
    },
  };

  const config = dataType && dataTypeConfig[dataType] ? dataTypeConfig[dataType] : dataTypeConfig.sales;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      onFileSelect(file);
    } else {
      alert('Please upload a CSV or Excel file');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6 w-full">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-3 sm:mb-4 transition-all group text-xs sm:text-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Data Types
            </button>
          )}

          <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              {config.label}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-light max-w-2xl">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-3 sm:px-4 pb-4 sm:pb-6">
          <div className={`bg-gradient-to-br ${config.gradient} rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full border border-white/40 backdrop-blur-sm`}>
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 text-center transition-all duration-500 cursor-pointer ${
                isDragging
                  ? `border-blue-400 bg-white/40 scale-105 shadow-xl`
                  : `border-slate-300 hover:border-slate-400 hover:bg-white/20`
              }`}
            >
              <div className={`inline-block p-3 sm:p-4 rounded-2xl ${config.accentBg} mb-4 sm:mb-6 transition-all duration-500 ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}>
                {isDragging ? (
                  <Cloud className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${config.accentColor}`} />
                ) : (
                  <Upload className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${config.accentColor}`} />
                )}
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
                {isDragging ? 'Drop your file here' : 'Upload Your File'}
              </h3>
              <p className="text-slate-600 mb-4 sm:mb-6 font-light text-xs sm:text-sm md:text-base">
                Drag and drop your file or click to browse
              </p>

              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className={`inline-block bg-gradient-to-r ${config.headerGradient} text-white px-6 sm:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-bold cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform text-xs sm:text-sm md:text-base`}
              >
                Select File
              </label>

              <p className="text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6 font-light">
                CSV, XLSX, XLS formats • Up to 100MB
              </p>
            </div>

            {/* Features Grid */}
            <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {[
                { icon: CheckCircle2, label: 'Validated' },
                { icon: Zap, label: 'Fast' },
                { icon: Lock, label: 'Secure' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-2xl ${config.accentBg} text-center transition-all hover:shadow-lg group`}>
                    <Icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 ${config.accentColor} mx-auto mb-1 sm:mb-2 group-hover:scale-110 transition-transform`} />
                    <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-700">{item.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Expected Format Section */}
            <div className={`mt-6 sm:mt-8 md:mt-10 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm`}>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <FileText className={`w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 ${config.accentColor}`} />
                <h4 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg">Expected Data Format</h4>
              </div>
              
              <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                <div className="flex gap-2.5 sm:gap-3 md:gap-4">
                  <div className={`w-1 rounded-full ${config.badgeColor} flex-shrink-0 mt-0.5 sm:mt-1`}></div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-0.5 sm:mb-1 text-xs sm:text-sm">Date Columns</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600">Order date, dispatch date, payment date, or transaction date</p>
                  </div>
                </div>
                <div className="flex gap-2.5 sm:gap-3 md:gap-4">
                  <div className={`w-1 rounded-full ${config.badgeColor} flex-shrink-0 mt-0.5 sm:mt-1`}></div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-0.5 sm:mb-1 text-xs sm:text-sm">Numeric Columns</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600">Sales amount, quantity, fabric meters, shipment cost, or payment amount</p>
                  </div>
                </div>
                <div className="flex gap-2.5 sm:gap-3 md:gap-4">
                  <div className={`w-1 rounded-full ${config.badgeColor} flex-shrink-0 mt-0.5 sm:mt-1`}></div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-0.5 sm:mb-1 text-xs sm:text-sm">Category Columns</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600">Product type, color, region, customer, warehouse, or any categorical data</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 md:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                <p className="text-[10px] sm:text-xs md:text-sm text-blue-900 font-medium">
                  Our system automatically detects and cleans data formats. Mixed formats are handled intelligently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
