"use client";

import React, { useEffect } from "react";
import axios from "axios";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Image,
  Button,
  Skeleton
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useUser } from "../app/context/userContext";

export default function Header() {
  const { userProfile, loading } = useUser(); // Ensure fetchUserProfile is provided by useUser
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure code runs on client side
      if (!loading && !userProfile) {
        // Check if the token cookie is set
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (token) {
          // If token exists, fetch user profile
          window.location.reload(); // Function to fetch user profile based on token
        } else {
          // Redirect to login if no token
          router.push("/user/login");
        }
      }
    }
  }, [userProfile, loading, router]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout");
      router.push('/'); // Redirect to the home page
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Navbar>
      <NavbarBrand>
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="logo.png"
          width={40}
        />
        <Link color="primary" onClick={() => router.push("/")}>
          <p className="font-bold text-inherit">PARKWIZ</p>
        </Link>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        {loading ? (
          <Skeleton className="flex rounded-full w-12 h-12" />
        ) : userProfile ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={userProfile.name}
                size="sm"
                src={userProfile.avatar}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{userProfile.email}</p>
              </DropdownItem>
              {userProfile.role === "admin" && (
                <DropdownItem key="dashboard" onClick={() => router.push("/admin/dashboard")}>
                  Dashboard
                </DropdownItem>
              )}
              <DropdownItem key="home" onClick={() => router.push("/")}>
                Home
              </DropdownItem>
              <DropdownItem key="profile" onClick={() => router.push("/profile")}>
                Profile
              </DropdownItem>
              <DropdownItem key="live_status" onClick={() => router.push("/pslive")}>
                Live Status
              </DropdownItem>
              <DropdownItem key="location" onClick={() => router.push("/location")}>
                Location
              </DropdownItem>
              <DropdownItem key="direction" onClick={() => router.push("/direction")}>
                Direction
              </DropdownItem>
              <DropdownItem key="navigation" onClick={() => router.push("/parking_navigation")}>
                Navigation
              </DropdownItem>
              <DropdownItem key="station" onClick={() => router.push("/station")}>
                Station
              </DropdownItem>
              <DropdownItem key="booking" onClick={() => router.push("/bookslot")}>
                Booking Slot
              </DropdownItem>
              <DropdownItem key="bookedslot" onClick={() => router.push("/myorders")}>
                Booked Slot
              </DropdownItem>
              <DropdownItem key="help_and_feedback" onClick={() => router.push("/contact_us")}>
                Contact Us
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button color="primary" onClick={() => router.push("/user/login")}>
            Sign In
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
}
