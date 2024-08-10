"use client";
import { useState, useMemo } from "react";
import { Input, Button,Card,CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { UploadDropzone } from "../../utils/uploadthing";
import EyeOpen from "../../../components/icon/EyeOpen";
import EyeClose from "../../../components/icon/EyeClose";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useRouter } from "next/navigation";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router=useRouter()

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isInvalidEmail = useMemo(() => {
    if (email === "") return false;
    return validateEmail(email) ? false : true;
  }, [email]);

  const isInvalidPassword = useMemo(() => password.length < 6, [password]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email,
      password,
    };

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }
     router.push("/")
      
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed");
    }
  };

  return (
    <div id="card">
    <Card >
    <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="logo.png"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">PARKWIZ</p>
          <p className="text-small text-default-500">Login Page</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody className="flex flex-col align-middle" >
    <form className="flex flex-col align-middle gap-3 p-10"onSubmit={handleSubmit}>
      
      <Input
        isClearable
        isRequired
        type="email"
        label="Email"
        variant="bordered"
        isInvalid={isInvalidEmail}
        description="We'll never share your email with anyone else."
        color={isInvalidEmail ? "danger" : "success"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMessage="Please enter a valid email"
        className="max-w-xs"
      />
      <Input
        isRequired
        isInvalid={isInvalidPassword}
        description="Don't share your password with anyone."
        color={isInvalidPassword ? "danger" : "success"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        errorMessage="Password must be at least 6 characters long."
        label="Password"
        variant="bordered"
        placeholder="Enter your password"
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
      <div className="w-full text-end"><Link className="text-blue-600" onClick={()=>{router.push("/user/reset")}}>Forget Password</Link></div>
     
      <Button color="primary" type="submit">
        Login
      </Button>
    </form>
    </CardBody>
    <Divider/>
      <CardFooter>
        <p>Need an account? </p>
        <span>
        <Link
          className="text-blue-600"
          showAnchorIcon
          onClick={()=>{router.push("/user/register")}}
        >
          Sign Up
        </Link>
        </span>
        
      </CardFooter>
    </Card>
    </div>
  );
}
