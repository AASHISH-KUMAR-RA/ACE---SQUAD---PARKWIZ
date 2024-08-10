"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Input, Textarea } from '@nextui-org/react';
import emailjs from 'emailjs-com';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userMessage: '',
  });

  const [isSent, setIsSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send email to us
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        formData,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      )
      .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
      })
      .catch((err) => {
        console.error('Failed to send email:', err);
      });

    // Send email to user
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_USER,
        { ...formData, to_email: formData.userEmail }, // Pass user's email
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      )
      .then((response) => {
        console.log('Email sent to USER successfully:', response.status, response.text);
        setIsSent(true);
      })
      .catch((err) => {
        console.error('Failed to send email to USER:', err);
      });
  };

  return (
    <Card className="max-w-[400px] mx-auto mt-10">
      <CardHeader className="flex flex-col gap-3 text-center">
        <h2 className="text-xl font-bold">Contact Us</h2>
        <p className="text-small text-default-500">
          We&apos;d love to hear from you! Send us a message and we&apos;ll respond as soon as possible.
        </p>
      </CardHeader>
      <Divider />
      <CardBody>
        {!isSent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              fullWidth
              clearable
              name="userName"
              placeholder="Your Name"
              onChange={handleChange}
              value={formData.userName}
            />
            <Input
              fullWidth
              clearable
              name="userEmail"
              type="email"
              placeholder="Your Email"
              onChange={handleChange}
              value={formData.userEmail}
            />
            <Textarea
              fullWidth
              name="userMessage"
              placeholder="Your Message"
              onChange={handleChange}
              value={formData.userMessage}
              rows={4}
            />
            <Button type="submit" className="bg-blue-500 text-white mt-2">
              Send Message
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-lg text-green-600">Thank you! Your message has been sent.</p>
          </div>
        )}
      </CardBody>
      <Divider />
      <CardFooter className="text-center">
        <p>Follow us on social media for the latest updates.</p>
      </CardFooter>
    </Card>
  );
    }
                        
