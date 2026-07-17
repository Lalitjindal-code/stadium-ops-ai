"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        if (role) {
          // Set cookies for middleware
          Cookies.set("role", role, { expires: 7 }); // 7 days
          Cookies.set("authToken", await user.getIdToken(), { expires: 7 });

          // Redirect based on role
          if (role === "organizer") {
            router.push("/organizer");
          } else if (role === "volunteer") {
            router.push("/volunteer");
          } else {
            setError("Unknown role assigned to user.");
          }
        } else {
          setError("User role not found.");
        }
      } else {
        setError("User profile not found in database.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const autofill = (role: "organizer" | "volunteer") => {
    setEmail(`${role}@demo.com`);
    setPassword("password123");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="text-5xl mb-4">🏟️</div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            FIFA World Cup 2026
          </h2>
          <p className="mt-2 text-sm text-indigo-300 uppercase tracking-widest font-semibold">
            AI Stadium Operations Dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Email Address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-xl border border-white/20 bg-white/5 py-3 px-4 text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none sm:text-sm transition-all duration-200"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-xl border border-white/20 bg-white/5 py-3 px-4 text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none sm:text-sm transition-all duration-200"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-950/40 p-3 rounded-xl border border-red-500/20 animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 disabled:opacity-50 disabled:hover:-translate-y-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Securing Session...</span>
                </div>
              ) : "Sign in to Control Center"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-center text-slate-400 mb-4 font-medium uppercase tracking-wider">Quick Access Demo Roles</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => autofill("organizer")}
              type="button"
              className="flex flex-col items-center p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 text-xs text-slate-300 hover:scale-[1.03] transform cursor-pointer"
            >
              <span className="font-bold text-white mb-1 flex items-center gap-1.5 text-sm">🔑 Organizer</span>
              <span className="opacity-60">organizer@demo.com</span>
            </button>
            <button
              onClick={() => autofill("volunteer")}
              type="button"
              className="flex flex-col items-center p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200 text-xs text-slate-300 hover:scale-[1.03] transform cursor-pointer"
            >
              <span className="font-bold text-white mb-1 flex items-center gap-1.5 text-sm">🙋 Volunteer</span>
              <span className="opacity-60">volunteer@demo.com</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
