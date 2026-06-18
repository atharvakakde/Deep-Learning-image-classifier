import React from 'react';
import { motion } from 'framer-motion';
import { Target, Crosshair, RefreshCw, Activity, Info } from 'lucide-react';

const MetricBar = ({ label, value, icon: Icon, description }) => {
  const displayValue = Math.round(value * 100);
  
  // Color coding logic
  let colorClass = 'bg-red-400';
  if (value > 0.9) colorClass = 'bg-green-400';
  else if (value >= 0.7) colorClass = 'bg-yellow-400';

  return (
    <div className="w-full mb-5">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 group relative">
          <Icon className="w-4 h-4 text-textMuted" />
          <span className="text-sm font-semibold text-textMain capitalize">{label}</span>
          <Info className="w-3 h-3 text-lightBlue cursor-pointer" />
          {/* Tooltip */}
          <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-textMain text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg hidden md:block">
            {description}
          </div>
        </div>
        <span className="text-sm font-bold text-textMuted">{displayValue}%</span>
      </div>
      
      <div className="h-2.5 w-full bg-softGray rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6 w-full">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 bg-softGray rounded w-24"></div>
          <div className="h-4 bg-softGray rounded w-8"></div>
        </div>
        <div className="h-2.5 w-full bg-softGray rounded-full"></div>
      </div>
    ))}
  </div>
);

export default function PerformanceMetrics({ metrics, isLoading }) {
  if (!isLoading && !metrics) return null;

  return (
    <div className="soft-card p-6 w-full h-full flex flex-col items-center">
      <div className="w-full mb-6 text-center border-b border-softGray pb-4">
        <h3 className="text-xl font-bold text-textMain">Model Performance</h3>
        <p className="text-sm text-textMuted mt-1">Real-time inference training metrics</p>
      </div>

      <div className="w-full flex-grow flex flex-col justify-center">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="w-full">
            <MetricBar 
              label="Accuracy" 
              value={metrics.accuracy} 
              icon={Target} 
              description="Overall correctness of the model across all classes."
            />
            <MetricBar 
              label="Precision" 
              value={metrics.precision} 
              icon={Crosshair} 
              description="Proportion of positive identifications that were actually correct."
            />
            <MetricBar 
              label="Recall" 
              value={metrics.recall} 
              icon={RefreshCw} 
              description="Proportion of actual positives that were identified correctly."
            />
            <MetricBar 
              label="F1 Score" 
              value={metrics.f1_score} 
              icon={Activity} 
              description="Harmonic mean of Precision and Recall representing overall robustness."
            />
          </div>
        )}
      </div>
    </div>
  );
}
