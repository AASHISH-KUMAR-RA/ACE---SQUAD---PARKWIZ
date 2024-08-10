"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useUser } from "../context/userContext";
import useRazorpay from "react-razorpay";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { FaMoneyCheck, FaShoppingCart, FaCheckCircle } from "react-icons/fa";

const Payment = () => {
  const [orders, setOrders] = useState([]);
  const [myorders, setMyorders] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const { userProfile, loading } = useUser();
  const router = useRouter();

  const [Razorpay, isLoaded] = useRazorpay();

  const itemsPrice = 10; // Price per item/slot

  // Fetch orders and user orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/order");
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get("/api/order/myorders");
        setMyorders(data.orders);
      } catch (error) {
        console.error("Error fetching my orders:", error);
      }
    };

    fetchOrders();
    fetchMyOrders();
  }, []);

  // Handle payment using Razorpay
  const handlePayment = useCallback(async () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one parking slot before booking.");
      return;
    }

    // Calculate the total amount
    const totalAmount = selectedSlots.length * itemsPrice * 100; // Amount in paise

    const options = {
      key: "rzp_test_Y20ryZhwfyvGbq",
      amount: totalAmount.toString(),
      currency: "INR",
      name: "PARKWIZ",
      description: "Parking Slot Booking",
      image:
        "https://utfs.io/f/a9b8f892-fc28-48d6-be0a-3a22f2dc0d06-d48s3m.png",
      handler: async (response) => {
        console.log(response);
        const userDetails = {
          user: userProfile._id,
          name: userProfile.name,
          slotNos: selectedSlots,
          quantity: selectedSlots.length,
          id: response.razorpay_payment_id,
          status: "success",
          itemsPrice,
          totalPrice: totalAmount / 100,
        };
        console.log("User Details:", userDetails);

        // Save order details and navigate on success
        await createOrder(userDetails);
        setSelectedSlots([]);
        router.push("/order/success");
        // toast("Payment Success!", {
        //   type: "success",
        //   position: toast.POSITION.BOTTOM_CENTER,
        // });
      },
      prefill: {
        name: userProfile.name,
        email: userProfile.email,
        contact: userProfile.phoneNo||"9600338406", // This should be dynamic based on user data
      },
      notes: {
        slots: selectedSlots.map((slot) => `Slot ${slot}`).join(", "),
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
  }, [Razorpay, selectedSlots, userProfile, itemsPrice, router]);

  const createOrder = async (userDetails) => {
    try {
      const { data } = await axios.post("/api/order/new", userDetails);
      console.log("Order created:", data.order);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const allSlotNos = [];
  const mySlotNos = [];

  orders.forEach((order) => {
    const slotNos = order.slotNos || []; // Ensure slotNos is an array
    allSlotNos.push(...slotNos);
  });

  myorders.forEach((order) => {
    const slotNos = order.slotNos || []; // Ensure slotNos is an array
    mySlotNos.push(...slotNos);
  });

  console.log("All Slot Nos:", allSlotNos);
  console.log("My Slot Nos:", mySlotNos);

  // Function to create parking slot elements
  const createParkingSlot = (slotNumber) => {
    const parkingSpace = document.createElement("div");
    parkingSpace.classList.add("parking-space");
    parkingSpace.id = `slot-${slotNumber}`;
    parkingSpace.textContent = `Slot ${slotNumber}`;

    if (allSlotNos.includes(slotNumber)) {
      parkingSpace.style.backgroundColor = "gray";
      parkingSpace.textContent = "Booked";
      parkingSpace.style.pointerEvents = "none"; // Disable click events for booked slots
    } else {
      parkingSpace.style.backgroundColor = "white";
      parkingSpace.addEventListener("click", () => {
        parkingSpace.style.backgroundColor =
          parkingSpace.style.backgroundColor === "lightgreen" ? "white" : "lightgreen";

        const slotNum = parseInt(parkingSpace.id.replace("slot-", ""), 10);

        if (selectedSlots.includes(slotNum)) {
          setSelectedSlots((prev) => prev.filter((slot) => slot !== slotNum));
        } else {
          setSelectedSlots((prev) => [...prev, slotNum]);
        }
      });
    }

    return parkingSpace;
  };

  // Update parking status from API
  const updateParkingStatus = useCallback(() => {
    fetch("/api/slot")
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("parking-container-1").innerHTML = "";
        document.getElementById("parking-container-2").innerHTML = "";
        document.getElementById("parking-container-3").innerHTML = "";

        const bc1 = createParkingSlot("b1");
        document.getElementById("parking-container-2").appendChild(bc1);

        const bc2 = createParkingSlot("b2");
        document.getElementById("parking-container-3").appendChild(bc2);

        data.forEach((slot) => {
          const parkingContainer =
            slot.slot <= 24
              ? document.getElementById("parking-container-1")
              : slot.slot <= 46
              ? document.getElementById("parking-container-2")
              : document.getElementById("parking-container-3");

          const parkingSpace = createParkingSlot(slot.slot);
          parkingContainer.appendChild(parkingSpace);
        });
      })
      .catch((error) => {
        console.error("Error updating parking status:", error);
      });
  }, [createParkingSlot]);

  useEffect(() => {
    console.log("Selected Slots:", selectedSlots);
  }, [selectedSlots]);

  // Check if parking status should be updated
  useEffect(() => {
    if (!loading) {
      updateParkingStatus();
    }
  }, [loading]);

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-4">Book Your Parking Slot</h1>
      <p className="text-center mb-4 text-gray-700">
        Select your preferred slots and proceed with booking to secure your spot.
      </p>
      <Card className="max-w-4xl mx-auto mt-4">
        <CardHeader className="flex justify-center align-middle">
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
            <FaShoppingCart className="text-blue-500" />
            Parking Slot Booking
          </h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center">
              <FaMoneyCheck className="text-green-500 mr-2" />
              <p className="text-lg">
                Total Slots Selected: {selectedSlots.length}
              </p>
            </div>
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              <p className="text-lg">Click &quot;Book Now&quot; to confirm your booking.</p>
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="text-center flex justify-center align-middle">
          <button
            id="book-button"
            onClick={handlePayment}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Book Now
          </button>
        </CardFooter>
      </Card>
      <div className="container mt-4" id="container">
        <div className="parking-container" id="parking-container-1"></div>
        <div className="parking-container" id="parking-container-2"></div>
        <div className="parking-container" id="parking-container-3"></div>
      </div>
    </>
  );
};

export default Payment;
