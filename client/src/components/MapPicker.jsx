import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  return null;
}

function MapController({ location }) {
  const map = useMap();

  if (location) {
    map.setView(
      [location.latitude, location.longitude],
      16
    );
  }

  return null;
}

function MapPicker({ onLocationSelect }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        handleLocationSelect(location);
        setLoading(false);
      },
      (error) => {
        console.error(error);

        alert(
          "Unable to access your current location. Please allow location permission."
        );

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div>
      {/* Current Location Button */}
      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={loading}
        style={{
          marginBottom: "12px",
          padding: "10px 16px",
          border: "1px solid #2563eb",
          borderRadius: "8px",
          background: "white",
          color: "#2563eb",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        {loading
          ? "Getting Location..."
          : "Use My Current Location"}
      </button>

      {/* Map */}
      <MapContainer
        center={[21.1458, 79.0882]}
        zoom={12}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "10px",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onLocationSelect={handleLocationSelect}
        />

        <MapController location={selectedLocation} />

        {selectedLocation && (
          <Marker
            position={[
              selectedLocation.latitude,
              selectedLocation.longitude,
            ]}
          />
        )}
      </MapContainer>

      {/* Selected Coordinates */}
      {selectedLocation && (
        <p
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          Location selected on map
        </p>
      )}
    </div>
  );
}

export default MapPicker;