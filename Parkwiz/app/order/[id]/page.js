"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Image, Card, Divider, Skeleton } from "@nextui-org/react";
import { useUser } from "../../context/userContext";
import { FaCheckCircle, FaTimesCircle, FaBarcode } from "react-icons/fa";

const OrderPage = () => {
  const { id } = useParams(); // Get the 'id' from the URL parameters
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const { userProfile, loading } = useUser();
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    setUser(userProfile);
  }, [userProfile]);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const { data } = await axios.get(`/api/order/${id}`);
        setOrder(data.order);
        console.log("Order fetched:", data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoadingOrder(false);
      }
    };

    getOrder();
    console.log("Order ID:", id); // Log the ID to the console
  }, [id]);

  if (loading || loadingOrder) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-1/2 h-64" />
      </div>
    );
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  const { slotNos, quantity, totalPrice, status } = order;

  const qrContent = {
    name: user.name,
    id: order._id,
    paymentId: order.id,
    slotNos: slotNos ? slotNos.join(", ") : "",
  };

  const formattedQRContent = Object.entries(qrContent)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-lg p-6 shadow-lg rounded-lg bg-white">
        <h1 className="text-2xl font-bold mb-2">Order Details</h1>
        <Divider className="mb-4" />
        <div className="mb-4">
          <h4 className="text-xl font-semibold mb-1">Slot Info</h4>
          <p>
            <b>Name:</b> {user.name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Quantity:</b> {quantity}
          </p>
          <p>
            <b>Amount:</b> ${totalPrice}
          </p>
          <p>
            <b>Slot Nos:</b> {slotNos.join(", ")}
          </p>
          <p>
            <b>Payment Id:</b> {order.id}
          </p>
        </div>
        <Divider className="mb-4" />
        <div className="mb-4 flex items-center">
          <h4 className="text-xl font-semibold mb-1">Payment Status:</h4>
          <p className={`ml-2 ${status ? "text-green-500" : "text-red-500"}`}>
            {status ? (
              <FaCheckCircle className="inline-block mr-1" />
            ) : (
              <FaTimesCircle className="inline-block mr-1" />
            )}
            <b>{status}</b>
          </p>
        </div>
        <Divider className="mb-4" />
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Your Ticket</h2>
          <div className="border-2 border-dashed p-4">
            <Image
              width={300}
              alt="QR Code"
              src={`https://quickchart.io/qr?text=${encodeURIComponent(
                formattedQRContent
              )}`}
              className="mx-auto"
            />
            <p className="mt-2 text-gray-600 flex justify-center items-center">
              <FaBarcode className="mr-2" />
              Scan Here
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderPage;
