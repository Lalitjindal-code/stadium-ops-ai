import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { IncidentEntity } from "@/types/map";

interface Props {
  incident: IncidentEntity;
  selected: boolean;
  onClick: () => void;
  onClose: () => void;
}

export default function IncidentMarker({ incident, selected, onClick, onClose }: Props) {
  // Caution symbol icon
  const icon = {
    url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-error.png"
  };

  return (
    <>
      <Marker
        position={{ lat: incident.latitude, lng: incident.longitude }}
        icon={icon}
        onClick={onClick}
      />
      {selected && (
        <InfoWindow
          position={{ lat: incident.latitude, lng: incident.longitude }}
          onCloseClick={onClose}
        >
          <div className="p-2 max-w-[200px] text-gray-800">
            <h3 className="font-bold text-sm mb-1 text-red-600">{incident.incidentType}</h3>
            <p className="text-xs mb-1">Severity: <strong>{incident.severity}</strong></p>
            <p className="text-xs">{incident.description}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
