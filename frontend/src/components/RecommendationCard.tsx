import React from "react";

interface RecommendationCardProps<T> {
  title: string;
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  icon?: string;
  bgColor?: string;
}

export default function RecommendationCard<T extends { reasoning?: string }>({
  title,
  data,
  renderItem,
  icon,
  bgColor = "bg-white",
}: RecommendationCardProps<T>) {
  if (!data || data.length === 0) return null;

  return (
    <div className={`p-6 rounded-2xl shadow-xs border border-slate-200/80 transition-all duration-300 hover:shadow-md hover:border-slate-300 ${bgColor}`}>
      <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2.5">
        {icon && <span className="text-xl filter drop-shadow-xs">{icon}</span>}
        <span>{title}</span>
      </h3>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="border-l-3 border-indigo-500/80 pl-4 py-0.5">
            <div className="text-slate-700 text-sm font-medium leading-relaxed">
              {renderItem(item, idx)}
            </div>
            {item.reasoning && (
              <details className="mt-2 text-xs text-slate-500 group">
                <summary className="cursor-pointer font-semibold hover:text-indigo-600 transition-colors list-none flex items-center gap-1 focus:outline-none select-none">
                  <span className="text-[9px] transition-transform duration-200 group-open:rotate-90">▶</span>
                  <span>AI Reasoning</span>
                </summary>
                <p className="mt-1.5 ml-3 pl-2.5 border-l border-slate-200 text-slate-500 italic bg-slate-50/50 p-2 rounded-lg leading-relaxed">
                  {item.reasoning}
                </p>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
