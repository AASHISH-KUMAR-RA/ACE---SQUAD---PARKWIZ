"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { Button, Card, CardFooter } from '@nextui-org/react';

// Custom marker icon for PARKWIZ
const parkingIcon = new L.Icon({
  iconUrl: 'logo.png', // Path to the uploaded PNG file
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Icons
const petrolIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/color/48/000000/gas-station.png',
  iconSize: [25, 25],
});
const startIcon = new L.Icon({
  iconUrl: 'giphy.gif',
  iconSize: [50, 50],
});

const evIcon = new L.Icon({
  iconUrl: 'charging.png',
  iconSize: [25, 25],
});

// Fetch POI data
const fetchPOIData = async (latitude, longitude) => {
  const radius = 10000; // 10 km radius
  const overpassQuery = `
    [out:json];
    (
      node["key"="parkwiz"];
    );
    out body;
  `;

  try {
    const response = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
    return response.data.elements;
  } catch (error) {
    console.error('Error fetching data from Overpass API:', error.message);
    return [];
  }
};

// Fetch Route
const fetchRoute = async (start, end, mode) => {
  try {
    const response = await axios.get(`https://api.openrouteservice.org/v2/directions/${mode}`, {
      params: {
        api_key: '5b3ce3597851110001cf62480032daca27fd44e1a63bba82c47a94a6',
        start: `${start.lng},${start.lat}`,
        end: `${end.lng},${end.lat}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching the route:', error.message);
    return null;
  }
};

// Fetch Petrol Price (Using a mock API)
const fetchPetrolPrice = async (stationId) => {
  try {
    // Replace this URL with the actual API endpoint
    const response = await axios.get(`https://api.mockpetrolprice.com/price/${stationId}`);
    return response.data.price; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching petrol price:', error.message);
    return null; // Return a fallback value
  }
};

// Calculate Distance
const getDistance = (start, end) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (end.lat - start.lat) * (Math.PI / 180);
  const dLng = (end.lng - start.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start.lat * (Math.PI / 180)) *
      Math.cos(end.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance.toFixed(2); // Return distance with 2 decimal places
};

// Calculate Speed and Time
const getTravelTimeAndSpeed = (distance, duration) => {
  const speed = (distance / (duration / 3600)).toFixed(2); // Speed in km/h
  const time = (duration / 60).toFixed(2); // Time in minutes
  return { speed, time };
};

// Location Marker Component
const LocationMarker = ({ location, setLocation, setCurrentPosition }) => {
  const map = useMap();
  const [prevPosition, setPrevPosition] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCurrentPosition(newPos);

          if (prevPosition) {
            const now = Date.now();
            const elapsed = (now - lastUpdate) / 1000; // time in seconds

            if (elapsed >= 300) {
              // update every 5 minutes
              const distance = getDistance(prevPosition, newPos);
              const duration = elapsed; // Duration in seconds

              if (distance > 0) {
                const { speed: currentSpeed } = getTravelTimeAndSpeed(distance, duration);
                setSpeed(currentSpeed);
              } else {
                setSpeed(0); // No movement, set speed to 0
              }

              setPrevPosition(newPos);
              setLastUpdate(now);
            }
          } else {
            setPrevPosition(newPos);
          }

          map.setView(newPos, 13);
          setLocation(newPos);
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [setLocation, setCurrentPosition, map, prevPosition, lastUpdate]);

  return location === null ? null : (
    <Marker
      position={location}
      draggable={true}
      icon={startIcon}
      eventHandlers={{
        dragend: (e) => {
          setLocation(e.target.getLatLng());
        },
      }}
    >
      <Popup>You are here</Popup>
    </Marker>
  );
};

// Navigation Instructions Component
const NavigationInstructions = ({ instructions }) => (
  <div className="navigation-instructions">
    <h3>Navigation Instructions</h3>
    <ul>
      {instructions.map((instruction, idx) => (
        <li key={idx}>{instruction}</li>
      ))}
    </ul>
  </div>
);

// Start Navigation Button Component
const StartNavigationButton = ({ currentPosition, destination, setRoute, setInstructions, mode }) => {
  const map = useMap();

  const handleClick = async () => {
    if (currentPosition) {
      const routeData = await fetchRoute(currentPosition, destination, mode);
      if (routeData) {
        const coordinates = routeData.features[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        setRoute(coordinates);

        const instructions = routeData.features[0].properties.segments[0].steps.map(
          (step) => step.instruction
        );
        setInstructions(instructions);

        // Check if coordinates are valid and have at least two points
        if (coordinates.length > 0 && coordinates[0].length === 2) {
          map.fitBounds(L.latLngBounds(coordinates));
        } else {
          console.error('Invalid coordinates:', coordinates);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      auto
      color="primary"
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '40vw',
        zIndex: 1000,
      }}
      shadow
    >
      Start Navigation
    </Button>
  );
};

// Main Map Component
const Map = () => {
  const [location, setLocation] = useState({ lat: 20.5937, lng: 78.9629 }); // Default location: center of India
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [route, setRoute] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [time, setTime] = useState(null);
  const [petrolPrice, setPetrolPrice] = useState(null);
  const [mode, setMode] = useState('driving-car'); // Default to driving mode

  const destination = { lat: 13.015, lng: 80.005 }; // Replace with actual coordinates of PARKWIZ

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPOIData(location.lat, location.lng);
      setStations(data);
    };
    fetchData();
  }, [location]);

  return (
    <Card className="flex justify-center align-middle m-[5vw]">
      <div style={{ position: 'relative' }}>
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker
            location={location}
            setLocation={setLocation}
            setCurrentPosition={setCurrentPosition}
          />
          <Marker position={[destination.lat, destination.lng]} icon={parkingIcon}>
            <Popup>PARKWIZ</Popup>
          </Marker>
          {stations.map((station, idx) => (
            <Marker
              key={idx}
              position={[station.lat, station.lon]}
              icon={station.tags.amenity === 'fuel' ? petrolIcon : evIcon}
            >
              <Popup>
                {station.tags.amenity === 'fuel' ? 'Petrol Map' : 'EV Charging Map'}:{' '}
                {station.tags.name || 'Unnamed'}
              </Popup>
            </Marker>
          ))}
          {route.length > 0 && <Polyline positions={route} color="blue" />}
          <CardFooter>
            <StartNavigationButton
              currentPosition={currentPosition}
              destination={destination}
              setRoute={setRoute}
              setInstructions={setInstructions}
              mode={mode}
              setMode={setMode}
            />
            <NavigationInstructions instructions={instructions} />
          </CardFooter>
        </MapContainer>
      </div>
    </Card>
  );
};

export default Map;
