import React from "react";
import { Card } from "./ui";

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
}: RecommendationCardProps<T>) {
  if (!data || data.length === 0) return null;

  // Map titles to semantic border colors from design tokens
  const getAccentColor = () => {
    switch (title) {
      case "Congestion Alerts":
        return "var(--risk-critical)";
      case "Predicted Bottlenecks":
        return "var(--risk-medium)";
      case "Gate Recommendations":
        return "var(--risk-safe)";
      case "Volunteer Actions":
        return "var(--accent-500)";
      default:
        return "var(--primary-500)";
    }
  };

  return (
    <Card 
      variant="accent" 
      accentColor={getAccentColor()}
      className="transition-all duration-300 hover:shadow-md border-[var(--bg-border)] h-full flex flex-col p-4"
    >
      <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        <span>{title}</span>
      </h3>
      <div className="space-y-3 mt-1 flex-1">
        {data.map((item, idx) => (
          <div key={idx} className="border-l-2 border-[var(--bg-border)] pl-3 py-0.5">
            <div className="text-[var(--text-primary)] text-xs font-bold leading-tight mb-1">
              {renderItem(item, idx)}
            </div>
            {item.reasoning && (
              <div className="text-[10px] text-[var(--text-tertiary)] leading-tight line-clamp-2">
                <span className="font-bold text-[var(--primary-400)] mr-1">AI:</span>
                {item.reasoning}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
