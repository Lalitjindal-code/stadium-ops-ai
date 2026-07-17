import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OrganizerNav() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", path: "/organizer", icon: "📊" },
    { name: "Operations Map", path: "/organizer/map", icon: "🗺️" },
    { name: "Scenario Simulator", path: "/organizer/scenario", icon: "⚡" },
    { name: "Resource Optimizer", path: "/organizer/assignments", icon: "👥" }
  ];

  return (
    <div className="w-[220px] bg-slate-900 text-white flex flex-col h-screen fixed top-0 left-0 z-50 shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
          <span>🏟️</span> Stadium Ops
        </h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">FIFA 2026 Edition</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-indigo-600 shadow-md text-white" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
            OG
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">Organizer</p>
            <p className="text-xs text-green-400">● Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
