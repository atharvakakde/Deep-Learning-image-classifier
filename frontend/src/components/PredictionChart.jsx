import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#ADD8E6', '#FFD1DC', '#E6E6FA', '#F0F0F0', '#dbd6ef'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur shadow-md border border-softGray rounded-lg p-3">
        <p className="font-bold text-textMain capitalize mb-1">{payload[0].payload.name}</p>
        <p className="text-textMuted text-sm">
          Confidence: <span className="font-bold">{Math.round(payload[0].value * 100)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const SkeletonLoader = () => (
  <div className="w-full h-full flex items-end justify-around gap-2 px-6 pt-12 pb-4">
    {[50, 80, 40, 60, 30].map((h, i) => (
      <div 
        key={i} 
        className="w-full bg-softGray rounded-t-md animate-pulse" 
        style={{ height: `${h}%` }}
      />
    ))}
  </div>
);

export default function PredictionChart({ probabilities, isLoading }) {
  const [chartType, setChartType] = useState('bar');

  if (!isLoading && !probabilities) return null;

  // Transform probabilities object into an array for Recharts
  const data = probabilities 
    ? Object.entries(probabilities)
        .map(([name, value]) => ({ name, value }))
    // eslint-disable-next-line
        .sort((a, b) => b.value - a.value)
    : [];

  return (
    <div className="soft-card p-6 w-full h-full flex flex-col items-center">
      <div className="w-full mb-6 flex justify-between items-end border-b border-softGray pb-4">
        <div>
          <h3 className="text-xl font-bold text-textMain">Prediction Breakdown</h3>
          <p className="text-sm text-textMuted mt-1">Class probability distribution</p>
        </div>
        
        {/* Toggle Controls */}
        <div className="flex bg-softGray rounded-full p-1 shadow-inner">
          <button 
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-full transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-textMain' : 'text-textMuted hover:text-textMain'}`}
            title="Bar Chart"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setChartType('pie')}
            className={`p-1.5 rounded-full transition-all ${chartType === 'pie' ? 'bg-white shadow-sm text-textMain' : 'text-textMuted hover:text-textMain'}`}
            title="Pie Chart"
          >
            <PieChartIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full flex-grow relative h-64">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={chartType}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full absolute inset-0"
            >
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#666666', fontSize: 12 }} 
                      tickLine={false} 
                      axisLine={false}
                      className="capitalize"
                      interval={0}
                      angle={data.length > 4 ? -45 : 0}
                      textAnchor={data.length > 4 ? "end" : "middle"}
                    />
                    <YAxis 
                      hide={true} 
                      domain={[0, 1]} 
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 4, 4]} 
                      animationDuration={1500}
                    >
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke={index === 0 ? '#333333' : 'transparent'} 
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend 
                      iconType="circle" 
                      formatter={(value) => <span className="text-textMain capitalize text-xs">{value}</span>}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
