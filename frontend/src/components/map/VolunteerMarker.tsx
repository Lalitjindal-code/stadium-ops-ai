import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { VolunteerEntity } from "@/types/map";

interface Props {
  volunteer: VolunteerEntity;
  selected: boolean;
  onClick: () => void;
  onClose: () => void;
}

export default function VolunteerMarker({ volunteer, selected, onClick, onClose }: Props) {
  const getIconColor = () => {
    switch (volunteer.type) {
      case "Medical": return "http://maps.google.com/mapfiles/ms/icons/pink-dot.png";
      case "Security": return "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
      case "Traffic": return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
      default: return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
  };

  return (
    <>
      <Marker
        position={{ lat: volunteer.latitude, lng: volunteer.longitude }}
        icon={getIconColor()}
        onClick={onClick}
      />
      {selected && (
        <InfoWindow
          position={{ lat: volunteer.latitude, lng: volunteer.longitude }}
          onCloseClick={onClose}
        >
          <div className="p-2 max-w-[150px] text-slate-800 bg-white">
            <h3 className="font-bold text-sm mb-1">{volunteer.name}</h3>
            <p className="text-xs mb-1">Role: {volunteer.type}</p>
            <p className="text-xs">Status: {volunteer.status}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
