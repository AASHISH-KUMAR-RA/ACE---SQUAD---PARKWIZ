"use client";
import { Fragment, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { FaRegDotCircle, FaDotCircle, FaInfoCircle, FaMapPin } from 'react-icons/fa';

export default function Pslive() {
    const [totalAvailableSlots, setTotalAvailableSlots] = useState(0);
    const [totalOccupiedSlots, setTotalOccupiedSlots] = useState(0);
    const [availableSlotNumbers, setAvailableSlotNumbers] = useState([]);
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        const fetchParkingStatus = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`); // Adjust URL as per your Flask server
                const data = await response.json();
                let totalAvailable = 0;
                let totalOccupied = 0;
                let availableNumbers = [];

                // Create a new list of slots
                const updatedSlots = data.map(slot => {
                    if (slot.status === 'free') {
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
                console.error('Error fetching parking status:', error);
            }
        };

        // Initial fetch
        fetchParkingStatus();

        // Set interval to update every 5 seconds (adjust as needed)
        const intervalId = setInterval(fetchParkingStatus, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const createParkingSlot = (slotNumber, status) => {
        return (
            <div
                key={slotNumber}
                className={`parking-space ${status}`}
                id={`slot-${slotNumber}`}
            >
                S-{slotNumber}
            </div>
        );
    };

    const renderSlots = () => {
        const container1 = slots.filter(slot => slot.slot <= 24);
        const container2 = slots.filter(slot => slot.slot > 24 && slot.slot <= 46);
        const container3 = slots.filter(slot => slot.slot > 46);

        return (
            <div className="container" id="container">
                <div className="parking-container" id="parking-container-1">
                    {container1.map(slot => createParkingSlot(slot.slot, slot.status))}
                </div>
                <div className="parking-container" id="parking-container-2">
                    {createParkingSlot('b1', 'free')}
                    {container2.map(slot => createParkingSlot(slot.slot, slot.status))}
                </div>
                <div className="parking-container" id="parking-container-3">
                    {createParkingSlot('b2', 'free')}
                    {container3.map(slot => createParkingSlot(slot.slot, slot.status))}
                </div>
            </div>
        );
    };

    return (
        <Fragment>
            <h1 className="text-2xl font-bold text-center mb-4">Parking Status Live</h1>
            <Card className="max-w-4xl mx-auto mt-4">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Parking Information</h2>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center">
                            <FaDotCircle className="text-green-500 mr-2" />
                            <p className="text-lg">Total Available Slots: {totalAvailableSlots}</p>
                        </div>
                        <div className="flex items-center">
                            <FaRegDotCircle className="text-red-500 mr-2" />
                            <p className="text-lg">Total Occupied Slots: {totalOccupiedSlots}</p>
                        </div>
                        <div className="flex items-center">
                            <FaMapPin className="text-blue-500 mr-2" />
                            <p className="text-lg">Available Slots: {availableSlotNumbers.join(', ')}</p>
                        </div>
                        <div className="flex items-center">
                            <FaInfoCircle className="text-gray-500 mr-2" />
                            <p className="text-lg">Click on a slot to select or deselect.</p>
                        </div>
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className="text-center">
                    {renderSlots()}
                </CardFooter>
            </Card>
        </Fragment>
    );
}
