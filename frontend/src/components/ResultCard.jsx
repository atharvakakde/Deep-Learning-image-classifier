import React from 'react';

const SoftProgressBar = ({ label, score, colorClass }) => {
  // ensure score is rounded down to a clean number in UI usually
  const displayScore = Math.round(score * 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5 font-medium">
        <span className="text-textMain capitalize">{label}</span>
        <span className="text-textMuted">{displayScore}%</span>
      </div>
      <div className="h-3 w-full bg-softGray rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`} 
          style={{ width: `${displayScore}%` }} 
        />
      </div>
    </div>
  );
};

export default function ResultCard({ previewUrl, result }) {
  if (!result || !previewUrl) return null;

  const topPrediction = result.prediction;
  // If prediction is uncertain, set a default
  const isUncertain = topPrediction.toLowerCase() === 'uncertain';

  const formatConfidence = (conf) => Math.round(conf * 100);

  const colors = ["bg-lightBlue", "bg-lavender", "bg-softPink"];

  return (
    <div className="soft-card p-6 w-full h-full flex flex-col gap-6 items-center animate-fade-in-up">
      {/* Uploaded Image Thumbnail */}
      <div className="w-full aspect-square md:w-3/4 lg:w-full max-w-sm rounded-[20px] overflow-hidden bg-softGray flex-shrink-0 shadow-sm relative group">
        <img 
          src={previewUrl} 
          alt="Classified" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Simple Soft Label */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur text-textMain px-4 py-1.5 rounded-full text-xs font-bold shadow-sm capitalize whitespace-nowrap">
          Detected: {topPrediction}
        </div>
      </div>

      {/* Prediction Results */}
      <div className="w-full flex flex-col justify-center py-2 relative flex-grow min-h-[250px]">
        <h3 className="text-3xl font-bold text-textMain mb-2 capitalize">{topPrediction}</h3>
        <p className="text-sm text-textMuted font-medium mb-6">
          {isUncertain ? "The model is not quite sure about this one." : "Our model is quite confident!"} ({formatConfidence(result.confidence)}%)
        </p>
        
        {/* Top 3 Predictions */}
        <div className="space-y-2 mt-auto">
          <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-4">Top Predictions</p>
          {result.top_predictions.map((pred, index) => (
            <SoftProgressBar 
              key={index} 
              label={pred.class_name} 
              score={pred.confidence} 
              colorClass={colors[index % colors.length]} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
