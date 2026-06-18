import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export default function UploadCard({ onFileSelected, isLoading }) {
  const fileInputRef = useRef(null);

  const handleDivClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="soft-card p-8 w-full h-full flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold text-textMain mb-6">Upload Image to Classify</h2>
      <div 
        className={`w-full h-64 border-2 border-dashed border-lightBlue/60 bg-lightBlue/5 rounded-[20px] flex flex-col items-center justify-center transition-colors px-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lightBlue/10 cursor-pointer group'}`}
        onClick={handleDivClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className={`p-4 bg-white rounded-full shadow-sm mb-4 transition-transform duration-300 ${!isLoading && 'group-hover:scale-110'}`}>
          <Upload className={`w-8 h-8 ${isLoading ? 'text-gray-400 animate-pulse' : 'text-lightBlue'}`} />
        </div>
        <p className="text-textMain font-semibold text-lg mb-1">
          {isLoading ? 'Analyzing image...' : 'Drag & drop your image here'}
        </p>
        <p className="text-textMuted text-sm mb-6">
          {!isLoading && 'or click to browse your files'}
        </p>
        {!isLoading && (
          <button className="px-6 py-2.5 bg-lavender hover:bg-lavender/80 text-textMain font-semibold rounded-full shadow-sm transition-colors text-sm pointer-events-none">
            Choose File
          </button>
        )}
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png"
        />
      </div>
    </div>
  );
}
