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
    <div className={`p-4 rounded-xl shadow border border-gray-100 ${bgColor}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="border-l-4 border-blue-500 pl-3">
            {renderItem(item, idx)}
            {item.reasoning && (
              <details className="mt-2 text-sm text-gray-600">
                <summary className="cursor-pointer font-medium hover:text-blue-600">
                  AI Reasoning
                </summary>
                <p className="mt-1 ml-2 italic">{item.reasoning}</p>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
