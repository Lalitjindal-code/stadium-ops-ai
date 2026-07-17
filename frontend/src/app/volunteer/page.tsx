"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";

export default function VolunteerDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    Cookies.remove("role");
    Cookies.remove("authToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Portal — FIFA World Cup 2026</h1>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Log out
        </button>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Today&apos;s Assignments</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">High Priority</span>
              <span className="text-sm text-gray-500 font-medium">ETA: 5 min</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Crowd Control Assistance</h3>
            <p className="text-gray-600 text-sm mb-4">Assist with diverting crowd flow away from North entrance.</p>
            <div className="mt-auto">
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-indigo-600 font-semibold">Gate A (North)</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Medium Priority</span>
              <span className="text-sm text-gray-500 font-medium">ETA: 15 min</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Information Desk</h3>
            <p className="text-gray-600 text-sm mb-4">Guide VIPs to their designated parking zones.</p>
            <div className="mt-auto">
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-indigo-600 font-semibold">VIP Zone B</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Low Priority</span>
              <span className="text-sm text-gray-500 font-medium">ETA: 30 min</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Standby</h3>
            <p className="text-gray-600 text-sm mb-4">Remain on standby for incoming deployment orders.</p>
            <div className="mt-auto">
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-indigo-600 font-semibold">Volunteer Hub 1</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
