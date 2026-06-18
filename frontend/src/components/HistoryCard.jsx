import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function HistoryCard() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const resp = await axios.get('/history');
        setHistory(resp.data);
      } catch (err) {
        setError('Could not load history');
      }
    };
    fetchHistory();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="glass p-4 mt-4 w-full max-w-lg">
      <h2 className="text-lg font-semibold mb-2">Prediction History</h2>
      {history.length === 0 ? (
        <p className="text-gray-400">No predictions yet.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((item) => (
            <li key={item.id} className="border-b border-gray-600 pb-2">
              <p><span className="font-medium">File:</span> {item.filename}</p>
              <p><span className="font-medium">Prediction:</span> {item.prediction}</p>
              <p><span className="font-medium">Confidence:</span> {(item.confidence * 100).toFixed(1)}%</p>
              <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
