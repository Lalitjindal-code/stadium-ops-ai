import React from "react";

interface ActivityEvent {
  id: string;
  time: string;
  message: string;
  type: "info" | "warning" | "success" | "critical";
}

interface Props {
  events: ActivityEvent[];
}

export default function AIActivityFeed({ events }: Props) {
  const getEventColor = (type: string) => {
    switch(type) {
      case "critical": return "border-l-red-500 text-red-800 bg-red-50";
      case "warning": return "border-l-orange-500 text-orange-800 bg-orange-50";
      case "success": return "border-l-green-500 text-green-800 bg-green-50";
      default: return "border-l-blue-500 text-blue-800 bg-blue-50";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 mt-6 h-72 flex flex-col">
      <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
        <span>⚡</span> AI Activity Feed
      </h2>
      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
        {events.map(event => (
          <div key={event.id} className={`p-3 border-l-3 rounded-xl shadow-xs text-xs leading-relaxed flex items-start gap-2.5 ${getEventColor(event.type)}`}>
            <span className="font-bold text-[10px] opacity-75 mt-0.5 whitespace-nowrap">{event.time}</span>
            <span className="font-medium">{event.message}</span>
          </div>
        ))}
        {events.length === 0 && <p className="text-slate-400 text-xs text-center py-8">No recent activity.</p>}
      </div>
    </div>
  );
}
