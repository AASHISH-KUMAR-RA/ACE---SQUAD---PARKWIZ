// app/user/[id]/changePassword/page.js

"use client";
import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import EyeOpen from "../../../components/icon/EyeOpen";
import EyeClose from "../../../components/icon/EyeClose";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/userContext";

export default function ChangePassword() {
  const { userProfile, loading } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  // Set user ID when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setUserId(userProfile._id);
    }
  }, [userProfile]);

  // Show loading indicator while fetching user profile
  if (loading || !userId) {
    return <div>Loading...</div>;
  }

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Validation functions
  const isInvalidOldPassword = () => oldPassword.length < 6;
  const isInvalidNewPassword = () => newPassword.length < 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      oldPassword,
      password: newPassword,
    };

    try {
      const response = await fetch(`/api/user/change_password/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Parse the response
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to change password");
      }

      alert("Password changed successfully");
      router.push("/"); // Redirect to home page or any other page
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Password change failed");
    }
  };

  return (
    <div className="flex justify-center align-middle">
      <Card className="card">
        <CardHeader className="flex gap-3">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="https://utfs.io/f/a9b8f892-fc28-48d6-be0a-3a22f2dc0d06-d48s3m.png"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">PARKWIZ</p>
            <p className="text-small text-default-500">Change Password</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="m-10">
          <form
            className="flex flex-col align-middle gap-3 p-10"
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              isInvalid={isInvalidOldPassword()}
              description="Enter your current password."
              color={isInvalidOldPassword() ? "danger" : "success"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              errorMessage="Password must be at least 6 characters long."
              label="Old Password"
              variant="bordered"
              placeholder="Enter your old password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? <EyeOpen /> : <EyeClose />}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="max-w-xs"
            />
            <Input
              isRequired
              isInvalid={isInvalidNewPassword()}
              description="Enter your new password."
              color={isInvalidNewPassword() ? "danger" : "success"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              errorMessage="Password must be at least 6 characters long."
              label="New Password"
              variant="bordered"
              placeholder="Enter your new password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? <EyeOpen /> : <EyeClose />}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="max-w-xs"
            />
            <Button color="primary" type="submit">
              Change Password
            </Button>
          </form>
        </CardBody>
        <Divider />
        <CardFooter>
          <p>Back to </p>
          <span>
            <Link
              className="text-blue-600"
              showAnchorIcon
              onClick={() => {
                router.push("/profile");
              }}
            >
              Profile
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
