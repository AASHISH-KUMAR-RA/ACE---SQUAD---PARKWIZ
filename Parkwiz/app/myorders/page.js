"use client";
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import Link from "next/link";
import axios from "axios";
import { Card } from "@nextui-org/react";
import { FaParking,FaTicketAlt } from "react-icons/fa"; 

export default function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const myOrders = async () => {
      try {
        const { data } = await axios.get("/api/order/myorders");
        console.log(data.orders);
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    myOrders();
  }, []);

  return (
<div className="flex flex-col justify-center align-middle m-[3vw]">


    <Card className="mb-6 p-4 shadow-lg bg-white rounded-lg">
      <div className="flex items-center">
        <FaParking className="text-3xl text-blue-500 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Booker Slot</h1>
          <p className="text-gray-600">
            Easily book and manage your parking slots. Select your desired spot and get directions directly from your starting point.
          </p>
        </div>
      </div>
    </Card>
 

    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Quantity</TableColumn>
        <TableColumn>Slot Nos</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Ticket</TableColumn>
      </TableHeader>
      <TableBody>
        {orders.map((order, index) => (
          <TableRow key={index}>
            <TableCell>{order.quantity || 0}</TableCell>
            <TableCell>{order.slotNos.join(", ") || []}</TableCell>
            <TableCell>{order.status || "process"}</TableCell>
            <TableCell>
              <Link href={`/order/${order._id}`}><FaTicketAlt color="blue"/> </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
