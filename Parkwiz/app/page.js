"use client";

import { useEffect } from "react";
import { Skeleton } from "@nextui-org/react";
import { useUser } from "./context/userContext";
import HomeComponent from "../components/home";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const { userProfile, loading } = useUser();

  useEffect(() => {
    AOS.init({
      duration: 1200, // Animation duration in ms
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-[100vw] h-[100vh]" /> {/* Adjust width and height as needed */}
      </div>
    );
  }

  return <HomeComponent />;
}
