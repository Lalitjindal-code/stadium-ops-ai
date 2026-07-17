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
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border border-white/30 bg-white/10 py-2.5 px-3 text-white placeholder-white/50 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border border-white/30 border-t-0 bg-white/10 py-2.5 px-3 text-white placeholder-white/50 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded border border-red-500/30">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Signing in..." : "Sign in to Control Center"}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-center text-slate-400 mb-3">Click to auto-fill demo credentials</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => autofill("organizer")}
              type="button"
              className="flex flex-col items-center p-2 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs text-slate-300"
            >
              <span className="font-semibold text-white mb-1">Organizer</span>
              <span>organizer@demo.com</span>
            </button>
            <button
              onClick={() => autofill("volunteer")}
              type="button"
              className="flex flex-col items-center p-2 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs text-slate-300"
            >
              <span className="font-semibold text-white mb-1">Volunteer</span>
              <span>volunteer@demo.com</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
