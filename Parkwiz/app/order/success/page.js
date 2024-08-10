"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { BsCheckCircle } from "react-icons/bs"; // Import the check circle icon
import Link from "next/link"; // Correct import for Next.js routing

const PaymentSuccess = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="max-w-md mx-auto shadow-lg rounded-lg bg-white">
        <CardHeader className="text-center p-4">
          <div className="flex justify-center mb-2">
            <BsCheckCircle className="text-green-500 text-6xl" /> {/* React icon */}
          </div>
          <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
        </CardHeader>
        <CardBody className="p-6">
          <p className="text-center text-gray-700">
            Thank you for your purchase! Your payment was processed successfully.
          </p>
        </CardBody>
        <CardFooter className="text-center p-4">
          <p className="text-blue-500">
            <Link href="/myorders">
              View Your Orders
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
