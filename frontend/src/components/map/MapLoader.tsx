import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries: any = ["geometry"];

export default function MapLoader({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 text-red-800 p-4 rounded-lg">
        <div>
          <h2 className="font-bold text-lg mb-2">Map Load Error</h2>
          <p>{loadError.message}</p>
          <p className="mt-2 text-sm opacity-80">Make sure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set in .env.local</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg animate-pulse">
        <div className="text-gray-500 font-medium">Loading Map Assets...</div>
      </div>
    );
  }

  return <>{children}</>;
}
