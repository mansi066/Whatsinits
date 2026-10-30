import React from 'react';

interface NutrientComparisonChartProps {
  title: string;
  unit: string;
  items: {
    name: string;
    value: number;
    color: string;
    isPrimaryScanned?: boolean;
  }[];
  isLowerBetter?: boolean;
}

export const NutrientComparisonChart: React.FC<NutrientComparisonChartProps> = ({
  title,
  unit,
  items,
  isLowerBetter = true,
}) => {
  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="bg-[#FAFAF6] rounded-xl p-4 border border-[#242A26]/8">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-[#242A26] uppercase tracking-wider">{title}</h4>
        <span className="text-[10px] text-[#707770]">Unit: {unit}</span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const percentage = Math.min(100, Math.max(8, (item.value / maxValue) * 100));

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-medium truncate max-w-[140px] sm:max-w-[200px] ${
                    item.isPrimaryScanned ? 'font-bold text-[#242A26]' : 'text-[#707770]'
                  }`}
                >
                  {item.name} {item.isPrimaryScanned && '(Scanned)'}
                </span>
                <span className="font-mono font-bold text-[#242A26]">
                  {item.value} {unit}
                </span>
              </div>

              {/* Bar */}
              <div className="h-3 w-full bg-slate-200/70 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${percentage}%`, backgroundColor: item.color }}
                  className="h-full rounded-full transition-all duration-500 ease-out"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
