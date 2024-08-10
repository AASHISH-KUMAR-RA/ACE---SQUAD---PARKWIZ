// components/Dashboard.js
"use client";
import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
  Skeleton,
} from "@nextui-org/react";
import { FaUsers, FaBoxOpen, FaChartBar } from "react-icons/fa";

const Dashboard = () => {
  const { users, orders, prices, quantities } = useContext(DataContext);
  const isLoading = !users || !orders; // Add a condition to check if data is loading

  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-6 p-4">
      <Card className="w-full md:w-1/3" id="m">
        <CardHeader className="flex items-center gap-2 text-lg font-bold">
          <FaUsers />
          Users
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <Skeleton height="24px" />
          ) : (
            <p className="text-lg">
              {users.length} {users.length === 1 ? "User" : "Users"}
            </p>
          )}
        </CardBody>
        <CardFooter>
          <Link showAnchorIcon href="/admin/users">
            View All Users
          </Link>
        </CardFooter>
      </Card>

      <Card className="w-full md:w-1/3" id="m">
        <CardHeader className="flex items-center gap-2 text-lg font-bold">
          <FaBoxOpen />
          Orders
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <Skeleton height="24px" />
          ) : (
            <p className="text-lg">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </p>
          )}
        </CardBody>
        <CardFooter>
          <Link showAnchorIcon href="/admin/orders">
            View All Orders
          </Link>
        </CardFooter>
      </Card>

      <Card className="w-full md:w-1/3" id="m">
        <CardHeader className="flex items-center gap-2 text-lg font-bold">
          <FaChartBar />
          Statistics
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div>
              <Skeleton height="24px" className="mb-2" />
              <Skeleton height="24px" />
            </div>
          ) : (
            <div>
              <p className="text-lg">Total Price: ${prices}</p>
              <p className="text-lg">Total Quantity: {quantities}</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;
