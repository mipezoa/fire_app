import { useState } from "react";

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import L from 'leaflet';
import { data } from "./data";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureThreeQuarters, faDroplet, faWind } from "@fortawesome/free-solid-svg-icons";


const { BaseLayer, Overlay } = LayersControl;
const App = () => {
  const position = [-33.505, -70];
  const riesgoFireData = data;
  const [displayProperty, setDisplayProperty] = useState("");

  const customizeIcon = (feature, displayProperty) => {
    const size = 30;
    // Define the fire risk thresholds
    const color = displayProperty === "temperatura" && feature.properties.temperatura > 25 ? "red"
      : temperatura > 25 || humedad < 30 || intensidadDelViento > 30 ? "yellow"
        : temperatura > 25 && humedad < 30 || intensidadDelViento > 30 ? "orange"
          : "green";
    const style = `background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 80%; display: flex; justify-content: center; align-items: center; color: white ; font-weight: bold;`;

    return L.divIcon({
      className: 'custom-icon',
      iconSize: [size, size],
      html: `<div style="${style}">${value}</div>`,
    });
  };
  const defaultIcon = (value) => {
    const size = 30;
    // Define the fire risk thresholds
    const colorD = value === "humedad"
      ? "blue"
      : value === "temperatura" ? "red"
        : value === "windspeed" ? "green"
          : "#7CB9E8";

    const style1 = `background-color: ${colorD}; width: ${size}px; height: ${size}px; border-radius: 80%; display: flex; justify-content: center; align-items: center; color: white ; font-weight: bold; border: 4px solid white`;

    return L.divIcon({
      className: 'custom-icon',
      iconSize: [size, size],
      html: `<div style="${style1}">${value}</div>`,
    });
  };

  const propertyDisplayNames = {
    humedad: "humedad",
    temperatura: "temperatura",
    windspeed: "intensidadDelViento"
  };
  const handleButtonClick = (property) => {
    setDisplayProperty(property);
  };

  return (
    <MapContainer
      center={position}
      zoom={8}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100vw" }}
    >
      <LayersControl>
        <BaseLayer checked name="image satellite">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>
      </LayersControl>
      <div style={{ position: "absolute", zIndex: 999, top: "90%", left: "86%" }}>
        <button
          onClick={() => handleButtonClick("humedad")}
          style={{ backgroundColor: (255, 255, 255, 0.9), color: "#00308F", borderRadius: "7px", borderWidth: "1px", borderColor: "lightblue", padding: "8px 12px", marginRight: "20px" }}
        ><FontAwesomeIcon icon={faDroplet} size="2xl" /></button>
        <button
          onClick={() => handleButtonClick("temperatura")}
          style={{ backgroundColor: (255, 255, 255, 0.9), color: "#00308F", borderRadius: "7px", borderWidth: "1px", borderColor: "lightblue", padding: "8px 14px", marginRight: "20px" }}
        ><FontAwesomeIcon icon={faTemperatureThreeQuarters} size="2xl" /></button>
        <button
          onClick={() => handleButtonClick("intensidadDelViento")}
          style={{ backgroundColor: (255, 255, 255, 0.9), color: "#00308F", borderRadius: "7px", borderWidth: "1px", borderColor: "lightblue", padding: "7.5px 10px", marginRight: "20px" }}
        ><FontAwesomeIcon icon={faWind} size="2xl" /></button>
      </div>
      {riesgoFireData &&
        riesgoFireData.features.map((feature) => (
          <Marker
            key={feature.properties.codigoNacional}
            position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
            icon={defaultIcon(feature.properties[displayProperty])}
          >
            <Popup>
              <strong>{feature.properties.nombreEstacion}</strong>
              <br />
              {displayProperty && `${propertyDisplayNames[displayProperty]}: ${feature.properties[displayProperty]}`}
            </Popup>
          </Marker>
        ))}
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default App;
