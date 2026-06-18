import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import UploadCard from '../components/UploadCard';
import ResultCard from '../components/ResultCard';
import PerformanceMetrics from '../components/PerformanceMetrics';
import PredictionChart from '../components/PredictionChart';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch history on component mount
  const fetchHistory = async () => {
    try {
      const res = await axios.get('/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileSelected = async (file) => {
    // Basic validation
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPEG and PNG files are accepted.');
      return;
    }

    // Generate local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null);
    setIsLoading(true);

    // Call API
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      // Refresh history to include recent record
      fetchHistory();
    } catch (err) {
      console.error('Failed to predict:', err);
      alert('An error occurred during prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 flex flex-col gap-8">
      <HeroSection />
      
      <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch justify-center">
        {/* Left Column */}
        <div className="w-full lg:w-1/2 flex">
          <UploadCard onFileSelected={handleFileSelected} isLoading={isLoading} />
        </div>
        
        {/* Right Column (Conditional) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <ResultCard previewUrl={previewUrl} result={result} isLoading={isLoading} />
        </div>
      </div>

      {/* Diagnostics Row */}
      {(isLoading || result) && (
        <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch justify-center">
          <div className="w-full lg:w-1/2 flex">
            <PredictionChart probabilities={result?.probabilities} isLoading={isLoading} />
          </div>
          <div className="w-full lg:w-1/2 flex">
            <PerformanceMetrics metrics={result?.metrics} isLoading={isLoading} />
          </div>
        </div>
      )}

      {/* Small History strip */}
      {history.length > 0 && (
        <div className="mt-12 pt-8 border-t border-black/5 flex flex-col items-center pb-8">
          <p className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-4">Recent Classifications</p>
          <div className="flex flex-wrap justify-center gap-4">
            {history.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                className="group relative w-12 h-12 rounded-full shadow-sm bg-pastelWhite cursor-pointer border border-softGray hover:shadow-md transition-shadow"
              >
                {/* As backend just gives filename not full URL, we'd need a route to serve images. 
                    Since we don't have one right now, we can render the label inside the circle for history 
                    or generate a random avatar if we can't fetch it easily. 
                    Let's just show initials or an icon. */}
                <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-textMuted font-bold leading-tight group-hover:bg-lightBlue/10 rounded-full">
                  <span>{Math.round(item.confidence * 100)}%</span>
                </div>
                
                {/* Tooltip for history */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-textMain text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none capitalize">
                  {item.prediction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
