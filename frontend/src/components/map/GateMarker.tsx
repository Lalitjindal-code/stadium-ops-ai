import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { GateEntity } from "@/types/map";

interface Props {
  gate: GateEntity;
  selected: boolean;
  onClick: () => void;
  onClose: () => void;
}

export default function GateMarker({ gate, selected, onClick, onClose }: Props) {
  const getIconColor = () => {
    switch (gate.riskLevel) {
      case "Safe": return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      case "Moderate": return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      case "Critical": return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      default: return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
  };

  return (
    <>
      <Marker
        position={{ lat: gate.latitude, lng: gate.longitude }}
        icon={getIconColor()}
        onClick={onClick}
      />
      {selected && (
        <InfoWindow
          position={{ lat: gate.latitude, lng: gate.longitude }}
          onCloseClick={onClose}
        >
          <div className="p-2 max-w-[200px] text-slate-800 bg-white">
            <h3 className="font-bold text-sm mb-1">{gate.name}</h3>
            <p className="text-xs mb-1">Capacity: {gate.currentCrowd} / {gate.capacity}</p>
            <p className="text-xs mb-1">Risk: <strong>{gate.riskLevel}</strong></p>
            <p className="text-xs text-indigo-700 italic border-t pt-1 mt-1">AI: {gate.aiRecommendation}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
