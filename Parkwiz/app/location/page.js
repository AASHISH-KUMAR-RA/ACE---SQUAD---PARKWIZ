"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { FaMapMarkerAlt } from "react-icons/fa";

const Location = () => {
  const [totalAvailableSlots, setTotalAvailableSlots] = useState(0);
  const [totalOccupiedSlots, setTotalOccupiedSlots] = useState(0);
  const [availableSlotNumbers, setAvailableSlotNumbers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [markedLocations, setMarkedLocations] = useState([]);
  const [isNearby, setIsNearby] = useState(false);

  const targetLatitude = 13.126108; // Fixed position latitude
  const targetLongitude = 79.64398; // Fixed position longitude

  const containerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const fetchParkingStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
        const data = await response.json();
        let totalAvailable = 0;
        let totalOccupied = 0;
        let availableNumbers = [];

        // Create a new list of slots
        const updatedSlots = data.map((slot) => {
          if (slot.status === "free") {
            totalAvailable++;
            availableNumbers.push(slot.slot);
          } else {
            totalOccupied++;
          }
          return slot;
        });

        setTotalAvailableSlots(totalAvailable);
        setTotalOccupiedSlots(totalOccupied);
        setAvailableSlotNumbers(availableNumbers);
        setSlots(updatedSlots);
      } catch (error) {
        console.error("Error fetching parking slots:", error);
      }
    };

    // Initial fetch
    fetchParkingStatus();

    // Set interval to update every 5 seconds
    const intervalId = setInterval(fetchParkingStatus, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const createParkingSlot = (slotNumber, status) => (
    <div
      key={slotNumber}
      className={`parking-space ${status}`}
      id={`slot-${slotNumber}`}
    >
      Slot {slotNumber}
    </div>
  );

  const renderSlots = () => {
    const container1 = slots.filter((slot) => slot.slot <= 24);
    const container2 = slots.filter((slot) => slot.slot > 24 && slot.slot <= 46);
    const container3 = slots.filter((slot) => slot.slot > 46);

    return (
      <div className="container" id="container" ref={containerRef}>
        <div className="parking-container" id="parking-container-1">
          {container1.map((slot) => createParkingSlot(slot.slot, slot.status))}
        </div>
        <div className="parking-container" id="parking-container-2">
          {createParkingSlot("b1", "free")}
          {container2.map((slot) => createParkingSlot(slot.slot, slot.status))}
        </div>
        <div className="parking-container" id="parking-container-3">
          {createParkingSlot("b2", "free")}
          {container3.map((slot) => createParkingSlot(slot.slot, slot.status))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const overlay = overlayRef.current;

    const handleClick = (event) => {
      setMarkedLocations([]);
      const overlayRect = overlay.getBoundingClientRect();
      const iconLeft = event.clientX - overlayRect.left;
      const iconTop = event.clientY - overlayRect.top;
      setMarkedLocations([{ left: iconLeft, top: iconTop }]);
    };

    overlay && overlay.addEventListener("click", handleClick);

    return () => {
      overlay && overlay.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const updateLocation = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const distance = calculateDistance(
        latitude,
        longitude,
        targetLatitude,
        targetLongitude
      );

      const status = document.getElementById("status");
      if (status != null) {
        status.innerHTML = "Checking your location...";
        document.getElementById("distance").innerHTML =
          "Distance to target: " + distance.toFixed(2) + " km";

        if (distance <= 0.1) {
          setIsNearby(true);
          status.innerHTML = "You've reached the place!";
        } else {
          setIsNearby(false);
          status.innerHTML = "You're not there yet. Keep going!";
        }
      }
    };

    const locationError = (error) => {
      document.getElementById("status").innerHTML =
        "Error getting your location: " + error.message;
      setIsNearby(true);
    };

    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(updateLocation, locationError);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  return (
    <div className="flex justify-center align-middle flex-col m-[2vh]">
      <div id="center">
      <Card className="w-full max-w-xl shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <CardHeader className="flex items-center p-4 bg-indigo-500 text-white">
          <FaMapMarkerAlt size={40} className="mr-4" />
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">Location Checker</h2>
            <p className="text-sm">Check your proximity to the target location.</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="w-fit">
          <p id="status" className="text-lg font-semibold mb-4">
            Checking your location...
          </p>
          </CardBody>
          </Card>
          </div>
      <p id="distance"></p>
      <div
        id="rmap"
        style={{ position: "relative", width: "100%", height: "450px",marginTop:"2vw" }}
        onClick={(e) => {
          const rmapRect = e.currentTarget.getBoundingClientRect();
          const iconLeft = e.clientX - rmapRect.left;
          const iconTop = e.clientY - rmapRect.top;
          setMarkedLocations([{ left: iconLeft, top: iconTop }]);
        }}
      >
        {isNearby ? (
          <div id="container">{renderSlots()}</div>
        ) : (
          <div id="mapContainer">
            <iframe
              title="Google Maps"
              width="100%"
              height="450"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.574415712126!2d79.64139217392662!3d13.12612551147396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52bbd3c7d89af5%3A0xb762b84561392539!2sA.K.S.THIRUMURUGAN!5e0!3m2!1sen!2sin!4v1695562296351!5m2!1sen!2sin"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <div id="overlay" className="overlay" ref={overlayRef}>
          {markedLocations.map((location, index) => (
            <div
              key={index}
              className="location-icon"
              style={{
                left: `${location.left}px`,
                top: `${location.top}px`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Location;
