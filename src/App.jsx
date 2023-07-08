import React from "react";
import { useEffect } from "react";

import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from "react-leaflet";
import { featureLayer } from 'esri-leaflet';
import L from 'leaflet';

const { BaseLayer, Overlay } = LayersControl;
const App = () => {
  const position = [-33.505, -70];

  return (
    <MapContainer
      center={position}
      zoom={8}
      scrollWheelZoom={true}
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <LayersControl>
        <BaseLayer checked name="image satellite">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>
        <Overlay checked name="fire">
       
        </Overlay>

      </LayersControl>

      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default App;
