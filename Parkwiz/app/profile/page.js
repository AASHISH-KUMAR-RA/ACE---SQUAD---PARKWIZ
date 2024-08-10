"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from "../context/userContext";
import { Avatar,Image,Button, Divider, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { Heading2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


const Profile = () => {
    const [user, setUser] = useState(null);
    const { userProfile, loading } = useUser(); 
    const router=useRouter()

    useEffect(() => {
        setUser(userProfile);
      }, [userProfile]);
      console.log(user)
      if (loading||!user) {
        return <div>Loading...</div>;
      }
      
      
  return (
    <>

    <Card className="card" >
      <CardHeader className="flex gap-3" id='center'>
      <Image
      width={250}
      height={250}
      radius="full"
      src={user.avatar}
    //   fallbackSrc="https://via.placeholder.com/300x200"
      alt="NextUI Image with fallback"
    />
      </CardHeader>
      <Divider/>
      <CardBody id='center'>
      <h2>Full Name</h2>
             <p>{user.name}</p>
 
             <h2>Email Address</h2>
             <p>{user.email}</p>
             <h2>phone Number</h2>
             <p>{user.phoneNo}</p>
             <h2>Joined</h2>
             <p>{String(user.createdAt).substring(0,10)}</p>
      </CardBody>
      <Divider/>
      <CardFooter id='center' className='gap-3'>
      <Button color="success" variant="ghost" radius='full' size='lg' className='btn' onClick={()=>{router.push("/profile/update_profile")}}>
        Update Profile
      </Button> 
      <Button color="danger" variant="ghost" radius='full' size='lg' className='btn' onClick={()=>{router.push("/user/change_password")}}>
        Change Password
      </Button> 
      </CardFooter>
    </Card>
 

    


    </>
  )
}

export default Profile