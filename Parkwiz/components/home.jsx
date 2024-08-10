"use client";
import { FaCar, FaMapMarkedAlt, FaDollarSign, FaUser } from "react-icons/fa";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HomeComponent() {
  useEffect(() => {
    AOS.init({
      duration: 1200, // Animation duration in ms
    });
  }, []);

  return (
    <div className="container mx-auto p-6" id="center">
      {/* Welcome Section */}


      {/* Features Section */}
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
      <div className="flex-1" data-aos="fade-up">
        <Card className="backdrop-blur-md shadow-lg p-8">
            <CardHeader className="flex flex-col items-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to ParkWiz
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 mb-6">
                ParkWiz offers a modern parking solution with real-time updates,
                secure payments, and personalized user experiences. Seamlessly
                navigate, book spots, and share your parking experiences.
              </p>
              <Button
                variant="solid"
                color="primary"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300"
              >
                Learn More
              </Button>
            </CardBody>
          </Card>
        </div>
        <Card
          className="backdrop-blur-md shadow-lg p-6"
          data-aos="fade-right"
        >
          <CardHeader className="flex items-center mb-4">
            <FaCar size={40} className="text-blue-500 mr-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Real-time Monitoring
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700">
              Use IoT sensors for real-time parking updates, optimizing space use
              for convenience.
            </p>
          </CardBody>
        </Card>

        <Card
          className="backdrop-blur-md shadow-lg p-6"
          data-aos="fade-right"
        >
          <CardHeader className="flex items-center mb-4">
            <FaMapMarkedAlt size={40} className="text-blue-500 mr-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Seamless Navigation
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700">
              Integrate with navigation apps for easy driving and parking
              experiences.
            </p>
          </CardBody>
        </Card>

        <Card
          className="backdrop-blur-md shadow-lg p-6"
          data-aos="fade-left"
        >
          <CardHeader className="flex items-center mb-4">
            <FaDollarSign size={40} className="text-blue-500 mr-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Dynamic Pricing
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700">
              Optimize revenue for parking operators and provide cost-effective
              options for users.
            </p>
          </CardBody>
        </Card>

        <Card
          className="backdrop-blur-md shadow-lg p-6"
          data-aos="fade-left"
        >
          <CardHeader className="flex items-center mb-4">
            <FaUser size={40} className="text-blue-500 mr-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              User Profiles
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700">
              Manage your parking needs through personalized profiles and secure
              payments.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
