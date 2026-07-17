"use client";

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-500"
        >
          Log out
        </button>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <p>Welcome to the Volunteer view! This page is protected by middleware.</p>
      </div>
    </div>
  );
}
