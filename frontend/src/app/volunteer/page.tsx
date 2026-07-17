"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";
import { VolunteerHeader } from "@/components/layout";

export default function VolunteerDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    Cookies.remove("role");
    Cookies.remove("authToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <VolunteerHeader onLogout={handleLogout} />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>📋</span> Active Assignments
          </h2>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">On Duty</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl shadow-2xs hover:shadow-md border border-slate-200/60 p-6 flex flex-col transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-red-50 text-red-700 border border-red-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">High Priority</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">ETA: 5 min</span>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Crowd Control Assistance</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">Assist with diverting crowd flow away from North entrance to mitigate crowding.</p>
            <div className="mt-auto pt-4 border-t border-slate-100/60 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                <p className="text-indigo-600 font-bold text-sm mt-0.5">Gate A (North)</p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer">Acknowledge</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xs hover:shadow-md border border-slate-200/60 p-6 flex flex-col transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Medium Priority</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">ETA: 15 min</span>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Information Desk</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">Guide VIPs and hospitality guests to their designated parking zones.</p>
            <div className="mt-auto pt-4 border-t border-slate-100/60 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                <p className="text-indigo-600 font-bold text-sm mt-0.5">VIP Zone B</p>
              </div>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer">Start Task</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xs hover:shadow-md border border-slate-200/60 p-6 flex flex-col transition-all duration-200 text-slate-400 bg-slate-50/20">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-slate-100 text-slate-500 border border-slate-200/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Low Priority</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">ETA: 30 min</span>
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-2">Standby Support</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">Remain on standby at the primary hub for incoming deployment orders.</p>
            <div className="mt-auto pt-4 border-t border-slate-100/60 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                <p className="text-slate-600 font-bold text-sm mt-0.5">Volunteer Hub 1</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2.5 py-1.5 rounded-xl">Standby</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
