import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { LandingPage } from './components/LandingPage';
import { DescriptionDialog } from './components/DescriptionDialog';
import Dashboard from './components/Dashboard';
import { parseFile, performEDA, checkDatasetSize } from './utils/dataProcessor';
import { CleanedData } from './types/dashboard';
import { Loader2 } from 'lucide-react';

type AppState = 'landing' | 'upload' | 'describe' | 'processing' | 'dashboard';
type DataType = 'sales' | 'collection' | 'dispatch';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [selectedDataType, setSelectedDataType] = useState<DataType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [cleanedData, setCleanedData] = useState<CleanedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDataTypeSelect = (dataType: DataType) => {
    setSelectedDataType(dataType);
    setState('upload');
  };

  const handleFileSelect = (file: File) => {
    const sizeCheck = checkDatasetSize(file);

    if (sizeCheck.isLarge && sizeCheck.message) {
      const proceed = window.confirm(
        `${sizeCheck.message}\n\nDo you want to proceed with front-end processing?`
      );
      if (!proceed) return;
    }

    setSelectedFile(file);
    setState('describe');
  };

  const handleDescriptionSubmit = async (desc: string) => {
    setDescription(desc);
    setState('processing');
    setError(null);

    try {
      if (!selectedFile) throw new Error('No file selected');

      const rawData = await parseFile(selectedFile);

      if (!rawData || rawData.length === 0) {
        throw new Error('No data found in file. Please check your file format.');
      }

      const cleaned = performEDA(rawData);

      if (cleaned.cleanedRowCount === 0) {
        throw new Error('All data was filtered out during cleaning. Please check your data quality.');
      }

      setCleanedData(cleaned);
      setState('dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
      setState('upload');
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleBackToLanding = () => {
    setSelectedDataType(null);
    setSelectedFile(null);
    setDescription('');
    setCleanedData(null);
    setError(null);
    setState('landing');
  };

  return (
    <div>
      {state === 'landing' && (
        <LandingPage onSelectDataType={handleDataTypeSelect} />
      )}

      {state === 'upload' && (
        <FileUpload 
          onFileSelect={handleFileSelect}
          dataType={selectedDataType}
          onBack={handleBackToLanding}
        />
      )}

      {state === 'describe' && selectedFile && (
        <DescriptionDialog
          fileName={selectedFile.name}
          onSubmit={handleDescriptionSubmit}
          dataType={selectedDataType}
          onBack={() => setState('upload')}
        />
      )}

      {state === 'processing' && (
        <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#007BFF] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl p-12 text-center">
            <Loader2 className="w-16 h-16 text-[#007BFF] mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-[#001F3F] mb-2">
              Processing Your Data
            </h2>
            <p className="text-gray-600">
              Performing exploratory data analysis...
            </p>
          </div>
        </div>
      )}

      {state === 'dashboard' && cleanedData && (
        <Dashboard
          data={cleanedData}
          description={description}
          fileSize={selectedFile?.size}
          dataType={selectedDataType}
          onBack={handleBackToLanding}
        />
      )}
    </div>
  );
}

export default App;
