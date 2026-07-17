import React, { useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import GateMarker from "./GateMarker";
import VolunteerMarker from "./VolunteerMarker";
import IncidentMarker from "./IncidentMarker";
import { GateEntity, VolunteerEntity, IncidentEntity } from "@/types/map";

const containerStyle = { width: "100%", height: "100%" };
// Center near MetLife Stadium
const center = { lat: 40.8136, lng: -74.0745 };

interface Props {
  gates: GateEntity[];
  volunteers: VolunteerEntity[];
  incidents: IncidentEntity[];
  layers: { gates: boolean; volunteers: boolean; incidents: boolean };
}

export default function MapView({ gates, volunteers, incidents, layers }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16} options={{ disableDefaultUI: true, zoomControl: true }}>
      {layers.gates && gates.map(gate => (
        <GateMarker key={gate.id} gate={gate} selected={selectedId === gate.id} onClick={() => setSelectedId(gate.id)} onClose={() => setSelectedId(null)} />
      ))}
      
      {layers.volunteers && volunteers.map(vol => (
        <VolunteerMarker key={vol.id} volunteer={vol} selected={selectedId === vol.id} onClick={() => setSelectedId(vol.id)} onClose={() => setSelectedId(null)} />
      ))}
      
      {layers.incidents && incidents.map(inc => (
        <IncidentMarker key={inc.id} incident={inc} selected={selectedId === inc.id} onClick={() => setSelectedId(inc.id)} onClose={() => setSelectedId(null)} />
      ))}
    </GoogleMap>
  );
}
