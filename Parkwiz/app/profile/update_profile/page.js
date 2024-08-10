"use client";
import { useState, useMemo, useEffect } from "react";
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
import { UploadDropzone } from "../../utils/uploadthing";
import EyeOpen from "../../../components/icon/EyeOpen";
import EyeClose from "../../../components/icon/EyeClose";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/userContext";

export default function Register() {
  const { userProfile, loading } = useUser();

  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUser(userProfile);
  }, [userProfile]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatar(user.avatar || "");
      setPhoneNo(user.phoneNo || "");
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const toggleVisibility = () => setIsVisible(!isVisible);


  const handleUploadComplete = (res) => {
    if (res && res.length > 0) {
      setAvatar(res[0].url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      email,
      phoneNo,
      avatar
    };

    try {
      const response = await fetch(`/api/user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed");
    }
  };

  const handleClearForm = () => {
    setName("");
    setEmail("");
    setAvatar("");
    setPhoneNo("");
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
            <p className="text-small text-default-500">Register Page</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="m-10">
          <form
            className="flex flex-col align-middle gap-3 p-10"
            onSubmit={handleSubmit}
          >
            <Input
              isClearable
              isRequired
              label="Name"
              variant="bordered"
              description="Your name will appear on your profile and ticket."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-xs"
            />
            <Input
              isClearable
              isRequired
              type="email"
              label="Email"
              variant="bordered"
              
              description="We'll never share your email with anyone else."
              
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              errorMessage="Please enter a valid email"
              className="max-w-xs"
            />
            
            <div className="phone_input">
              <PhoneInput
                defaultCountry="IN"
                placeholder="Enter phone number"
                value={phoneNo}
                onChange={setPhoneNo}
                className="pn"
              />
            </div>
            {avatar && (
              <div className="flex flex-col items-center mb-4">
                <Image
                  src={avatar}
                  alt="Avatar"
                  className="rounded-full"
                  height={100}
                  width={100}
                />
                <Button
                  onClick={() => setAvatar("")}
                  className="mt-2"
                  size="sm"
                  color="danger"
                >
                  Change Avatar
                </Button>
              </div>
            )}
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error) => alert(`ERROR! ${error.message}`)}
            />
            <Button color="primary" type="submit">
              Register
            </Button>
            <Button color="secondary" onClick={handleClearForm}>
              Clear Form
            </Button>
          </form>
        </CardBody>
        <Divider />
        <CardFooter>
          <p>Go to profile </p>
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
