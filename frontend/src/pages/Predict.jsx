import React, { useState } from 'react';
import UploadCard from '../components/UploadCard';
import ResultCard from '../components/ResultCard';
import HistoryCard from '../components/HistoryCard';

export default function Predict({ setResult, result }) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex flex-col items-center p-4">
      <UploadCard setResult={setResult} />
      {result && <ResultCard result={result} />}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="mt-4 px-4 py-2 bg-secondary text-white rounded"
      >
        {showHistory ? 'Hide' : 'Show'} History
      </button>
      {showHistory && <HistoryCard />}
    </div>
  );
}
