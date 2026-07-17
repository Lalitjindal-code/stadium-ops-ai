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
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 mt-6 h-64 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 sticky top-0 bg-white">AI Activity Feed</h2>
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className={`p-3 border-l-4 rounded shadow-sm text-sm ${getEventColor(event.type)}`}>
            <span className="font-bold mr-2 text-xs opacity-70">{event.time}</span>
            {event.message}
          </div>
        ))}
        {events.length === 0 && <p className="text-gray-500 text-sm">No recent activity.</p>}
      </div>
    </div>
  );
}
