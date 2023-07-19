import { useState, useEffect } from "react";

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import L from 'leaflet';
import { data } from "./data";

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureThreeQuarters, faDroplet, faWind } from "@fortawesome/free-solid-svg-icons";


const { BaseLayer } = LayersControl;

const App = () => {
  const position = [-33.505, -70];
  const riesgoFireData = data;
  const [displayProperty, setDisplayProperty] = useState("humedad");
  const [percentage, setPercentage] = useState(0);
  const [indicatorClass, setIndicatorClass] = useState("");

  useEffect(() => {
    setTimeout(() => {
      if (displayProperty < 100) {
        setPercentage(displayProperty + 1);
      }
    }, 50);
  }, [displayProperty]);

  const getIndicatorClass = (value) => {
    if (value <= 25) {
      return "good";
    } else if (value <= 50) {
      return "regular";
    } else if (value <= 75) {
      return "Preemergency";
    } else {
      return "Emergency";
    }
  };

  // CSS styles or inline styles
  const indicatorClassStyles = {
    good: {
      path: {
        stroke: "green"
      },
      trail: {
        stroke: "lightgreen"
      }
    },
    regular: {
      path: {
        stroke: "yellow"
      },
      trail: {
        stroke: "lightyellow"
      }
    },
    Preemergency: {
      path: {
        stroke: "orange"
      },
      trail: {
        stroke: "lightorange"
      }
    },
    Emergency: {
      path: {
        stroke: "red"
      },
      trail: {
        stroke: "lightred"
      }
    }
  };

  const indicatorClassStyles1 = {
    customClass: {
      path: {
        stroke: "url(#gradient)",
        strokeWidth: "8",
        strokeLinecap: "round",
        strokeDasharray: "180",
        strokeDashoffset: "90",
        PointerEvent: "true"
      },
      trail:{stroke:"transparent,"},
    },
  };

  const defaultIcon = (value) => {
    const size = 50;
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
  /*Handle Buttons */

  const handleButtonClick = (property) => {
    setDisplayProperty(property);
  };

  const handleMarkerClick = (feature) => {
    setSelectedMarker(feature);
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
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
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
              <div>
                <strong>{feature.properties.nombreEstacion}</strong>
                <br />
                {displayProperty && `${propertyDisplayNames[displayProperty]}: ${feature.properties[displayProperty]}`}
                <div style={{ textAlign: "center" }}>
                  <h4>Risk Level</h4>
                  <div style={{ width: 300, marginLeft: 0 }}>
                    <svg>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: "red" }} />
                          <stop offset="25%" style={{ stopColor: "orange" }} />
                          <stop offset="50%" style={{ stopColor: "yellow" }} />
                          <stop offset="75%" style={{ stopColor: "green" }} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <CircularProgressbar
                      value={feature.properties[displayProperty]}
                      text={`${getIndicatorClass(feature.properties[displayProperty])}`}
                      className={getIndicatorClass(feature.properties[displayProperty])}
                      styles={indicatorClassStyles1.customClass}
                    />
                  </div>
                </div>
              </div>

            </Popup>
          </Marker>
        ))
      }
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer >
  );
};

export default App;
