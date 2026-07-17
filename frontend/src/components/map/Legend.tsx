import React from "react";
import Image from "next/image";

export default function Legend() {
  return (
    <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg border text-sm z-10 w-48">
      <h3 className="font-bold mb-2 border-b pb-1">Map Legend</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Safe Gate</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Moderate Gate</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Critical Gate</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Volunteer</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500"></div> Medical</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Security</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Traffic</div>
        <div className="flex items-center gap-2">
          <Image src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-error.png" alt="incident" width={12} height={16} className="w-3 h-4" /> 
          Incident
        </div>
      </div>
    </div>
  );
}
