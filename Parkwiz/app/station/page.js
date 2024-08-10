"use client"
import { Card, CardHeader, CardBody, CardFooter, Divider, Link } from "@nextui-org/react";
import { FaGasPump } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Dynamically import the Station component with no SSR
const DynamicStation = dynamic(() => import('../../components/station'), { ssr: false });

export default function StationCard() {
  return (
    <>
      <div id="center">
        <Card className="max-w-md mx-auto shadow-lg border border-gray-200 rounded-lg overflow-hidden m-[3vw]">
          <CardHeader className="flex items-center p-4 bg-blue-500 text-white">
            <FaGasPump size={40} className="mr-4" /> {/* Station icon */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">Nearby Stations</h2> {/* Title */}
              <p className="text-sm">Find fuel and EV charging stations nearby.</p> {/* Description */}
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-4">
            <p className="text-gray-700">
              Discover the closest fuel and electric vehicle charging stations. Plan your journey efficiently with live updates and precise navigation. Check petrol prices, station details, and get directions to reach your destination smoothly.
            </p>
          </CardBody>
          <Divider />
          <CardFooter className="p-4 text-right">
            <Link
              isExternal
              showAnchorIcon
              href="https://www.google.com/maps/search/Fuel+Station/"
              className="text-blue-500 hover:underline"
            >
              View on Google Map
            </Link>
          </CardFooter>
        </Card>
      </div>
      <DynamicStation /> {/* Dynamically imported Station component */}
    </>
  );
}
