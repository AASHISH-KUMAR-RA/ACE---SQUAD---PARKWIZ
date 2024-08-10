"use client"
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';

// Icons
const petrolIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/color/48/000000/gas-station.png',
  iconSize: [25, 25]
});

const evIcon = new L.Icon({
  iconUrl: 'charging.png',
  iconSize: [25, 25]
});
const startIcon = new L.Icon({
    iconUrl: 'giphy.gif',
    iconSize: [50, 50]
  });
// Fetch POI data
const fetchPOIData = async (latitude, longitude) => {
  const radius = 10000; // 10 km radius
  const overpassQuery = `
    [out:json];
    (
      node["amenity"="fuel"](around:${radius},${latitude},${longitude});
      node["amenity"="charging_station"](around:${radius},${latitude},${longitude});
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
        end: `${end.lng},${end.lat}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching the route:', error.message);
    return null;
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
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCurrentPosition(newPos);
          
          if (prevPosition) {
            const now = Date.now();
            const elapsed = (now - lastUpdate) / 1000; // time in seconds

            if (elapsed >= 300) { // update every 5 minutes
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
        }
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
// Start Navigation Button Component
const StartNavigationButton = ({ currentPosition, mode, setMode }) => {
    const map = useMap();
  
    const handleClick = async () => {
      if (currentPosition) {
        // Check if user is near the road (mock implementation)
        const nearRoad = await isNearRoad(currentPosition);
        map.setView(currentPosition, 50)
  
        if (!nearRoad) {
          // Provide walking directions to the nearest road
          const walkRouteData = await fetchRoute(currentPosition, { lat: 0, lng: 0 }, 'foot-walking'); // Mock destination
          if (walkRouteData) {
            const coordinates = walkRouteData.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            map.fitBounds(L.latLngBounds(coordinates));
          }
          setMode('driving-car'); // Set mode to driving after walking
        } else {
          // Provide driving directions to the destination
          setMode('driving-car');
          const driveRouteData = await fetchRoute(currentPosition, { lat: 0, lng: 0 }, 'driving-car'); // Replace with actual destination
          if (driveRouteData) {
            const coordinates = driveRouteData.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            map.fitBounds(L.latLngBounds(coordinates));
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
        zIndex: 1000
      }}
      shadow
    >
      Start Navigation
    </Button>
    );
  };
  

// Check if the user is near the road (mock function for simplicity)
const isNearRoad = async (location) => {
  // Mock implementation: Replace with actual API call or road proximity check
  return true; // Assume user is near the road for now
};

// Main Map Component
const Station = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPOIData(location.lat, location.lng);
      setStations(data);
    };
    fetchData();
  }, [location]);

  const handleStationClick = async (station) => {
    setSelectedStation(station);
    setRoute([]);
    const routeData = await fetchRoute(location, { lat: station.lat, lng: station.lon }, mode);
    if (routeData) {
      const coordinates = routeData.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setRoute(coordinates);

      const distance = getDistance(location, { lat: station.lat, lng: station.lon });
      setDistance(distance);

      const { speed, time } = getTravelTimeAndSpeed(distance, routeData.features[0].properties.segments[0].duration);
      setSpeed(speed);
      setTime(time);

      const instructions = routeData.features[0].properties.segments[0].steps.map(step => step.instruction);
      setInstructions(instructions);
    }
  };

  return (
    <Card className='flex justify-center align-middle m-[5vw]'>
    <div style={{ position: 'relative' }}>
      <MapContainer center={location} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker location={location} setLocation={setLocation} setCurrentPosition={setCurrentPosition} />
        {stations.map((station, idx) => (
          <Marker
            key={idx}
            position={[station.lat, station.lon]}
            icon={station.tags.amenity === 'fuel' ? petrolIcon : evIcon}
            eventHandlers={{
              click: () => handleStationClick(station)
            }}
          >
            <Popup>
              {station.tags.amenity === 'fuel' ? 'Petrol Station' : 'EV Charging Station'}: {station.tags.name || 'Unnamed'}
            </Popup>
          </Marker>
        ))}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
        <StartNavigationButton currentPosition={currentPosition} mode={mode} setMode={setMode} />
      </MapContainer>
      <NavigationInstructions instructions={instructions} />
      <div className="route-information">
        <h3>Route Information</h3>
        {distance && <p>Distance: {distance} km</p>}
        {speed && <p>Speed: {speed} km/h</p>}
        {time && <p>Time: {time} min</p>}
      </div>
     

    </div>
    </Card>
  );
};

export default Station;
