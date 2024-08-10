"use client"

import { Card, CardHeader, CardBody, CardFooter, Divider, Link } from "@nextui-org/react";
import { FaMapMarkedAlt } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Dynamically import the Map component with no SSR
const DynamicMap = dynamic(() => import('../../components/location'), { ssr: false });

export default function Loc() {
  return (
    <>
      <div id="center">
        <Card className="max-w-md mx-auto shadow-lg border border-gray-200 rounded-lg overflow-hidden m-[3vw]">
          <CardHeader className="flex items-center p-4 bg-green-500 text-white">
            <FaMapMarkedAlt size={40} className="mr-4" /> {/* Map icon */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">Interactive Map</h2> {/* Title */}
              <p className="text-sm">Explore your surroundings with ease.</p> {/* Description */}
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-4">
            <p className="text-gray-700">
              Our interactive map component allows you to view and navigate through various locations with real-time updates. Use it to find points of interest, plan routes, and get accurate directions.
            </p>
          </CardBody>
          <Divider />
          <CardFooter className="p-4 text-right">
            <Link
              isExternal
              showAnchorIcon
              href="https://www.google.com/maps/place/Rajalakshmi+Engineering+College/@13.0085386,80.0008946,17z/data=!3m1!4b1!4m6!3m5!1s0x3a528c9ebac84723:0x18e2bf88dfefa3ed!8m2!3d13.0085334!4d80.0034695!16s%2Fm%2F0cn_c1y?entry=ttu"
              className="text-blue-500 hover:underline"
            >
              View on Google Map
            </Link>
          </CardFooter>
        </Card>
      </div>
      <DynamicMap /> {/* Dynamically imported Map component */}
    </>
  );
}
