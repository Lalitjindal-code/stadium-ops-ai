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
      className="transition-all duration-300 hover:shadow-lg border-[var(--bg-border)]"
    >
      <h3 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2.5">
        {icon && <span className="text-xl filter drop-shadow-xs">{icon}</span>}
        <span>{title}</span>
      </h3>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="border-l-3 border-[var(--bg-border)] pl-4 py-0.5">
            <div className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
              {renderItem(item, idx)}
            </div>
            {item.reasoning && (
              <div className="mt-2 text-xs text-[var(--text-tertiary)] italic leading-relaxed">
                <span className="font-semibold not-italic text-[var(--accent-300)]">AI Reasoning: </span>
                {item.reasoning}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
